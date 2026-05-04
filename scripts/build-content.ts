import { globSync } from "fs";
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

interface NoteManifest {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  connections: string[];
  htmlContent: string;
  wordCount: number;
  coverImage?: string;
  coverAlt?: string;
}

const VAULT_DIR = join(import.meta.dir, "..", "vault");
const PUBLIC_DIR = join(import.meta.dir, "..", "public");

function normalizeImagePath(src: string) {
  return src.replace(/^\.\/(attachments\/)/, "/vault/$1");
}

async function buildContent() {
  const postsDir = join(VAULT_DIR, "posts");
  const files = globSync(join(postsDir, "*.md"));

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false });

  const notes: NoteManifest[] = [];

  for (const filePath of files) {
    const raw = readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    // Fix image paths: ./attachments/ -> /vault/attachments/
    const fixedContent = content.replace(/\.\/(attachments\/)/g, "/vault/$1");
    const firstImageMatch = fixedContent.match(/!\[([^\]]*)\]\(([^)]+)\)/);

    const result = await processor.process(fixedContent);
    const htmlContent = String(result);

    const wordCount = content
      .replace(/[#*\[\]()!`]/g, "")
      .split(/\s+/)
      .filter(Boolean).length;

    const slug = basename(filePath, ".md");

    notes.push({
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
      description: data.description || "",
      tags: data.tags || [],
      connections: data.connections || [],
      htmlContent,
      wordCount,
      coverImage: firstImageMatch
        ? normalizeImagePath(firstImageMatch[2].trim())
        : data.coverImage
          ? normalizeImagePath(String(data.coverImage))
          : undefined,
      coverAlt: firstImageMatch?.[1]?.trim() || data.coverAlt || data.title || slug,
    });
  }

  // Sort by date descending
  notes.sort((a, b) => (a.date > b.date ? -1 : 1));

  // Write manifest
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(
    join(PUBLIC_DIR, "content-manifest.json"),
    JSON.stringify(notes, null, 2)
  );

  // Copy attachments
  const attachmentsSrc = join(VAULT_DIR, "attachments");
  const attachmentsDst = join(PUBLIC_DIR, "vault", "attachments");
  mkdirSync(attachmentsDst, { recursive: true });
  cpSync(attachmentsSrc, attachmentsDst, { recursive: true });

  console.log(`Built ${notes.length} notes → public/content-manifest.json`);
}

buildContent().catch(console.error);

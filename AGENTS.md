
Default to using Bun instead of Node.js.

- Use `bun run <script>` for scripts
- Use `bun install` for deps
- Use `bun run dev` for dev server (Vite)
- Use `bun run build` for production builds

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + D3.js

## Content

- Vault posts live in `vault/posts/*.md` with YAML frontmatter
- `scripts/build-content.ts` generates `public/content-manifest.json`
- Images in `vault/attachments/`

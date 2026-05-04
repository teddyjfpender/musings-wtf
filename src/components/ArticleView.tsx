import { useParams, useNavigate } from "react-router-dom";
import { useContent } from "../App";
import { getTagColor } from "../lib/colors";

export default function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const { notes, loading } = useContent();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--paper)]">
        <div className="font-mono text-xs text-[var(--muted)] animate-pulse">
          loading...
        </div>
      </div>
    );
  }

  const note = notes.find((n) => n.slug === slug);
  if (!note) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[var(--paper)]">
        <div className="mb-4 font-serif text-lg text-[var(--ink)]">note not found</div>
        <button
          onClick={() => navigate("/")}
          className="font-mono text-xs text-[var(--muted)] transition hover:text-[var(--ink)]"
        >
          back to garden
        </button>
      </div>
    );
  }

  const connectedNotes = notes.filter((n) =>
    note.connections.includes(n.slug)
  );

  const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const readingTime = Math.max(1, Math.ceil(note.wordCount / 250));

  return (
    <div className="min-h-screen w-full bg-[var(--paper)] text-[var(--ink)]">
      <nav className="sticky top-0 z-20 border-b border-[var(--hairline)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-12 w-full max-w-[800px] items-center justify-between px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-70">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            garden
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
            musings.wtf
          </span>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-14">
        <header className="mb-12 text-center">
          <div className="mb-5 flex flex-wrap justify-center gap-x-2 gap-y-1 font-mono text-[10px] text-[var(--muted)]">
            {note.tags.map((tag) => (
              <span
                key={tag}
                style={{ color: `${getTagColor(tag)}cc` }}
              >
                [{tag}]
              </span>
            ))}
          </div>

          <h1 className="mx-auto mb-5 max-w-[720px] font-serif text-[clamp(2.1rem,7vw,4.25rem)] font-normal leading-[0.98] text-[var(--ink)]">
            {note.title}
          </h1>

          {note.description && (
            <div className="mx-auto mb-7 max-w-[620px] border-y border-[var(--hairline)] py-5">
              <p className="font-serif text-lg leading-[1.35] text-[var(--ink)]">
                <span className="font-bold">Abstract.</span>{" "}
                {note.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 border-y border-[var(--hairline)] py-3 text-left font-mono text-[11px] text-[var(--muted)] max-sm:grid-cols-1">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">Date</span>
              {formattedDate}
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">Time</span>
              {readingTime} min read
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">Length</span>
              {note.wordCount.toLocaleString()} words
            </div>
          </div>
        </header>

        <article
          className="prose prose-garden max-w-none"
          dangerouslySetInnerHTML={{ __html: note.htmlContent }}
        />

        {connectedNotes.length > 0 && (
          <section className="mt-16 border-t border-[var(--hairline)] pt-8">
            <h3 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--muted)]">
              Connected Notes
            </h3>
            <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {connectedNotes.map((cn) => {
                return (
                  <button
                    key={cn.slug}
                    onClick={() => navigate(`/note/${cn.slug}`)}
                    className="group flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors hover:bg-[var(--paper-soft)]"
                  >
                    <div className="min-w-0">
                      <div className="font-serif text-lg leading-tight text-[var(--ink)] underline decoration-[var(--hairline)] underline-offset-4 group-hover:decoration-[var(--ink)]">
                        {cn.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
                        {cn.tags.slice(0, 2).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-[var(--muted)]">
                      {new Date(cn.date).getFullYear()}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <footer className="mt-20 flex items-center justify-between border-t border-[var(--hairline)] pt-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-50">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            back to garden
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--faint)]">
            musings.wtf
          </span>
        </footer>
      </main>
    </div>
  );
}

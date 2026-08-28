import { extractHeadings, readingTime } from '@/lib/markdown/parse';

/**
 * Reading time and a contents list, both derived from the Markdown itself so
 * neither can fall out of step with the document.
 */
export function DocumentMeta({ source }: { source: string }) {
  const minutes = readingTime(source);
  const headings = extractHeadings(source).filter((heading) => heading.depth === 2);

  return (
    <div className="mb-14 flex flex-col gap-6">
      <p className="u-label" style={{ color: 'var(--ink-faint)' }}>
        {minutes} min read
      </p>

      {headings.length > 1 ? (
        <nav aria-label="Contents" className="flex flex-col gap-2">
          <p className="u-label" style={{ color: 'var(--ink-faint)' }}>
            Contents
          </p>
          <ol className="flex flex-col gap-1.5">
            {headings.map((heading, index) => (
              <li key={heading.id} className="flex gap-3 text-sm">
                <span
                  className="font-[family-name:var(--font-mono)] text-xs"
                  style={{ color: 'var(--accent)', minWidth: '1.6em' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <a href={`#${heading.id}`} style={{ color: 'var(--ink-muted)' }}>
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}

import Link from 'next/link';
import { extractHeadings, readingTime } from '@/lib/markdown/parse';

interface RailProps {
  source: string;
  backHref: string;
  backLabel: string;
  meta?: { label: string; value: string }[];
  tags?: string[];
}

/**
 * The document's left rail: where to go back to, what this is, and where you
 * are in it. Sticky on wide screens, which is what earns the second column —
 * it stays useful the whole way down rather than scrolling away.
 */
export function DocumentRail({ source, backHref, backLabel, meta = [], tags = [] }: RailProps) {
  const minutes = readingTime(source);
  const headings = extractHeadings(source).filter((heading) => heading.depth === 2);

  return (
    <aside className="doc-rail">
      <Link href={backHref} className="u-label" style={{ color: 'var(--accent)' }}>
        ← {backLabel}
      </Link>

      <dl className="flex flex-col gap-4">
        {meta.map((entry) => (
          <div key={entry.label}>
            <dt className="u-label" style={{ color: 'var(--ink-faint)' }}>
              {entry.label}
            </dt>
            <dd className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
              {entry.value}
            </dd>
          </div>
        ))}
        <div>
          <dt className="u-label" style={{ color: 'var(--ink-faint)' }}>
            Length
          </dt>
          <dd className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
            {minutes} min read
          </dd>
        </div>
      </dl>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="u-label px-2.5 py-1"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--edge)',
                color: 'var(--ink-muted)',
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {headings.length > 1 ? (
        <nav aria-label="Contents" className="flex flex-col gap-3">
          <p className="u-label" style={{ color: 'var(--ink-faint)' }}>
            Contents
          </p>
          <ol className="flex flex-col gap-2.5">
            {headings.map((heading, index) => (
              <li key={heading.id} className="flex gap-3 text-sm leading-snug">
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
    </aside>
  );
}

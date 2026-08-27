import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { Publication } from '@/content/schema';

export function Publications({ items }: { items: Publication[] }) {
  return (
    <Section
      id="research"
      eyebrow="Research"
      title="Published work"
      lede="Peer-reviewed conference work in rotor and turbine aerodynamics, using both mid-fidelity and high-fidelity methods."
    >
      <div className="flex flex-col gap-4">
        {items.map((paper) => (
          <GlassPanel key={paper.id} as="article" flowBody className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {paper.selfIndex === 0 ? (
                <span
                  className="u-label px-2.5 py-1"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                  }}
                >
                  First author
                </span>
              ) : null}
              <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
                {paper.venue} · {paper.year}
              </span>
            </div>

            <h3
              className="mt-4 text-balance"
              style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}
            >
              <a href={paper.href} target="_blank" rel="noreferrer noopener">
                {paper.title}
              </a>
            </h3>

            <p className="mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
              {paper.authors.map((author, index) => (
                <span key={author}>
                  {index > 0 ? ', ' : ''}
                  <span
                    style={
                      index === paper.selfIndex
                        ? { color: 'var(--ink)', fontWeight: 600 }
                        : undefined
                    }
                  >
                    {author}
                  </span>
                </span>
              ))}
            </p>

            {paper.abstract ? (
              <p className="u-measure mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                {paper.abstract}
              </p>
            ) : null}

            {paper.doi ? (
              <p
                className="mt-4 font-[family-name:var(--font-mono)] text-xs"
                style={{ color: 'var(--ink-faint)' }}
              >
                doi:{paper.doi}
              </p>
            ) : null}
          </GlassPanel>
        ))}
      </div>
    </Section>
  );
}

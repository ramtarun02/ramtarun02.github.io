import Link from 'next/link';
import Image from 'next/image';
import { Reveal, Section } from './Section';
import type { CaseStudy, SectionCopy } from '@/content/schema';

/** The homepage's one case study, presented big. */
export function CaseStudyFeature({
  copy,
  study,
}: {
  copy: SectionCopy;
  study: CaseStudy | undefined;
}) {
  if (!study) return null;
  const href = `/work/${study.slug}`;

  return (
    <Section id="case-study" copy={copy} wide>
      <Reveal>
        <Link
          href={href}
          className="cs-feature glass panel-interactive"
          aria-label={`Read the case study: ${study.title}`}
        >
          <div className="cs-visual" aria-hidden="true">
            <Image
              src="/case-studies/aerospike/schlieren_amr.webp"
              alt=""
              fill
              sizes="(max-width: 1400px) 100vw, 1360px"
              className="cs-schlieren"
            />
            <div className="cs-visual-tint" />
            <span className="cs-visual-label u-label">Numerical schlieren · M∞ = 6.06</span>
          </div>

          <div className="cs-body">
            <div className="cs-intro">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {study.tools.slice(0, 3).map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="cs-title">{study.title}</h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--ink-muted)',
                  fontSize: 'var(--text-lg)',
                  lineHeight: 1.55,
                }}
              >
                {study.thesis}
              </p>
            </div>
            <div className="cs-side">
              {study.stats.length ? (
                <dl className="cs-stats">
                  {study.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="u-gradient-text">{s.value}</dt>
                      <dd>{s.label}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <span className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                Read the case study <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      </Reveal>

      <style>{`
        .cs-feature { display: flex; flex-direction: column; border-radius: var(--radius-xl);
          overflow: hidden; text-decoration: none; color: inherit; }
        .cs-visual { position: relative; aspect-ratio: 1279 / 470; background: #02050c; overflow: hidden;
          -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%); mask-image: linear-gradient(180deg, #000 55%, transparent 100%); }
        .cs-schlieren { object-fit: cover; filter: invert(1) brightness(1.1) contrast(1.25);
          transform: scale(1.01); transition: transform 1.6s cubic-bezier(0.2,0.8,0.2,1); }
        .cs-feature:hover .cs-schlieren { transform: scale(1.05); }
        .cs-visual-tint { position: absolute; inset: 0; mix-blend-mode: multiply;
          background: linear-gradient(110deg, #7dd3fc 0%, #818cf8 55%, #c4b5fd 100%); }
        .cs-visual::after { content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(4,7,15,0.35), transparent 30%); }
        .cs-visual-label { position: absolute; left: 24px; top: 20px; z-index: 1; color: rgba(224,242,254,0.85); }
        .cs-body { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 20px 48px;
          padding: 0 clamp(1.5rem, 4vw, 3rem) clamp(1.75rem, 4vw, 3rem); margin-top: -40px; position: relative; z-index: 1; }
        .cs-intro { display: flex; flex-direction: column; gap: 18px; }
        .cs-side { display: flex; flex-direction: column; gap: 22px; justify-content: flex-end; }
        .cs-title { margin: 0; font-size: var(--text-3xl); font-weight: 700; letter-spacing: -0.04em; line-height: 1.08; text-wrap: balance; }
        .cs-stats { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px 20px; margin: 0; padding: 18px 0;
          border-top: 1px solid var(--edge); border-bottom: 1px solid var(--edge); }
        .cs-stats dt { font-size: var(--text-2xl); font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; }
        .cs-stats dd { margin: 4px 0 0; font-size: 13.5px; color: var(--ink-faint); line-height: 1.4; }
        @media (max-width: 900px) {
          .cs-body { grid-template-columns: 1fr; margin-top: -10px; }
          .cs-visual { aspect-ratio: 16 / 9; }
        }
      `}</style>
    </Section>
  );
}

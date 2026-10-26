import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { Markdown } from '@/components/markdown/Markdown';
import { DocumentRail } from '@/components/markdown/DocumentRail';
import { caseStudies, caseStudyBySlug, profile } from '@/content';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.thesis,
    openGraph: {
      title: study.title,
      description: study.thesis,
      images: study.cover ? [study.cover] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <SiteHeader name={profile.name} onHome={false} />
      <main id="main">
        <header
          style={{
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 'clamp(7rem, 14vw, 10rem)',
            paddingBottom: 'clamp(2.5rem, 6vw, 4rem)',
          }}
        >
          {study.cover ? (
            <div
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, zIndex: -1, background: '#02050c' }}
            >
              <Image
                src={study.cover}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover', filter: 'invert(1) contrast(1.3)', opacity: 0.55 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  mixBlendMode: 'multiply',
                  background: 'linear-gradient(120deg, #7dd3fc, #818cf8 60%, #c4b5fd)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(7,12,26,0.55) 0%, rgba(7,12,26,0.75) 55%, var(--night-900) 100%)',
                }}
              />
            </div>
          ) : null}

          <div className="shell-wide">
            <p className="eyebrow">{study.domain}</p>
            <h1
              className="u-display"
              style={{ fontSize: 'var(--text-5xl)', margin: '18px 0 0', maxWidth: '18ch' }}
            >
              {study.title}
            </h1>
            <p
              style={{
                margin: '14px 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                color: 'var(--ice-200)',
              }}
            >
              {study.subtitle}
            </p>
            <p
              style={{
                margin: '22px 0 0',
                fontSize: 'var(--text-xl)',
                color: 'var(--ink-muted)',
                maxWidth: '60ch',
                lineHeight: 1.5,
              }}
            >
              {study.thesis}
            </p>

            {study.stats.length ? (
              <dl className="cs-head-stats">
                {study.stats.map((s) => (
                  <div
                    key={s.label}
                    className="glass"
                    style={{ borderRadius: 20, padding: '16px 18px' }}
                  >
                    <dt
                      className="u-gradient-text"
                      style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                      }}
                    >
                      {s.value}
                    </dt>
                    <dd
                      style={{
                        margin: '6px 0 0',
                        fontSize: 13,
                        color: 'var(--ink-muted)',
                        lineHeight: 1.4,
                      }}
                    >
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </header>

        <div className="shell-wide" style={{ paddingBottom: 'clamp(4rem, 9vw, 7rem)' }}>
          {study.tldr.length ? (
            <section
              aria-labelledby="tldr"
              className="glass"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                marginBottom: 'clamp(2.5rem, 6vw, 4rem)',
                background:
                  'linear-gradient(160deg, rgba(125,211,252,0.1), rgba(129,140,248,0.06) 60%, rgba(255,255,255,0.03))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <h2
                  id="tldr"
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-xl)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                  }}
                >
                  The short version
                </h2>
                <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>
                  for anyone with two minutes — the detail follows
                </span>
              </div>
              <ul className="tldr-list">
                {study.tldr.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="doc-grid">
            <DocumentRail
              source={study.body}
              backHref="/#case-study"
              backLabel="Back to home"
              meta={[
                { label: 'Year', value: String(study.year) },
                { label: 'Author', value: profile.name },
              ]}
              tags={study.tools}
            />
            <article style={{ minWidth: 0 }}>
              <Markdown source={study.body} />
              {study.credit ? (
                <p
                  style={{
                    marginTop: 64,
                    paddingTop: 20,
                    borderTop: '1px solid var(--edge)',
                    fontSize: 13,
                    color: 'var(--ink-faint)',
                    maxWidth: 'var(--measure)',
                  }}
                >
                  {study.credit}
                </p>
              ) : null}
            </article>
          </div>
        </div>
      </main>
      <SiteFooter name={profile.name} />

      <style>{`
        .cs-head-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 36px 0 0; max-width: 980px; }
        .tldr-list { margin: 18px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 28px; }
        .tldr-list li { position: relative; padding-left: 22px; color: #d5e0f5; line-height: 1.6; font-size: var(--text-sm); }
        .tldr-list li::before { content: ''; position: absolute; left: 2px; top: 0.6em; width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #7dd3fc, #818cf8); box-shadow: 0 0 10px rgba(125,211,252,0.7); }
        @media (max-width: 860px) {
          .cs-head-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .tldr-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

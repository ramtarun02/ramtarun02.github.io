import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { caseStudies, profile, sections } from '@/content';

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Long-form CFD write-ups: the setup, what broke, and what it taught me.',
};

export default function WorkIndexPage() {
  return (
    <>
      <SiteHeader name={profile.name} onHome={false} />
      <main
        id="main"
        className="shell"
        style={{ paddingTop: 'clamp(8rem, 15vw, 11rem)', paddingBottom: '6rem' }}
      >
        <p className="eyebrow">{sections.caseStudies.eyebrow}</p>
        <h1 className="section-title" style={{ fontSize: 'var(--text-5xl)' }}>
          {sections.caseStudies.title}
        </h1>
        <p className="section-lede">{sections.caseStudies.lede}</p>

        <div style={{ display: 'grid', gap: 20, marginTop: 48 }}>
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/work/${study.slug}`}
              className="glass panel-interactive"
              style={{
                display: 'block',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="chip">{study.domain}</span>
                <span className="chip chip--muted">{study.year}</span>
              </div>
              <h2
                style={{
                  margin: '16px 0 8px',
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                {study.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: 'var(--ink-muted)',
                  fontSize: 'var(--text-lg)',
                  maxWidth: '65ch',
                }}
              >
                {study.thesis}
              </p>
              <p style={{ margin: '20px 0 0', color: 'var(--accent)', fontWeight: 700 }}>
                Read the study →
              </p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter name={profile.name} />
    </>
  );
}

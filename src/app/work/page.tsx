import type { Metadata } from 'next';
import Link from 'next/link';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { caseStudies, profile, sections } from '@/content';

export const metadata: Metadata = {
  title: 'Case studies',
  description:
    'Transonic solver limits, RANS verification and rotor solver architecture — written up in full.',
};

export default function WorkIndexPage() {
  return (
    <>
      <SiteHeader name={profile.name} />
      <main className="shell pt-32 pb-24 sm:pt-40">
        <p className="u-label" style={{ color: 'var(--accent)' }}>
          {sections.caseStudies.eyebrow}
        </p>
        <h1
          className="mt-4 tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            lineHeight: 1.02,
          }}
        >
          {sections.caseStudies.title}
        </h1>
        <p
          className="u-measure mt-6"
          style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}
        >
          Each of these follows the same spine — question, method, evidence, limit — because the
          limit is the part most write-ups leave out, and it is usually the part worth reading.
        </p>

        <div className="mt-16 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {caseStudies.map((study) => (
            <Link key={study.id} href={`/work/${study.slug}`} className="group block">
              <GlassPanel as="article" radius="xl" interactive className="p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="u-label" style={{ color: 'var(--accent)' }}>
                    {study.domain}
                  </span>
                  <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
                    {study.year}
                  </span>
                </div>
                <h2
                  className="mt-4 tracking-tight text-balance"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-3xl)',
                    lineHeight: 1.1,
                  }}
                >
                  {study.title}
                </h2>
                <p
                  className="mt-3 font-[family-name:var(--font-mono)] text-sm"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {study.subtitle}
                </p>
                <p className="u-measure mt-5" style={{ fontSize: 'var(--text-lg)' }}>
                  {study.thesis}
                </p>
                <p className="mt-6 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  Read the study →
                </p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter name={profile.name} />
    </>
  );
}

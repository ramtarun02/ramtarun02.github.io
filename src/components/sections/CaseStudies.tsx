import Link from 'next/link';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { CaseStudy, SectionCopy } from '@/content/schema';

export function CaseStudies({ studies, copy }: { studies: CaseStudy[]; copy: SectionCopy }) {
  return (
    <Section id="work" copy={copy}>
      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
        {studies.map((study) => (
          <Link key={study.id} href={`/work/${study.slug}`} className="block">
            <GlassPanel as="article" interactive className="flex h-full flex-col p-7">
              <p className="u-label" style={{ color: 'var(--accent)' }}>
                {study.domain}
              </p>
              <h3
                className="mt-4 text-balance"
                style={{ fontSize: 'var(--text-xl)', fontWeight: 600, lineHeight: 1.2 }}
              >
                {study.title}
              </h3>
              <p className="mt-4 flex-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
                {study.thesis}
              </p>
              <p className="mt-6 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Read the study →
              </p>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </Section>
  );
}

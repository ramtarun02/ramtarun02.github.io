import Link from 'next/link';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { CaseStudy } from '@/content/schema';

export function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  return (
    <Section
      id="work"
      eyebrow="Case studies"
      title="Three studies, one question"
      lede="Each asks where a method stops being trustworthy — in a transonic solver, in a mesh refinement study, and in a rotor code's empirical closures."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {studies.map((study) => (
          <Link key={study.id} href={`/work/${study.slug}`} className="block">
            <GlassPanel as="article" flowBody className="flex h-full flex-col p-7">
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

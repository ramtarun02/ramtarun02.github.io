import { Section } from './Section';
import type { Profile } from '@/content/schema';

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" eyebrow="About" title="Where methods stop being trustworthy">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        <div className="flex flex-col gap-5">
          {profile.summaryLong.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="u-measure"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="flex flex-col gap-6 md:w-56">
          <Fact label="Based in" value={profile.location} />
          <Fact label="Focus" value="Transonic aerodynamics, solver development" />
          <Fact label="ORCID" value="0009-0009-1879-9117" mono />
        </dl>
      </div>
    </Section>
  );
}

function Fact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="u-label" style={{ color: 'var(--ink-faint)' }}>
        {label}
      </dt>
      <dd
        className="mt-1.5 text-sm"
        style={{ color: 'var(--ink-muted)', fontFamily: mono ? 'var(--font-mono)' : undefined }}
      >
        {value}
      </dd>
    </div>
  );
}

import type { Metadata } from 'next';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SpecimenBackdrop } from '@/components/glass/SpecimenBackdrop';
import { MotionSpecimens } from './MotionSpecimens';

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Glass primitives, tokens and motion, rendered in isolation.',
  robots: { index: false, follow: false },
};

const VELOCITY_RAMP = [
  ['--color-vel-0', '#0b1b3a'],
  ['--color-vel-1', '#14407e'],
  ['--color-vel-2', '#1e6fc4'],
  ['--color-vel-3', '#3fd2ee'],
  ['--color-vel-4', '#5fe3c0'],
  ['--color-vel-5', '#a8e063'],
  ['--color-vel-6', '#f2b24c'],
] as const;

const TYPE_SCALE = [
  ['6xl', 'var(--text-6xl)', 'display'],
  ['5xl', 'var(--text-5xl)', 'display'],
  ['3xl', 'var(--text-3xl)', 'sans'],
  ['2xl', 'var(--text-2xl)', 'sans'],
  ['xl', 'var(--text-xl)', 'sans'],
  ['base', 'var(--text-base)', 'sans'],
  ['sm', 'var(--text-sm)', 'sans'],
  ['xs', 'var(--text-xs)', 'mono'],
] as const;

const SURFACE_TOKENS = [
  '--ground',
  '--ground-raised',
  '--glass',
  '--edge',
  '--ink',
  '--ink-muted',
  '--ink-faint',
  '--accent',
  '--accent-alt',
  '--warn',
  '--good',
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <header className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="u-label" style={{ color: 'var(--accent)' }}>
            Phase 2 · reference
          </p>
          <h1
            className="mt-3 font-[family-name:var(--font-display)] tracking-tight text-balance"
            style={{ fontSize: 'var(--text-5xl)', lineHeight: 1.02 }}
          >
            Design system
          </h1>
          <p className="u-measure mt-3" style={{ color: 'var(--ink-muted)' }}>
            Every primitive the site is built from, rendered on its own. Toggle the theme and check
            each specimen in both.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Velocity ramp" note="Identity and legend">
        <div
          className="u-squircle flex h-16 overflow-hidden"
          style={{ border: '1px solid var(--edge)' }}
        >
          {VELOCITY_RAMP.map(([name, hex]) => (
            <div
              key={name}
              className="flex flex-1 items-end justify-center pb-1.5"
              style={{ background: hex }}
              title={name}
            >
              <span className="font-[family-name:var(--font-mono)] text-[9px] text-white/85">
                {name.replace('--color-vel-', '')}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Surface tokens" note="Both themes">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SURFACE_TOKENS.map((token) => (
            <div key={token} className="flex items-center gap-3">
              <span
                className="h-9 w-9 flex-none rounded-lg"
                style={{ background: `var(${token})`, border: '1px solid var(--edge)' }}
              />
              <code
                className="font-[family-name:var(--font-mono)] text-xs"
                style={{ color: 'var(--ink-muted)' }}
              >
                {token}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale" note="1.25 → 1.333">
        <div className="flex flex-col gap-4">
          {TYPE_SCALE.map(([label, size, family]) => (
            <div key={label} className="flex items-baseline gap-5">
              <code
                className="w-12 flex-none font-[family-name:var(--font-mono)] text-xs"
                style={{ color: 'var(--ink-faint)' }}
              >
                {label}
              </code>
              <span
                className="truncate"
                style={{
                  fontSize: size,
                  lineHeight: 1.15,
                  fontFamily:
                    family === 'display'
                      ? 'var(--font-display)'
                      : family === 'mono'
                        ? 'var(--font-mono)'
                        : 'var(--font-sans)',
                }}
              >
                Shock-induced separation
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Glass" note="Three weights, over content">
        <SpecimenBackdrop>
          <div className="grid gap-4 sm:grid-cols-3">
            {(['default', 'strong', 'quiet'] as const).map((variant) => (
              <GlassPanel key={variant} variant={variant} className="p-6">
                <p className="u-label" style={{ color: 'var(--accent)' }}>
                  {variant}
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  Blur, saturation and a specular top edge. Refraction is added at runtime where the
                  browser accepts a filter reference in backdrop-filter.
                </p>
              </GlassPanel>
            ))}
          </div>
        </SpecimenBackdrop>
      </Section>

      <Section title="Corner geometry" note="Superellipse where supported">
        <SpecimenBackdrop>
          <div className="flex flex-wrap gap-4">
            {(['sm', 'md', 'lg', 'xl', 'pill'] as const).map((radius) => (
              <GlassPanel
                key={radius}
                radius={radius}
                className="grid h-24 w-24 place-items-center"
              >
                <code
                  className="font-[family-name:var(--font-mono)] text-xs"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {radius}
                </code>
              </GlassPanel>
            ))}
          </div>
        </SpecimenBackdrop>
      </Section>

      <Section title="Motion" note="Spring tokens">
        <MotionSpecimens />
      </Section>
    </main>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div
        className="mb-6 flex items-baseline justify-between gap-4 pb-3"
        style={{ borderBottom: '1px solid var(--edge)' }}
      >
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{title}</h2>
        <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
          {note}
        </span>
      </div>
      {children}
    </section>
  );
}

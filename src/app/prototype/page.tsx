import type { Metadata } from 'next';
import { FlowLayer } from '@/components/flow/FlowLayer';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { caseStudies, profile, roles, skills } from '@/content';

export const metadata: Metadata = {
  title: 'Flow layer prototype',
  description: 'Persistent, page-wide, interactive flow field.',
  robots: { index: false, follow: false },
};

export default function PrototypePage() {
  return (
    <>
      <FlowLayer />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <span className="u-label" style={{ color: 'var(--accent)' }}>
            Prototype · move the cursor, then scroll
          </span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-24">
          <GlassPanel
            variant="strong"
            radius="xl"
            flowBody
            className="w-full max-w-2xl p-8 sm:p-12"
          >
            <p className="u-label" style={{ color: 'var(--accent)' }}>
              {profile.availability}
            </p>
            <h1
              className="mt-5 tracking-tight text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-6xl)',
                lineHeight: 0.98,
              }}
            >
              {profile.name}
            </h1>
            <p className="mt-4" style={{ fontSize: 'var(--text-xl)', color: 'var(--ink-muted)' }}>
              {profile.headline}
            </p>
            <p className="u-measure mt-6" style={{ fontSize: 'var(--text-lg)' }}>
              {profile.summaryShort}
            </p>
          </GlassPanel>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2
            className="mb-10 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)' }}
          >
            Panels are bodies in the flow
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <GlassPanel key={study.id} flowBody className="flex h-full flex-col p-7">
                <p className="u-label" style={{ color: 'var(--accent)' }}>
                  {study.domain}
                </p>
                <h3
                  className="mt-4 text-balance"
                  style={{ fontSize: 'var(--text-xl)', fontWeight: 600, lineHeight: 1.2 }}
                >
                  {study.title}
                </h3>
                <p className="mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {study.thesis}
                </p>
              </GlassPanel>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2
            className="mb-10 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)' }}
          >
            Incidence rises as you descend
          </h2>
          <div className="flex flex-col gap-5">
            {roles.map((role) => (
              <GlassPanel key={role.id} flowBody className="p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{role.role}</h3>
                  <span
                    className="font-[family-name:var(--font-mono)] text-xs"
                    style={{ color: 'var(--ink-faint)' }}
                  >
                    {role.organisation}
                  </span>
                </div>
                <p className="u-measure mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {role.summary}
                </p>
              </GlassPanel>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24 pb-40">
          <div className="grid gap-5 sm:grid-cols-2">
            {skills.map((group) => (
              <GlassPanel key={group.id} flowBody className="p-7">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{group.title}</h3>
                <p className="mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {group.items.map((item) => item.name).join(' · ')}
                </p>
              </GlassPanel>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

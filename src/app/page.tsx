import { site } from '@/lib/site';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6 py-24">
      <p
        className="font-mono text-xs tracking-[0.2em] uppercase"
        style={{ color: 'var(--accent)' }}
      >
        Phase 1 · scaffold
      </p>
      <h1 className="font-display text-6xl leading-none tracking-tight text-balance">
        {site.name}
      </h1>
      <p className="max-w-[62ch] text-lg" style={{ color: 'var(--ink-muted)' }}>
        {site.description}
      </p>
      <p className="font-mono text-sm" style={{ color: 'var(--ink-faint)' }}>
        Design system and hero land in phases 2 and 3.
      </p>
    </main>
  );
}

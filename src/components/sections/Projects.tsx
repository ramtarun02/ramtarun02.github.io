import { Reveal, Section } from './Section';
import { TiltCard } from '@/components/glass/TiltCard';
import type { ResolvedProject, SectionCopy } from '@/content/schema';

export function Projects({ copy, items }: { copy: SectionCopy; items: ResolvedProject[] }) {
  return (
    <Section id="projects" copy={copy}>
      <div className="project-grid">
        {items.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08} style={{ height: '100%' }}>
            {project.comingSoon ? (
              <ComingSoonCard project={project} />
            ) : (
              <ProjectCard project={project} />
            )}
          </Reveal>
        ))}
      </div>
      <style>{`
        .project-grid { display: grid; gap: 20px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 860px) { .project-grid { grid-template-columns: 1fr; } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
      `}</style>
    </Section>
  );
}

function ProjectCard({ project }: { project: ResolvedProject }) {
  const repoUrl = project.repoData?.url ?? `https://github.com/ramtarun02/${project.repo}`;
  return (
    <TiltCard
      as="article"
      style={{
        borderRadius: 'var(--radius-xl)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <RotorArt />
      <div
        style={{
          padding: '24px 26px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tags.map((tag) => (
            <span key={tag} className="chip chip--muted">
              {tag}
            </span>
          ))}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
          }}
        >
          {project.displayTitle}
        </h3>
        <p style={{ margin: 0, color: 'var(--ink-muted)', lineHeight: 1.65 }}>
          {project.displaySummary}
        </p>

        {project.stack.length > 0 ? (
          <div style={{ marginTop: 'auto' }}>
            <p className="u-label" style={{ color: 'var(--ink-faint)', margin: '6px 0 8px' }}>
              Built with
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
              }}
            >
              {project.stack.map((s) => (
                <code
                  key={s}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(3,7,16,0.55)',
                    border: '1px solid var(--edge)',
                    color: 'var(--ice-100)',
                  }}
                >
                  {s}
                </code>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
          <a href={repoUrl} target="_blank" rel="noreferrer noopener" className="btn btn-glass">
            <GithubIcon /> View on GitHub
          </a>
        </div>
      </div>
    </TiltCard>
  );
}

function ComingSoonCard({ project }: { project: ResolvedProject }) {
  return (
    <article
      className="glass"
      aria-label={`${project.displayTitle} — coming soon`}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        height: '100%',
        minHeight: 420,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* The card underneath, deliberately out of focus. */}
      <div aria-hidden="true" style={{ filter: 'blur(7px)', opacity: 0.55, flex: 1 }}>
        <WingArt />
        <div style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {project.tags.map((t) => (
              <span key={t} className="chip chip--muted">
                {t}
              </span>
            ))}
          </div>
          <h3 style={{ fontSize: 'var(--text-2xl)', margin: '16px 0 10px' }}>
            {project.displayTitle}
          </h3>
          <p style={{ color: 'var(--ink-muted)', margin: 0 }}>{project.displaySummary}</p>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background:
            'radial-gradient(80% 60% at 50% 45%, rgba(10,18,34,0.35), rgba(10,18,34,0.75))',
          backdropFilter: 'blur(6px) saturate(140%)',
          WebkitBackdropFilter: 'blur(6px) saturate(140%)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <span className="chip chip--violet" style={{ fontSize: 12 }}>
            <span
              aria-hidden="true"
              style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet-300)' }}
            />
            Coming soon
          </span>
          <h3
            style={{
              margin: '16px 0 10px',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
            }}
          >
            {project.displayTitle}
          </h3>
          <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: 15, lineHeight: 1.6 }}>
            {project.displaySummary}
          </p>
        </div>
      </div>
    </article>
  );
}

/** A rotor disc with a slow-turning three-blade prop and streamlines bending through it. */
function RotorArt() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        height: 190,
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 120% at 70% 30%, rgba(56,189,248,0.22), transparent 55%), radial-gradient(90% 90% at 10% 100%, rgba(129,140,248,0.2), transparent 60%), rgba(3,7,16,0.45)',
        borderBottom: '1px solid var(--edge)',
      }}
    >
      <svg viewBox="0 0 600 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sl" x1="0" x2="1">
            <stop offset="0" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7dd3fc" stopOpacity="0.55" />
            <stop offset="1" stopColor="#a5b4fc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[-60, -36, -14, 14, 36, 60].map((o, i) => (
          <path
            key={o}
            d={`M0 ${95 + o} C 200 ${95 + o}, 260 ${95 + o * 0.55}, 330 ${95 + o * 0.55} S 520 ${95 + o * 0.7}, 600 ${95 + o * 0.75}`}
            fill="none"
            stroke="url(#sl)"
            strokeWidth={1.4}
            strokeDasharray="6 10"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-160"
              dur={`${3 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
        <ellipse
          cx="330"
          cy="95"
          rx="10"
          ry="78"
          fill="none"
          stroke="rgba(186,230,253,0.25)"
          strokeDasharray="3 5"
        />
        <g style={{ transformOrigin: '330px 95px', animation: 'spin-slow 9s linear infinite' }}>
          {[0, 120, 240].map((a) => (
            <path
              key={a}
              transform={`rotate(${a} 330 95)`}
              d="M330 95 C 336 70, 342 40, 334 20 C 328 30, 322 60, 330 95 Z"
              fill="rgba(186,230,253,0.55)"
            />
          ))}
          <circle cx="330" cy="95" r="7" fill="#e0f2fe" />
        </g>
      </svg>
    </div>
  );
}

function WingArt() {
  return (
    <div
      style={{
        height: 190,
        background:
          'radial-gradient(100% 100% at 30% 20%, rgba(167,139,250,0.25), transparent 60%), rgba(3,7,16,0.45)',
      }}
    >
      <svg viewBox="0 0 600 190" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <path d="M120 120 L300 70 L480 120 L300 100 Z" fill="rgba(196,181,253,0.5)" />
        <path d="M290 40 L310 40 L320 150 L280 150 Z" fill="rgba(196,181,253,0.4)" />
      </svg>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

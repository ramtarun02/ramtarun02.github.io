import { Section } from './Section';
import type { SectionCopy } from '@/content/schema';

interface Proj {
  title: string;
  summary: string;
  tags: string[];
  language: string;
  langColor: string;
  featured: boolean;
  href: string;
}

const PROJECTS: Proj[] = [
  {
    title: 'Neural-BEMT',
    summary:
      'A clean-room blade element-momentum solver that handles propellers and wind turbines in one codebase, with kappa-form iteration and a pluggable loss-factor registry.',
    tags: ['Rotor aerodynamics', 'Validated'],
    language: 'Python',
    langColor: 'var(--color-accent)',
    featured: true,
    href: 'https://github.com/ramtarun02/Neural-BEMT',
  },
  {
    title: 'FlowVFP',
    summary:
      'A modern front end for a viscous full-potential transonic solver, built to make a legacy research code usable inside a conceptual design loop.',
    tags: ['Transonic', 'Solver tooling'],
    language: 'Python',
    langColor: 'var(--color-accent)',
    featured: true,
    href: 'https://github.com/ramtarun02/FlowVFP',
  },
  {
    title: 'Boundary-Aware Conservative Neural Operator',
    summary:
      'A neural operator on induced point graphs that respects boundary conditions and conservation, aimed at learning PDE solutions without discarding the physics.',
    tags: ['Neural operators', 'PDEs'],
    language: 'Python',
    langColor: 'var(--color-accent)',
    featured: false,
    href: 'https://github.com/ramtarun02/BA-CNO',
  },
  {
    title: '2D Euler solver',
    summary:
      'A finite-volume solver for the two-dimensional Euler equations in C++, written to understand shock capturing from the discretisation up rather than from a manual.',
    tags: ['Finite volume', 'Shock capturing'],
    language: 'C++',
    langColor: 'var(--color-accent-2)',
    featured: false,
    href: 'https://github.com/ramtarun02/euler-2D',
  },
  {
    title: 'py-PlotRes',
    summary:
      'An interactive dashboard for turning solver residual and force histories into publication-quality plots without rewriting a matplotlib script every time.',
    tags: ['Post-processing', 'Tooling'],
    language: 'Python',
    langColor: 'var(--color-accent)',
    featured: false,
    href: 'https://github.com/ramtarun02/py-PlotRes',
  },
];

export function Projects({ copy }: { copy: SectionCopy }) {
  return (
    <Section id="projects" copy={copy}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 24,
        }}
      >
        {PROJECTS.map((proj) => (
          <div
            key={proj.title}
            className="card elev-sm lift"
            style={{
              padding: 26,
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              <h3 className="card-title" style={{ margin: 0 }}>
                {proj.title}
              </h3>
              {proj.featured ? (
                <span className="tag tag-accent" style={{ fontSize: 9 }}>
                  FEATURED
                </span>
              ) : null}
            </div>
            <p className="card-body" style={{ color: 'var(--ink-muted)' }}>
              {proj.summary}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0' }}>
              {proj.tags.map((t) => (
                <span key={t} className="tag tag-neutral" style={{ fontSize: 10 }}>
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingTop: 14,
                borderTop: '1px solid var(--edge)',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: 'var(--ink-faint)',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: proj.langColor,
                    display: 'inline-block',
                  }}
                />
                {proj.language}
              </span>
              <a
                href={proj.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
                style={{ padding: 0 }}
              >
                Repository →
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

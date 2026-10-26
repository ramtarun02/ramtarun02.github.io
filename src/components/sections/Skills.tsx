import { Section } from './Section';
import type { SectionCopy } from '@/content/schema';

const SKILL_TIERS = [
  {
    title: 'Core',
    note: 'Daily tools — I write these without looking things up.',
    items: [
      'Python',
      'C / C++',
      'Full-potential methods',
      'Finite volume methods',
      'OpenFOAM',
      'Linux / HPC workflows',
      'Git',
    ],
  },
  {
    title: 'Working',
    note: 'Comfortable and productive, with the manual open now and then.',
    items: [
      'ANSYS Fluent',
      'Mesh generation / y+',
      'Turbulence modelling',
      'PyTorch',
      'MPI',
      'SolidWorks / Fusion 360',
    ],
  },
  {
    title: 'Familiar',
    note: 'Used in research projects; I know the shape of the problem.',
    items: ['Physics-informed operators', 'Surrogate modelling', 'Lattice Boltzmann', 'GD&T'],
  },
] as const;

export function Skills({ copy }: { copy: SectionCopy }) {
  return (
    <Section id="skills" copy={copy}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 24,
        }}
      >
        {SKILL_TIERS.map((tier) => (
          <div
            key={tier.title}
            className="card elev-sm lift"
            style={{ padding: 26, borderRadius: 'var(--radius-lg)' }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 17, color: 'var(--color-accent-700)' }}>
              {tier.title}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', margin: '0 0 18px' }}>
              {tier.note}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tier.items.map((item) => (
                <span key={item} className="tag tag-outline" style={{ fontSize: 11 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

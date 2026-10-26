import Link from 'next/link';
import type { SectionCopy } from '@/content/schema';

const STATS = [
  { value: '±0.03', label: 'Mach spread at the failure boundary' },
  { value: '+71%', label: 'incidence range recovered, 3.4°→5.8°' },
  { value: '587', label: 'solver runs in the campaign' },
  { value: 'M₁≈1.3', label: 'separation threshold confirmed' },
] as const;

export function CaseStudyFlagship({ copy }: { copy: SectionCopy }) {
  return (
    <section
      id="case-study"
      style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 24px 90px' }}
    >
      <div
        className="card elev-md"
        style={{
          padding: 44,
          borderRadius: 'var(--radius-lg)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.3fr) minmax(220px,0.9fr)',
          gap: 40,
        }}
      >
        <div>
          <span className="tag tag-accent">
            {copy.eyebrow === 'Case studies' ? 'Flagship case study' : copy.eyebrow}
          </span>
          <h2 className="u-display" style={{ margin: '18px 0 12px', fontSize: 30 }}>
            Where a low-fidelity transonic method stops being trustworthy
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: '0 0 20px' }}>
            NASA Common Research Model wing-body · M∞ 0.80–0.85 · Re 5–30×10⁶
          </p>
          <blockquote
            style={{
              margin: '0 0 24px',
              paddingLeft: 20,
              borderLeft: '4px solid var(--color-accent)',
              fontSize: 17,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            For a fixed numerical treatment the solver&rsquo;s limit is a shock strength, not an
            angle of attack — and once you know that, you can move it.
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Link
              href="/work/transonic-incidence-limit"
              className="btn"
              style={{
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent-fill)',
                color: 'var(--accent-contrast)',
              }}
            >
              Read the full case study →
            </Link>
            <Link href="/work" className="btn btn-ghost">
              See all case studies
            </Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="u-display" style={{ fontSize: 24, color: 'var(--color-accent-700)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

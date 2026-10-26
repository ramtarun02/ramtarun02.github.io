import Image from 'next/image';
import { Reveal, Section } from './Section';
import { TiltCard } from '@/components/glass/TiltCard';
import type { Profile, SectionCopy } from '@/content/schema';

const STATS = [
  { value: '3', label: 'Conference papers', note: 'AIAA SciTech · ICAS 2024 · ICAS 2026' },
  { value: '19,024 ft', label: 'UAV payload record', note: '30 kg, 2024 — team lead' },
  { value: 'Mach 6', label: 'Latest validation case', note: 'hypersonic aerospike — see below' },
];

export function About({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <Section id="about" copy={copy}>
      <div className="about-grid">
        <Reveal>
          <TiltCard
            className="about-photo"
            style={{ borderRadius: 'var(--radius-xl)', padding: 10 }}
            max={4}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                borderRadius: 24,
                overflow: 'hidden',
              }}
            >
              <Image
                src="/assets/profile-pic.png"
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 900px) 90vw, 380px"
                style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(7,12,26,0.85) 100%)',
                }}
              />
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
                <div
                  className="glass"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: 'var(--mint-300)',
                      animation: 'pulse-ring 1.8s ease-out infinite',
                      flex: 'none',
                    }}
                  />
                  <span style={{ fontSize: 13.5, lineHeight: 1.3 }}>{profile.availability}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Reveal delay={0.08}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {profile.summaryLong.map((para, i) => (
                <p
                  key={para.slice(0, 24)}
                  style={{
                    margin: 0,
                    fontSize: i === 0 ? 'var(--text-xl)' : 'var(--text-base)',
                    lineHeight: i === 0 ? 1.5 : 1.75,
                    letterSpacing: i === 0 ? '-0.015em' : undefined,
                    color: i === 0 ? 'var(--ink)' : 'var(--ink-muted)',
                    maxWidth: '62ch',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="stat-grid" aria-label="Highlights">
              {STATS.map((s) => (
                <li
                  key={s.label}
                  className="glass"
                  style={{ borderRadius: 20, padding: '18px 18px 16px' }}
                >
                  <div
                    className="u-gradient-text"
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 3 }}>
                    {s.note}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.22}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {profile.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-glass"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
              <a
                href="/documents/resume.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-glass"
              >
                Résumé (PDF)
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .about-grid { display: grid; gap: clamp(2rem, 5vw, 4.5rem); grid-template-columns: minmax(0, 380px) minmax(0, 1fr); align-items: center; }
        .stat-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-photo { max-width: 420px; }
        }
        @media (max-width: 560px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </Section>
  );
}

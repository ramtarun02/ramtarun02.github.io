import Image from 'next/image';
import { Reveal } from './Section';
import { LiftConfession } from './LiftConfession';
import type { Profile, SectionCopy } from '@/content/schema';

const STATS = [
  { value: '3', label: 'Conference papers', note: 'AIAA SciTech · ICAS 2024 · ICAS 2026' },
  { value: '19,024 ft', label: 'UAV payload record', note: '30 kg, 2024 — team lead' },
  { value: 'Mach 6', label: 'Latest validation case', note: 'hypersonic aerospike — see below' },
];

export function About({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="shell">
        {/* Opening quote — the idea the rest of the page keeps coming back to. */}
        <Reveal>
          <figure className="about-quote">
            <span className="about-qmark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>
              All models are wrong, but <span className="u-gradient-text">some are useful.</span>
            </blockquote>
            <figcaption>— George E. P. Box, statistician</figcaption>
          </figure>
        </Reveal>

        <div className="about-grid">
          <div className="about-left">
            <Reveal>
              <div
                className="glass about-photo"
                style={{ borderRadius: 'var(--radius-xl)', padding: 8 }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 4.2',
                    borderRadius: 26,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/assets/profile-pic.png"
                    alt={`Portrait of ${profile.name}`}
                    fill
                    sizes="(max-width: 900px) 90vw, 420px"
                    style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      bottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '8px 13px',
                      borderRadius: 999,
                      background: 'rgba(7,12,26,0.72)',
                      border: '1px solid var(--edge)',
                      fontSize: 13.5,
                      fontWeight: 800,
                    }}
                  >
                    <span aria-hidden="true" className="avail-dot" />
                    {profile.availability}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, minWidth: 0 }}>
            <Reveal delay={0.06}>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h2 id="about-title" className="section-title">
                {copy.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {profile.summaryLong.map((para, i) => (
                  <p
                    key={para.slice(0, 24)}
                    style={{
                      margin: 0,
                      fontSize: i === 0 ? 'var(--text-lg)' : 'var(--text-base)',
                      fontWeight: i === 0 ? 700 : 500,
                      lineHeight: 1.7,
                      color: i === 0 ? 'var(--ink)' : 'var(--ink-muted)',
                      maxWidth: '62ch',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <ul className="stat-grid" aria-label="Highlights">
                {STATS.map((s) => (
                  <li
                    key={s.label}
                    className="glass"
                    style={{ borderRadius: 20, padding: '16px 16px 14px' }}
                  >
                    <div
                      className="u-gradient-text"
                      style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 3 }}>
                      {s.note}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* The hero's A380 line, made literal — sits where the "about me" turns personal. */}
        <div className="about-confession">
          <Reveal>
            <LiftConfession />
          </Reveal>
          <Reveal delay={0.08} className="about-links">
            <p style={{ margin: 0, color: 'var(--ink-muted)', fontWeight: 600, lineHeight: 1.6 }}>
              Want the long version? My CV, code and research IDs are here.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <a
                href="/documents/resume.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary"
              >
                Résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
              {profile.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-glass"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .about-quote { margin: 0 auto clamp(3.5rem, 8vw, 6rem); max-width: 960px; text-align: center; position: relative; }
        .about-qmark { display: block; font-size: clamp(5rem, 10vw, 8rem); line-height: 0.6; font-weight: 900; color: var(--ice-300); opacity: 0.5; height: 0.45em; }
        .about-quote blockquote { margin: 0; font-size: clamp(2.2rem, 1.2rem + 4.4vw, 4.6rem); font-weight: 900; line-height: 1.04; letter-spacing: -0.03em; text-wrap: balance; }
        .about-quote figcaption { margin-top: 18px; font-size: var(--text-base); font-weight: 700; color: var(--ink-muted); }
        .about-grid { display: grid; gap: clamp(2rem, 5vw, 4rem); grid-template-columns: minmax(0, 400px) minmax(0, 1fr); align-items: center; }
        .stat-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .about-confession { display: grid; gap: clamp(1.5rem, 4vw, 3rem); grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); align-items: center; margin-top: clamp(2.5rem, 6vw, 4rem); }
        .avail-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-300); box-shadow: 0 0 0 4px rgba(110,231,183,0.2); flex: none; }
        @media (max-width: 900px) {
          .about-grid, .about-confession { grid-template-columns: 1fr; }
          .about-photo { max-width: 420px; }
        }
        @media (max-width: 560px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

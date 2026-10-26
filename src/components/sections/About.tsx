import Image from 'next/image';
import { Reveal } from './Section';
import { LiftConfession } from './LiftConfession';
import type { Profile, SectionCopy } from '@/content/schema';

const STATS = [
  { value: '3', label: 'Conference papers', note: 'AIAA SciTech · ICAS 2024 · ICAS 2026' },
  { value: 'Mach 6', label: 'Latest case study', note: 'hypersonic aerospike — see below' },
  { value: 'Next up', label: 'Latest project', note: 'Aircraft Design & Optimisation' },
];

/**
 * Desktop reads as one block: a left column (portrait, then links) that
 * stretches to exactly the height of the right column (heading, story,
 * stats), with the Confession widget running the full width underneath.
 * Phones stack it in reading order.
 */
export function About({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="shell">
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
          <Reveal className="about-left">
            <div className="glass about-photo">
              <div className="about-photo-frame">
                <Image
                  src="/assets/profile-pic.png"
                  alt={`Portrait of ${profile.name}`}
                  fill
                  sizes="(max-width: 900px) 90vw, 400px"
                  style={{ objectFit: 'cover', objectPosition: 'center 28%' }}
                />
                <div className="about-avail">
                  <span aria-hidden="true" className="avail-dot" />
                  {profile.availability}
                </div>
              </div>
            </div>

            <div className="glass about-links">
              <p style={{ margin: 0, fontWeight: 800 }}>Want the long version?</p>
              <p style={{ margin: '4px 0 0', color: 'var(--ink-muted)', fontSize: 14.5 }}>
                CV, code and LinkedIn.
              </p>
              <div className="about-link-row">
                <a
                  href="/documents/resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary"
                >
                  Résumé <span aria-hidden="true">↗</span>
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
            </div>
          </Reveal>

          <div className="about-right">
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

          {/* The hero's A380 line, made literal — full width, closing the About block. */}
          <Reveal className="about-confession">
            <LiftConfession />
          </Reveal>
        </div>
      </div>

      <style>{`
        .about-quote { margin: 0 auto clamp(3.5rem, 8vw, 6rem); max-width: 960px; text-align: center; }
        .about-qmark { display: block; font-size: clamp(5rem, 10vw, 8rem); line-height: 0.6; font-weight: 900; color: var(--ice-300); opacity: 0.5; height: 0.45em; }
        .about-quote blockquote { margin: 0; font-size: clamp(2.2rem, 1.2rem + 4.4vw, 4.6rem); font-weight: 900; line-height: 1.04; letter-spacing: -0.03em; text-wrap: balance; }
        .about-quote figcaption { margin-top: 18px; font-size: var(--text-base); font-weight: 700; color: var(--ink-muted); }

        .about-grid { display: grid; gap: clamp(1.5rem, 3vw, 2.5rem); grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: stretch; }
        .about-left { display: flex; flex-direction: column; gap: 16px; min-height: 100%; }
        .about-photo { border-radius: var(--radius-xl); padding: 8px; flex: 1 1 auto; display: flex; min-height: 360px; }
        .about-photo-frame { position: relative; flex: 1; border-radius: 26px; overflow: hidden; }
        .about-avail { position: absolute; left: 12px; bottom: 12px; display: flex; align-items: center; gap: 9px; padding: 8px 13px;
          border-radius: 999px; background: rgba(7,12,26,0.72); border: 1px solid var(--edge); font-size: 13.5px; font-weight: 800; }
        .avail-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--mint-300); box-shadow: 0 0 0 4px rgba(110,231,183,0.2); flex: none; }
        .about-links { border-radius: 24px; padding: 18px 20px; flex: none; }
        .about-link-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
        .about-link-row .btn { min-height: 40px; padding: 8px 16px; }

        .about-right { display: flex; flex-direction: column; gap: 22px; min-width: 0; justify-content: space-between; }
        .stat-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .about-confession { grid-column: 1 / -1; }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-left { display: contents; }
          .about-photo { order: 0; max-width: 440px; aspect-ratio: 4 / 4.3; min-height: 0; }
          .about-right { order: 1; }
          .about-confession { order: 2; }
          .about-links { order: 3; }
        }
        @media (max-width: 560px) { .stat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

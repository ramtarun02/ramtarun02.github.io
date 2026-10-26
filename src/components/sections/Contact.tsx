import { Reveal } from './Section';
import type { Profile, SectionCopy } from '@/content/schema';
import { site } from '@/lib/site';

export function Contact({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="shell">
        <Reveal>
          <div
            className="glass noise"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 6vw, 4.5rem)',
              background:
                'radial-gradient(90% 120% at 100% 0%, rgba(129,140,248,0.22), transparent 55%), radial-gradient(80% 120% at 0% 100%, rgba(56,189,248,0.18), transparent 60%), linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            }}
          >
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="contact-title" className="section-title" style={{ maxWidth: '16ch' }}>
              {copy.title}
            </h2>
            <p className="section-lede">{copy.lede}</p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}>
              <a
                href={`mailto:${site.email}`}
                className="btn btn-primary"
                style={{ minHeight: 50, padding: '12px 26px' }}
              >
                Email me
              </a>
              {profile.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-glass"
                  style={{ minHeight: 50 }}
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
              <a
                href="/documents/resume.pdf"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-glass"
                style={{ minHeight: 50 }}
              >
                Résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p style={{ marginTop: 22, fontSize: 14, color: 'var(--ink-faint)' }}>
              {site.email} · {profile.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import type { Profile, SectionCopy } from '@/content/schema';

export function Contact({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <section id="contact" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 100px' }}>
      <div
        className="card elev-md"
        style={{
          padding: '52px 44px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <span className="tag tag-accent-2">{copy.eyebrow}</span>
        <h2 className="u-display" style={{ margin: '18px 0 16px', fontSize: 34 }}>
          {copy.title}
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--ink-muted)',
            maxWidth: '58ch',
            margin: '0 0 30px',
          }}
        >
          {copy.lede}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="mailto:hello@tarunramprakash.com"
            className="btn"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-fill)',
              color: 'var(--accent-contrast)',
            }}
          >
            Email me
          </a>
          {profile.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-secondary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/documents/resume.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-secondary"
          >
            Résumé (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

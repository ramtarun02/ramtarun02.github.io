import Link from 'next/link';

/** Minimal sticky bar for the dark reading-mode case-study pages. */
export function CaseStudyHeader({ backHref = '/#case-study' }: { backHref?: string }) {
  return (
    <header
      className="nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'color-mix(in srgb, var(--color-bg) 82%, transparent)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--edge)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '13px 22px',
      }}
    >
      <Link href={backHref} style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: 15 }}>
        ← T. Ramprakash
      </Link>
      <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-faint)' }}>
        Case study
      </span>
    </header>
  );
}

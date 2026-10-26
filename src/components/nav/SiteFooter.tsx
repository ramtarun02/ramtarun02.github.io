export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="shell" style={{ padding: '24px 24px 40px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 13,
          color: 'var(--ink-faint)',
        }}
      >
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <a href="#top" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

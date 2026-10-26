export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="shell" style={{ padding: '28px var(--gutter) 44px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingTop: 22,
          borderTop: '1px solid var(--edge)',
          fontSize: 13,
          color: 'var(--ink-faint)',
        }}
      >
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}

import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="shell pt-8 pb-16">
      <div
        className="flex flex-col gap-4 pt-8 text-xs sm:flex-row sm:items-start sm:justify-between"
        style={{ borderTop: '1px solid var(--edge)', color: 'var(--ink-faint)' }}
      >
        <p className="font-[family-name:var(--font-mono)]">
          © {site.name}. Built with Next.js. Source on{' '}
          <a href={`https://github.com/${site.github}`} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          .
        </p>
        <p className="u-measure sm:text-right">
          VFP is licensed to Cranfield University. Work presented here describing its behaviour is
          the author&rsquo;s own; the solver itself is not distributed.
        </p>
      </div>
    </footer>
  );
}

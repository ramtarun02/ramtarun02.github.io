import Link from 'next/link';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { ResolvedProject } from '@/content/schema';

/** "2026-03-02T…" → "Mar 2026". Bad input returns empty rather than throwing. */
export function formatPushed(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function Projects({ items, user }: { items: ResolvedProject[]; user: string }) {
  return (
    <Section
      id="projects"
      eyebrow="Code"
      title="Published repositories"
      lede="Curated rather than dumped — these are the ones worth reading. Everything else stays on GitHub."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((project) => (
          <GlassPanel key={project.id} as="article" flowBody className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                {project.displayTitle}
              </h3>
              {project.featured ? (
                <span
                  className="u-label px-2 py-0.5"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
                    color: 'var(--accent)',
                  }}
                >
                  Featured
                </span>
              ) : null}
            </div>

            <p className="u-measure mt-3 flex-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
              {project.displaySummary}
            </p>

            {project.tags.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="u-label px-2.5 py-1"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--edge)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <div
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs"
              style={{ borderTop: '1px solid var(--edge)', color: 'var(--ink-faint)' }}
            >
              {project.repoData?.language ? (
                <span className="font-[family-name:var(--font-mono)]">
                  {project.repoData.language}
                </span>
              ) : null}
              {project.repoData ? (
                <span className="font-[family-name:var(--font-mono)]">
                  updated {formatPushed(project.repoData.pushedAt)}
                </span>
              ) : (
                <span style={{ color: 'var(--warn)' }}>not in the GitHub cache</span>
              )}
              <span className="ml-auto flex flex-wrap gap-4">
                {project.caseStudySlug ? (
                  <Link
                    href={`/work/${project.caseStudySlug}`}
                    className="font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    Case study →
                  </Link>
                ) : null}
                <a
                  href={project.repoData?.url ?? `https://github.com/${user}/${project.repo}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  Repository →
                </a>
              </span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </Section>
  );
}

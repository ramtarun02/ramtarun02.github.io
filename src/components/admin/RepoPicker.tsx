'use client';

import { useEffect, useState } from 'react';
import { listRepos, type RemoteRepo } from '@/lib/github/client';
import { tokenAuth } from '@/lib/github/auth';
import { GlassPanel } from '@/components/glass/GlassPanel';

type Item = Record<string, unknown>;

/**
 * Every repository GitHub knows about, with a control to publish it. This is
 * the piece the brief actually asked for: choosing what appears on the site
 * from inside the site, rather than by editing a file.
 */
export function RepoPicker({
  user,
  projects,
  onChange,
}: {
  user: string;
  projects: Item[];
  onChange: (next: Item[]) => void;
}) {
  const [repos, setRepos] = useState<RemoteRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listRepos(tokenAuth, user)
      .then((result) => {
        if (cancelled) return;
        setRepos(result.filter((repo) => !repo.fork && !repo.archived));
      })
      .catch(() => {
        if (!cancelled) setError('Could not list repositories. Check the token scope.');
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const published = new Set(projects.map((project) => String(project['repo']).toLowerCase()));

  function toggle(repo: RemoteRepo) {
    const key = repo.name.toLowerCase();
    if (published.has(key)) {
      onChange(
        projects
          .filter((project) => String(project['repo']).toLowerCase() !== key)
          .map((project, index) => ({ ...project, order: index })),
      );
      return;
    }
    onChange([
      ...projects,
      {
        id: repo.name.toLowerCase(),
        repo: repo.name,
        order: projects.length,
        published: true,
        featured: false,
        summary: repo.description || undefined,
        tags: repo.language ? [repo.language] : [],
      },
    ]);
  }

  if (error) {
    return (
      <p className="text-sm" style={{ color: 'var(--warn)' }}>
        {error}
      </p>
    );
  }

  if (!repos) {
    return (
      <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
        Loading repositories…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {repos.map((repo) => {
        const isPublished = published.has(repo.name.toLowerCase());
        return (
          <GlassPanel key={repo.name} radius="sm" className="flex flex-wrap items-center gap-3 p-3">
            <span style={{ fontWeight: 700 }}>{repo.name}</span>
            {repo.language ? (
              <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
                {repo.language}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-xs" style={{ color: 'var(--ink-faint)' }}>
              {repo.description ?? 'No description on GitHub'}
            </span>
            <button
              type="button"
              onClick={() => toggle(repo)}
              className="glass px-3 py-1.5 text-xs"
              style={{
                borderRadius: 'var(--radius-pill)',
                color: isPublished ? 'var(--accent)' : 'var(--ink-muted)',
              }}
            >
              {isPublished ? 'Published ✓' : 'Publish'}
            </button>
          </GlassPanel>
        );
      })}
    </div>
  );
}

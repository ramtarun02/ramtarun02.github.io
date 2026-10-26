'use client';

import { Markdown } from '@/components/markdown/Markdown';
import { Projects } from '@/components/sections/Projects';
import { Publications } from '@/components/sections/Publications';
import { About } from '@/components/sections/About';
import {
  caseStudySchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  publicationSchema,
  skillGroupSchema,
} from '@/content/schema';
import type { z } from 'zod';
import { sections } from '@/content';

/**
 * Live preview built from the real components, not a markdown approximation.
 *
 * Content mid-edit is frequently invalid, so everything is validated first and
 * the failure is shown as a message rather than as a crashed page — a preview
 * that white-screens while you type is worse than no preview.
 */
export function Preview({
  collectionKey,
  data,
  selectedIndex,
}: {
  collectionKey: string;
  data: unknown;
  selectedIndex: number | null;
}) {
  const list = Array.isArray(data) ? (data as unknown[]) : [];

  if (collectionKey === 'profile') {
    return renderOne(profileSchema, data, (profile) => (
      <About profile={profile} copy={sections.about} />
    ));
  }

  if (collectionKey === 'case-studies') {
    const item = selectedIndex !== null ? list[selectedIndex] : list[0];
    return renderOne(caseStudySchema, item, (study) => (
      <article className="mx-auto max-w-3xl">
        <h1
          className="tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-4xl)',
            lineHeight: 1.05,
          }}
        >
          {study.title}
        </h1>
        <p
          className="u-measure mt-4"
          style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}
        >
          {study.thesis}
        </p>
        <div className="mt-10">
          <Markdown source={study.body} />
        </div>
      </article>
    ));
  }

  if (collectionKey === 'experience') {
    return renderMany(experienceSchema, list, () => (
      <Message text="Experience now renders from a fixed timeline component; edit src/components/sections/Experience.tsx directly." />
    ));
  }

  if (collectionKey === 'publications') {
    return renderMany(publicationSchema, list, (items) => (
      <Publications items={items} copy={sections.research} />
    ));
  }

  if (collectionKey === 'skills') {
    return renderMany(skillGroupSchema, list, () => (
      <Message text="Skills are no longer shown on the site — they appear on project cards instead." />
    ));
  }

  if (collectionKey === 'projects') {
    return renderMany(projectSchema, list, (items) => (
      <Projects
        copy={sections.projects}
        items={items.map((p) => ({
          ...p,
          repoData: undefined,
          displayTitle: p.title ?? (p.repo || 'Untitled project'),
          displaySummary: p.summary ?? '',
        }))}
      />
    ));
  }

  return <Message text="No preview for this collection yet." />;
}

function renderOne<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
  render: (parsed: z.infer<T>) => React.ReactNode,
): React.ReactNode {
  const result = schema.safeParse(value);
  if (!result.success) return <Invalid issues={result.error.issues} />;
  return render(result.data);
}

function renderMany<T extends z.ZodTypeAny>(
  schema: T,
  values: unknown[],
  render: (parsed: z.infer<T>[]) => React.ReactNode,
): React.ReactNode {
  const parsed: z.infer<T>[] = [];
  for (const value of values) {
    const result = schema.safeParse(value);
    if (!result.success) return <Invalid issues={result.error.issues} />;
    parsed.push(result.data);
  }
  if (parsed.length === 0) return <Message text="Nothing to preview yet." />;
  return render(parsed);
}

function Invalid({ issues }: { issues: { path: (string | number)[]; message: string }[] }) {
  return (
    <div className="flex flex-col gap-2 p-5" style={{ color: 'var(--warn)' }}>
      <p className="u-label">Not valid yet</p>
      <ul className="flex flex-col gap-1 text-sm">
        {issues.slice(0, 6).map((issue, index) => (
          <li key={index}>
            <code className="font-[family-name:var(--font-mono)] text-xs">
              {issue.path.join('.') || '(root)'}
            </code>{' '}
            {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <p className="p-5 text-sm" style={{ color: 'var(--ink-faint)' }}>
      {text}
    </p>
  );
}

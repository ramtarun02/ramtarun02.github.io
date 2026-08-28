import { z } from 'zod';

/**
 * Content schemas.
 *
 * Each schema is the single source of truth for its collection: it produces the
 * TypeScript types the site compiles against, the validation that fails the
 * build on malformed content, and — from Phase 4 — the admin's editing form.
 * Add a field here and all three follow.
 */

/** Shared by every editable item: what shows, and in what order. */
export const publishable = z.object({
  id: z.string().min(1),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  /** Icon key resolved by the UI; unknown keys fall back to a generic glyph. */
  icon: z.enum(['github', 'linkedin', 'orcid', 'scholar', 'email', 'cv']).optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  /** How publications index him. Emitted as structured data so citations resolve. */
  nameVariants: z.array(z.string().min(1)).min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  /** Short form for the hero; long form for the About section. */
  summaryShort: z.string().min(1).max(320),
  summaryLong: z.array(z.string().min(1)).min(1),
  availability: z.string().min(1),
  links: z.array(linkSchema).min(1),
});

export const experienceSchema = publishable.extend({
  role: z.string().min(1),
  organisation: z.string().min(1),
  location: z.string().min(1),
  /** ISO year-month. `end` omitted means current. */
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  kind: z.enum(['role', 'internship', 'education']),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
});

export const skillGroupSchema = publishable.extend({
  title: z.string().min(1),
  /** 0–1. Drives position on the velocity ramp, so it must stay normalised. */
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        level: z.number().min(0).max(1),
      }),
    )
    .min(1),
});

export const publicationSchema = publishable.extend({
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  /** Index of the site owner in `authors`, so first authorship can be shown. */
  selfIndex: z.number().int().min(0),
  venue: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  doi: z.string().optional(),
  href: z.string().url(),
  abstract: z.string().optional(),
});

export const experienceCollection = z.array(experienceSchema);
export const skillCollection = z.array(skillGroupSchema);
export const publicationCollection = z.array(publicationSchema);

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type Link = z.infer<typeof linkSchema>;

/* ============================================================
   Case studies and posts
   Authored as Markdown. Typed fenced blocks (chart, keynumbers,
   finding, caution) cover the things Markdown has no syntax for,
   so a technical write-up keeps its figures and callouts without
   giving up a plain-text authoring format.
   ============================================================ */

export const caseStudySchema = publishable.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(['draft', 'published']).default('draft'),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  /** One sentence that must carry the whole study if nothing else is read. */
  thesis: z.string().min(1),
  domain: z.string().min(1),
  tools: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(1900).max(2100),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  cover: z.string().optional(),
  /** The document itself, in Markdown. */
  body: z.string().min(1),
  credit: z.string().optional(),
});

export const caseStudyCollection = z.array(caseStudySchema);

export type CaseStudy = z.infer<typeof caseStudySchema>;

/* ============================================================
   Projects
   Curation lives here; GitHub supplies the facts. The two are
   kept apart so a repo rename or a lost star never silently
   rewrites the copy you wrote about it.
   ============================================================ */

export const projectSchema = publishable.extend({
  /** Repository name under the configured GitHub user. */
  repo: z.string().min(1),
  /** Overrides the repo name. Repos are named for machines, not for readers. */
  title: z.string().min(1).optional(),
  /** Overrides the GitHub description, which is usually one line or empty. */
  summary: z.string().min(1).optional(),
  /** Curated, not GitHub topics: what you want shown, in the order you want. */
  tags: z.array(z.string().min(1)).default([]),
  /** Optional link to a case study slug that goes deeper than the repo. */
  caseStudySlug: z.string().optional(),
  featured: z.boolean().default(false),
});

export const projectCollection = z.array(projectSchema);

export const githubRepoSchema = z.object({
  name: z.string(),
  description: z.string(),
  language: z.string().nullable(),
  stars: z.number().int(),
  forks: z.number().int(),
  topics: z.array(z.string()),
  homepage: z.string().nullable(),
  url: z.string().url(),
  pushedAt: z.string(),
});

export const githubCacheSchema = z.object({
  user: z.string(),
  fetchedAt: z.string(),
  repos: z.array(githubRepoSchema),
});

export type Project = z.infer<typeof projectSchema>;
export type GithubRepo = z.infer<typeof githubRepoSchema>;

/** A curated project joined to its GitHub facts, ready to render. */
export interface ResolvedProject extends Project {
  repoData: GithubRepo | undefined;
  displayTitle: string;
  displaySummary: string;
}

/* ============================================================
   Writing
   ============================================================ */

export const postSchema = publishable.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(['draft', 'published']).default('draft'),
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().min(1)).default([]),
  /** The post itself, in Markdown. */
  body: z.string().min(1),
});

export const postCollection = z.array(postSchema);
export type Post = z.infer<typeof postSchema>;

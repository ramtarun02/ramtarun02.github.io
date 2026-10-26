import profileJson from '../../content/profile.json';
import experienceJson from '../../content/experience.json';
import skillsJson from '../../content/skills.json';
import publicationsJson from '../../content/publications.json';
import {
  experienceCollection,
  profileSchema,
  publicationCollection,
  skillCollection,
  type Experience,
  type Profile,
  type Publication,
  type SkillGroup,
} from './schema';

/**
 * Typed content loaders.
 *
 * Parsing happens at module load, which runs at build time — malformed content
 * fails the build rather than reaching a page. Collections are filtered to
 * published items and sorted by `order` here, so no component has to remember.
 */

function parseOrThrow<T>(
  schema: { safeParse: (input: unknown) => { success: boolean; data?: T; error?: unknown } },
  input: unknown,
  label: string,
): T {
  const result = schema.safeParse(input);
  if (!result.success || result.data === undefined) {
    throw new Error(`Invalid content in ${label}: ${JSON.stringify(result.error, null, 2)}`);
  }
  return result.data;
}

function visible<T extends { published: boolean; order: number }>(items: T[]): T[] {
  return items.filter((item) => item.published).sort((a, b) => a.order - b.order);
}

export const profile: Profile = parseOrThrow(profileSchema, profileJson, 'content/profile.json');

export const experience: Experience[] = visible(
  parseOrThrow(experienceCollection, experienceJson, 'content/experience.json'),
);

export const skills: SkillGroup[] = visible(
  parseOrThrow(skillCollection, skillsJson, 'content/skills.json'),
);

export const publications: Publication[] = visible(
  parseOrThrow(publicationCollection, publicationsJson, 'content/publications.json'),
);

/** Work history, newest first — education is shown separately. */
export const roles: Experience[] = experience.filter((item) => item.kind !== 'education');
export const education: Experience[] = experience.filter((item) => item.kind === 'education');

import caseStudiesJson from '../../content/case-studies.json';
import { caseStudyCollection, type CaseStudy } from './schema';

/**
 * Case studies. Drafts are excluded from the published list so a study can be
 * written across several sessions without appearing live.
 */
const allCaseStudies: CaseStudy[] = visible(
  parseOrThrow(caseStudyCollection, caseStudiesJson, 'content/case-studies.json'),
);

export const caseStudies: CaseStudy[] = allCaseStudies.filter(
  (study) => study.status === 'published',
);

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

import projectsJson from '../../content/projects.json';
import githubCacheJson from '../../content/github-cache.json';
import {
  githubCacheSchema,
  projectCollection,
  type GithubRepo,
  type Project,
  type ResolvedProject,
} from './schema';

/**
 * Projects join curated copy to GitHub facts.
 *
 * The GitHub side is a committed cache rather than a build-time fetch, so a
 * build never depends on the network or on an unauthenticated rate limit, and a
 * GitHub outage cannot empty the section. `pnpm sync:github` refreshes it.
 */
const githubCache = parseOrThrow(githubCacheSchema, githubCacheJson, 'content/github-cache.json');

const repoIndex = new Map<string, GithubRepo>(
  githubCache.repos.map((repo) => [repo.name.toLowerCase(), repo]),
);

const curatedProjects: Project[] = visible(
  parseOrThrow(projectCollection, projectsJson, 'content/projects.json'),
);

export const projects: ResolvedProject[] = curatedProjects.map((project) => {
  const repoData = project.repo ? repoIndex.get(project.repo.toLowerCase()) : undefined;
  return {
    ...project,
    repoData,
    displayTitle: project.title ?? (project.repo || 'Untitled project'),
    displaySummary: project.summary ?? repoData?.description ?? '',
  };
});

export const githubUser = githubCache.user;
export const githubFetchedAt = githubCache.fetchedAt;

/** Every repo GitHub knows about, for the admin's curation list. */
export const allRepos: GithubRepo[] = githubCache.repos;

import postsJson from '../../content/posts.json';
import { postCollection, type Post } from './schema';

const allPosts: Post[] = visible(parseOrThrow(postCollection, postsJson, 'content/posts.json'));

/** Newest first. Drafts never reach the public list. */
export const posts: Post[] = allPosts
  .filter((post) => post.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date));

export function postBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/**
 * Latest publications across both kinds, newest first, for the landing strip.
 * Case studies without an explicit date fall back to the first of their year,
 * so a study added later in the same year still sorts sensibly against posts.
 */
export interface LatestItem {
  id: string;
  kind: 'Case study' | 'Writing';
  title: string;
  summary: string;
  href: string;
  date: string;
  meta: string;
}

export const latest: LatestItem[] = [
  ...caseStudies.map<LatestItem>((study) => ({
    id: study.id,
    kind: 'Case study',
    title: study.title,
    summary: study.thesis,
    href: `/work/${study.slug}`,
    date: study.date ?? `${study.year}-01-01`,
    meta: study.domain,
  })),
  ...posts.map<LatestItem>((post) => ({
    id: post.id,
    kind: 'Writing',
    title: post.title,
    summary: post.summary,
    href: `/writing/${post.slug}`,
    date: post.date,
    meta: post.tags.join(' · '),
  })),
].sort((a, b) => b.date.localeCompare(a.date));

import sectionsJson from '../../content/sections.json';
import { sectionsSchema, type Sections } from './schema';

export const sections: Sections = parseOrThrow(
  sectionsSchema,
  sectionsJson,
  'content/sections.json',
);

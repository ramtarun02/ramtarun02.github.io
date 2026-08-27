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

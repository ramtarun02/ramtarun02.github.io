import type { z } from 'zod';
import {
  caseStudySchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  publicationSchema,
  skillGroupSchema,
} from '@/content/schema';

/**
 * The admin's registry of editable collections.
 *
 * Adding a collection is one entry here plus its schema. The form, the
 * validation and the commit path all follow from this — there is no separate
 * UI to write.
 */
export interface CollectionDef {
  key: string;
  label: string;
  path: string;
  /** A list of items, or a single object (the profile). */
  shape: 'list' | 'single';
  schema: z.ZodObject<z.ZodRawShape>;
  /** Field shown as the row title in the list. */
  titleField: string;
  /** Supports draft/published, ordering and visibility. */
  publishable: boolean;
}

export const COLLECTIONS: CollectionDef[] = [
  {
    key: 'profile',
    label: 'Profile',
    path: 'content/profile.json',
    shape: 'single',
    schema: profileSchema,
    titleField: 'name',
    publishable: false,
  },
  {
    key: 'experience',
    label: 'Experience',
    path: 'content/experience.json',
    shape: 'list',
    schema: experienceSchema,
    titleField: 'role',
    publishable: true,
  },
  {
    key: 'projects',
    label: 'Projects',
    path: 'content/projects.json',
    shape: 'list',
    schema: projectSchema,
    titleField: 'repo',
    publishable: true,
  },
  {
    key: 'publications',
    label: 'Publications',
    path: 'content/publications.json',
    shape: 'list',
    schema: publicationSchema,
    titleField: 'title',
    publishable: true,
  },
  {
    key: 'skills',
    label: 'Skills',
    path: 'content/skills.json',
    shape: 'list',
    schema: skillGroupSchema,
    titleField: 'title',
    publishable: true,
  },
  {
    key: 'case-studies',
    label: 'Case studies',
    path: 'content/case-studies.json',
    shape: 'list',
    schema: caseStudySchema,
    titleField: 'title',
    publishable: true,
  },
];

export function collectionByKey(key: string): CollectionDef | undefined {
  return COLLECTIONS.find((collection) => collection.key === key);
}

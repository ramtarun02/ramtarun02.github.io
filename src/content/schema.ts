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

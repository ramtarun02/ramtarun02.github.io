import { describe, expect, it } from 'vitest';
import { sections } from '@/content';
import { sectionsSchema } from '@/content/schema';

const NUMBER_WORDS = /\b(one|two|three|four|five|six|seven|eight|nine|ten|both|either)\b/i;

describe('section copy', () => {
  it('validates against the schema', () => {
    expect(sectionsSchema.safeParse(sections).success).toBe(true);
  });

  it('never counts the items beneath it', () => {
    // A heading like "Three studies, one question" becomes false the moment a
    // fourth is published. Titles must survive the content changing.
    for (const [key, copy] of Object.entries(sections)) {
      expect(copy.title, `${key} title counts its contents`).not.toMatch(NUMBER_WORDS);
    }
  });

  it('gives every section an eyebrow and a title', () => {
    for (const [key, copy] of Object.entries(sections)) {
      expect(copy.eyebrow.length, key).toBeGreaterThan(0);
      expect(copy.title.length, key).toBeGreaterThan(0);
    }
  });

  it('keeps titles short enough to hold as a display line', () => {
    for (const [key, copy] of Object.entries(sections)) {
      expect(copy.title.length, `${key} title is too long`).toBeLessThan(52);
    }
  });
});

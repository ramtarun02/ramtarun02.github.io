import { describe, expect, it } from 'vitest';
import { education, experience, profile, publications, roles, skills } from '@/content';
import { experienceSchema, publicationSchema } from '@/content/schema';

describe('content loading', () => {
  it('validates every collection at build time', () => {
    expect(profile.name).toBe('Tarun Ramprakash');
    expect(experience.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    expect(publications.length).toBe(3);
  });

  it('splits work history from education so each renders in its own section', () => {
    expect(roles.every((item) => item.kind !== 'education')).toBe(true);
    expect(education.every((item) => item.kind === 'education')).toBe(true);
    expect(roles.length + education.length).toBe(experience.length);
  });

  it('returns collections already sorted by order', () => {
    const orders = experience.map((item) => item.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });
});

describe('schemas', () => {
  it('rejects a malformed date rather than rendering it', () => {
    const result = experienceSchema.safeParse({
      id: 'x',
      role: 'r',
      organisation: 'o',
      location: 'l',
      start: 'March 2024',
      kind: 'role',
      summary: 's',
    });
    expect(result.success).toBe(false);
  });

  it('keeps selfIndex pointing at a real author', () => {
    for (const paper of publications) {
      expect(paper.selfIndex).toBeLessThan(paper.authors.length);
    }
  });

  it('requires a resolvable link on every publication', () => {
    const result = publicationSchema.safeParse({
      id: 'x',
      title: 't',
      authors: ['a'],
      selfIndex: 0,
      venue: 'v',
      year: 2024,
      href: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});

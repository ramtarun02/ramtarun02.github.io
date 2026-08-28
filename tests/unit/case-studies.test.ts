import { describe, expect, it } from 'vitest';
import { caseStudies, caseStudyBySlug } from '@/content';
import { caseStudySchema } from '@/content/schema';

describe('case studies', () => {
  it('publishes all three studies', () => {
    expect(caseStudies).toHaveLength(3);
    expect(caseStudies.every((study) => study.status === 'published')).toBe(true);
  });

  it('resolves by slug, and returns undefined for an unknown one', () => {
    expect(caseStudyBySlug('transonic-incidence-limit')?.year).toBe(2026);
    expect(caseStudyBySlug('does-not-exist')).toBeUndefined();
  });

  it('gives every study a thesis, since that is what carries it if nothing else is read', () => {
    for (const study of caseStudies) {
      expect(study.thesis.length).toBeGreaterThan(40);
    }
  });

  it('keeps slugs URL-safe and unique', () => {
    const slugs = caseStudies.map((study) => study.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('credits VFP licensing on the study that uses it', () => {
    const study = caseStudyBySlug('transonic-incidence-limit');
    expect(study?.credit).toContain('Cranfield University');
  });

  it('carries a Markdown body rather than structured blocks', () => {
    for (const study of caseStudies) {
      expect(study.body.length).toBeGreaterThan(500);
      expect(study.body).toContain('## ');
    }
  });

  it('keeps the typed fenced blocks Markdown has no syntax for', () => {
    const crm = caseStudyBySlug('transonic-incidence-limit');
    expect(crm?.body).toContain('```keynumbers');
    expect(crm?.body).toContain('```chart failureBoundary');
    expect(crm?.body).toContain('```finding ');
  });

  it('rejects a study with an empty body', () => {
    const result = caseStudySchema.safeParse({
      id: 'x',
      slug: 'x',
      title: 't',
      subtitle: 's',
      thesis: 'th',
      domain: 'd',
      tools: ['a'],
      year: 2026,
      body: '',
    });
    expect(result.success).toBe(false);
  });
});

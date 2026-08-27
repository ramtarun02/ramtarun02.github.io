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

  it('requires MathML alongside TeX so no maths library has to ship', () => {
    for (const study of caseStudies) {
      for (const block of study.blocks) {
        if (block.type === 'equation') {
          expect(block.mathml).toContain('<math');
          expect(block.tex.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('rejects a study whose highlighted table row is negative', () => {
    const result = caseStudySchema.safeParse({
      id: 'x',
      slug: 'x',
      title: 't',
      subtitle: 's',
      thesis: 'th',
      domain: 'd',
      tools: ['a'],
      year: 2026,
      blocks: [{ type: 'table', columns: ['a', 'b'], rows: [['1', '2']], highlightRow: -1 }],
    });
    expect(result.success).toBe(false);
  });
});

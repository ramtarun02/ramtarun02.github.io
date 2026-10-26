import { describe, expect, it } from 'vitest';
import { caseStudies, caseStudyBySlug } from '@/content';
import { caseStudySchema } from '@/content/schema';

describe('case studies', () => {
  it('publishes the aerospike study, featured on the homepage', () => {
    expect(caseStudies).toHaveLength(1);
    const study = caseStudyBySlug('aerospike-hypersonic-rans');
    expect(study?.status).toBe('published');
    expect(study?.featured).toBe(true);
  });

  it('returns undefined for an unknown slug', () => {
    expect(caseStudyBySlug('does-not-exist')).toBeUndefined();
  });

  it('gives every study a thesis, a short version and headline numbers', () => {
    for (const study of caseStudies) {
      expect(study.thesis.length).toBeGreaterThan(40);
      expect(study.tldr.length).toBeGreaterThan(2);
      expect(study.stats.length).toBe(4);
    }
  });

  it('keeps slugs URL-safe and unique', () => {
    const slugs = caseStudies.map((study) => study.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('uses only charts the renderer knows about', () => {
    const known = [
      'domePressure',
      'domeTemperature',
      'errorMetrics',
      'sensitivity',
      'runMatrix',
      'schlierenCompare',
    ];
    for (const study of caseStudies) {
      for (const match of study.body.matchAll(/^```chart (\w+)/gm)) {
        expect(known).toContain(match[1]);
      }
    }
  });

  it('does not name the lab the work was done with', () => {
    for (const study of caseStudies) {
      expect(study.body.toLowerCase()).not.toContain('flowthermo');
    }
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

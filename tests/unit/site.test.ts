import { describe, expect, it, afterEach } from 'vitest';
import { absoluteUrl, site, siteUrl } from '@/lib/site';

const ORIGINAL = process.env['NEXT_PUBLIC_SITE_URL'];

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env['NEXT_PUBLIC_SITE_URL'];
  else process.env['NEXT_PUBLIC_SITE_URL'] = ORIGINAL;
});

describe('siteUrl', () => {
  it('falls back to the GitHub Pages origin while no domain is configured', () => {
    delete process.env['NEXT_PUBLIC_SITE_URL'];
    expect(siteUrl()).toBe('https://ramtarun02.github.io');
  });

  it('strips trailing slashes so canonical URLs never double up', () => {
    process.env['NEXT_PUBLIC_SITE_URL'] = 'https://example.com///';
    expect(siteUrl()).toBe('https://example.com');
  });

  it('joins paths without duplicating the separator', () => {
    process.env['NEXT_PUBLIC_SITE_URL'] = 'https://example.com';
    expect(absoluteUrl('/projects')).toBe('https://example.com/projects');
    expect(absoluteUrl('projects')).toBe('https://example.com/projects');
  });
});

describe('site identity', () => {
  it('lists every published name variant so citations resolve to one person', () => {
    expect(site.nameVariants).toContain('Tarun Ramprakash Thambidurai Arasi');
    expect(site.nameVariants).toContain('T. Tarun');
  });
});

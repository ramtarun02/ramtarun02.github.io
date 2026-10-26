/**
 * Single source of truth for site identity and canonical URLs.
 * A domain has not been purchased yet (build spec §11) — set NEXT_PUBLIC_SITE_URL
 * when it is, and every canonical link, sitemap entry and OG tag follows.
 */
export const site = {
  name: 'Tarun Ramprakash',
  /** Canonical published form. Publication variants live in `nameVariants`. */
  canonicalName: 'Tarun Ramprakash Thambidurai Arasi',
  /** Indexed differently by AIAA, ICAS and his CV — emitted as structured data
   *  so citation trackers resolve all three to one person. */
  nameVariants: [
    'Tarun Ramprakash Thambidurai Arasi',
    'Tarun Ramprakash TA',
    'T. Tarun',
    'T. A. Ramprakash',
  ],
  role: 'Aerospace Researcher — CFD & Solver Development',
  description:
    'Aerospace researcher working in computational fluid dynamics and solver development. Open to academic and industrial collaboration.',
  locale: 'en_GB',
  github: 'ramtarun02',
  linkedin: 'https://www.linkedin.com/in/ramtarun237/',
  email: 'tarun.uk24@gmail.com',
} as const;

const FALLBACK_URL = 'https://ramtarun02.github.io';

/** Canonical origin, without a trailing slash. */
export function siteUrl(): string {
  const raw = process.env['NEXT_PUBLIC_SITE_URL'] ?? FALLBACK_URL;
  return raw.replace(/\/+$/, '');
}

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}/${path.replace(/^\/+/, '')}`;
}

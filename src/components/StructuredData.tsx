import { absoluteUrl, site } from '@/lib/site';
import type { Profile, Publication } from '@/content/schema';

/**
 * Person JSON-LD.
 *
 * `alternateName` carries every form his publications are indexed under —
 * AIAA, ICAS and his CV each spell the name differently, and without this a
 * citation tracker treats them as three people.
 */
export function StructuredData({
  profile,
  publications,
}: {
  profile: Profile;
  publications: Publication[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.nameVariants,
    url: absoluteUrl('/'),
    jobTitle: profile.headline,
    description: profile.summaryShort,
    sameAs: [
      ...new Set([`https://github.com/${site.github}`, ...profile.links.map((l) => l.href)]),
    ],
    address: { '@type': 'PostalAddress', addressLocality: profile.location },
    knowsAbout: [
      'Computational fluid dynamics',
      'Transonic aerodynamics',
      'Numerical methods',
      'Solver development',
    ],
    subjectOf: publications.map((paper) => ({
      '@type': 'ScholarlyArticle',
      name: paper.title,
      datePublished: String(paper.year),
      ...(paper.href ? { url: paper.href } : {}),
      ...(paper.doi ? { identifier: `https://doi.org/${paper.doi}` } : {}),
      author: paper.authors.map((author) => ({ '@type': 'Person', name: author })),
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

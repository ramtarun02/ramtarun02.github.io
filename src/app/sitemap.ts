import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { caseStudies, posts } from '@/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl('/'), lastModified: now, priority: 1 },
    { url: absoluteUrl('/work'), lastModified: now, priority: 0.8 },
    { url: absoluteUrl('/writing'), lastModified: now, priority: 0.5 },
    ...caseStudies.map((study) => ({
      url: absoluteUrl(`/work/${study.slug}`),
      lastModified: now,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/writing/${post.slug}`),
      lastModified: new Date(post.date),
      priority: 0.6,
    })),
  ];
}

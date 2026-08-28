import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { Markdown } from '@/components/markdown/Markdown';
import { DocumentRail } from '@/components/markdown/DocumentRail';
import { postBySlug, posts, profile } from '@/content';

export const dynamicParams = false;

/**
 * Static export refuses a dynamic route that generates no pages, and there are
 * no posts yet. One placeholder — which renders as a 404 — keeps the route in
 * the build without inventing content, and disappears on its own when a real
 * post is published.
 */
const PLACEHOLDER = '__no-posts-yet';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  if (posts.length === 0) return [{ slug: PLACEHOLDER }];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const published = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <SiteHeader name={profile.name} />

      <main className="reading-surface shell pt-32 pb-24 sm:pt-40">
        <header className="mb-16 flex max-w-5xl flex-col gap-6">
          <h1 className="u-display" style={{ fontSize: 'var(--text-5xl)' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--ink-muted)' }}>{post.summary}</p>
        </header>

        <hr className="u-rule mb-14" />

        <div className="doc-grid">
          <DocumentRail
            source={post.body}
            backHref="/writing"
            backLabel="All writing"
            meta={[{ label: 'Published', value: published }]}
            tags={post.tags}
          />
          <article className="min-w-0">
            <Markdown source={post.body} />
          </article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

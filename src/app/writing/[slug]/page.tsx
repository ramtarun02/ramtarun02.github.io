import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FlowLayer } from '@/components/flow/FlowLayer';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { Markdown } from '@/components/markdown/Markdown';
import { DocumentMeta } from '@/components/markdown/DocumentMeta';
import { postBySlug, posts, profile } from '@/content';

export const dynamicParams = false;

/**
 * Static export refuses a dynamic route that generates no pages at all, and
 * there are no posts yet. Emitting one placeholder — which renders as a 404 —
 * keeps the route in the build without inventing content. It disappears on its
 * own the moment a real post is published, so nothing has to be remembered.
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

  return (
    <>
      <FlowLayer />
      <SiteHeader name={profile.name} />
      <main className="reading-surface mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40">
        <Link href="/writing" className="u-label" style={{ color: 'var(--accent)' }}>
          ← All writing
        </Link>
        <h1
          className="mt-8 tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            lineHeight: 1.02,
          }}
        >
          {post.title}
        </h1>
        <p
          className="mt-4 font-[family-name:var(--font-mono)] text-sm"
          style={{ color: 'var(--ink-faint)' }}
        >
          {new Date(post.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <hr className="my-12" style={{ border: 0, borderTop: '1px solid var(--edge)' }} />
        <DocumentMeta source={post.body} />

        <Markdown source={post.body} />
      </main>
      <SiteFooter />
    </>
  );
}

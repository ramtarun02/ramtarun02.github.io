import type { Metadata } from 'next';
import Link from 'next/link';
import { FlowLayer } from '@/components/flow/FlowLayer';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { posts, profile } from '@/content';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on solvers, transonic aerodynamics and numerical methods.',
};

export default function WritingPage() {
  return (
    <>
      <FlowLayer />
      <SiteHeader name={profile.name} />
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 sm:pt-40">
        <p className="u-label" style={{ color: 'var(--accent)' }}>
          Writing
        </p>
        <h1
          className="mt-4 tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            lineHeight: 1.02,
          }}
        >
          Notes on method
        </h1>

        {posts.length === 0 ? <EmptyState /> : <PostList />}
      </main>
      <SiteFooter />
    </>
  );
}

function PostList() {
  return (
    <div className="mt-14 flex flex-col gap-5">
      {posts.map((post) => (
        <Link key={post.id} href={`/writing/${post.slug}`} className="block">
          <GlassPanel as="article" flowBody className="p-7 sm:p-9">
            <p className="u-label" style={{ color: 'var(--ink-faint)' }}>
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h2
              className="mt-3 text-balance"
              style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, lineHeight: 1.2 }}
            >
              {post.title}
            </h2>
            <p className="u-measure mt-3" style={{ color: 'var(--ink-muted)' }}>
              {post.summary}
            </p>
          </GlassPanel>
        </Link>
      ))}
    </div>
  );
}

/**
 * An empty section that reads as deliberate rather than unfinished. It says
 * what will go here and points at the work that already exists, so the page is
 * useful on the day it ships rather than only after the first post.
 */
function EmptyState() {
  return (
    <GlassPanel flowBody radius="xl" className="mt-14 p-8 sm:p-12">
      <p className="u-measure" style={{ fontSize: 'var(--text-lg)' }}>
        Nothing here yet — deliberately. Anything worth writing up properly has gone into the case
        studies, where it can carry figures, tables and the data behind the argument.
      </p>
      <p className="u-measure mt-5" style={{ color: 'var(--ink-muted)' }}>
        This is where shorter pieces will land: notes on discretisation schemes, things a solver did
        that it should not have, and the occasional argument about what low-fidelity methods are
        actually for.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center px-6 py-3 text-sm font-semibold"
          style={{
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent)',
            color: 'var(--accent-contrast)',
          }}
        >
          Read the case studies
        </Link>
      </div>
    </GlassPanel>
  );
}

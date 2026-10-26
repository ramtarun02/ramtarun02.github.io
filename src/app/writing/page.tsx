import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { posts, profile, sections } from '@/content';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on solvers, transonic aerodynamics and numerical methods.',
};

export default function WritingPage() {
  return (
    <>
      <SiteHeader name={profile.name} />
      <main className="shell pt-32 pb-24 sm:pt-40">
        <p className="u-label" style={{ color: 'var(--accent)' }}>
          {sections.writing.eyebrow}
        </p>
        <h1
          className="mt-4 tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            lineHeight: 1.02,
          }}
        >
          {sections.writing.title}
        </h1>

        {posts.length === 0 ? <EmptyState /> : <PostList />}
      </main>
      <SiteFooter name={profile.name} />
    </>
  );
}

function PostList() {
  return (
    <div className="mt-14 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/writing/${post.slug}`} className="block">
          <GlassPanel as="article" interactive className="p-7 sm:p-9">
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
    <GlassPanel interactive radius="xl" className="mt-14 p-8 sm:p-12">
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

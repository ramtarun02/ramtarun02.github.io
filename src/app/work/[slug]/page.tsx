import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AmbientField } from '@/components/AmbientField';
import { SiteHeader } from '@/components/nav/SiteHeader';
import { SiteFooter } from '@/components/nav/SiteFooter';
import { Blocks } from '@/components/case-study/Blocks';
import { caseStudies, caseStudyBySlug, profile } from '@/content';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.thesis,
    openGraph: { title: study.title, description: study.thesis },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <AmbientField />
      <SiteHeader name={profile.name} />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40">
        <Link href="/work" className="u-label" style={{ color: 'var(--accent)' }}>
          ← All case studies
        </Link>

        <header className="mt-8 flex flex-col gap-5">
          <h1
            className="tracking-tight text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-5xl)',
              lineHeight: 1.02,
            }}
          >
            {study.title}
          </h1>
          <p
            className="font-[family-name:var(--font-mono)] text-sm"
            style={{ color: 'var(--ink-faint)' }}
          >
            {study.subtitle}
          </p>
          <p
            className="u-measure"
            style={{ fontSize: 'var(--text-xl)', color: 'var(--ink-muted)' }}
          >
            {study.thesis}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {study.tools.map((tool) => (
              <li
                key={tool}
                className="u-label px-2.5 py-1"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--edge)',
                  color: 'var(--ink-muted)',
                }}
              >
                {tool}
              </li>
            ))}
          </ul>
        </header>

        <hr className="my-14" style={{ border: 0, borderTop: '1px solid var(--edge)' }} />

        <Blocks blocks={study.blocks} />

        {study.credit ? (
          <p
            className="u-measure mt-20 pt-6 text-xs"
            style={{ borderTop: '1px solid var(--edge)', color: 'var(--ink-faint)' }}
          >
            {study.credit}
          </p>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

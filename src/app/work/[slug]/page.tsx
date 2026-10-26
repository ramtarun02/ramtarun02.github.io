import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyHeader } from '@/components/nav/CaseStudyHeader';
import { Markdown } from '@/components/markdown/Markdown';
import { DocumentRail } from '@/components/markdown/DocumentRail';
import { caseStudies, caseStudyBySlug } from '@/content';

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
    <div className="cs-theme">
      <CaseStudyHeader />

      <main className="reading-surface shell pt-16 pb-24 sm:pt-20">
        <header className="mb-16 flex max-w-5xl flex-col gap-6" style={{ paddingTop: '3.5rem' }}>
          <p className="u-label" style={{ color: 'var(--accent)' }}>
            {study.domain}
          </p>
          <h1 className="u-display" style={{ fontSize: 'var(--text-5xl)' }}>
            {study.title}
          </h1>
          <p
            className="font-[family-name:var(--font-mono)] text-sm"
            style={{ color: 'var(--ink-faint)' }}
          >
            {study.subtitle}
          </p>
          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--ink-muted)' }}>{study.thesis}</p>
        </header>

        <hr className="u-rule mb-14" />

        <div className="doc-grid">
          <DocumentRail
            source={study.body}
            backHref="/work"
            backLabel="All case studies"
            meta={[{ label: 'Year', value: String(study.year) }]}
            tags={study.tools}
          />

          <article className="min-w-0">
            <Markdown source={study.body} />

            {study.credit ? (
              <p
                className="u-measure mt-20 pt-6 text-xs"
                style={{ borderTop: '1px solid var(--edge)', color: 'var(--ink-faint)' }}
              >
                {study.credit}
              </p>
            ) : null}
          </article>
        </div>
      </main>
    </div>
  );
}

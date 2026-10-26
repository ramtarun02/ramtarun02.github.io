import { marked } from 'marked';
import type { ReactNode } from 'react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Figure } from '@/components/case-study/Figure';
import {
  DomePressureChart,
  DomeTemperatureChart,
  ErrorChart,
  RunMatrix,
  SchlierenCompare,
  SensitivityChart,
} from '@/components/case-study/aerospike';
import { parseMarkdown, slugify, type Segment } from '@/lib/markdown/parse';

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    // Stable heading ids so a table of contents and deep links both work.
    heading(this: unknown, token: { depth: number; text: string }) {
      const id = slugify(token.text);
      return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>\n`;
    },
  },
});

/** Chart blocks a document can name: ```chart <name>. */
const CHARTS: Record<string, () => ReactNode> = {
  domePressure: () => <DomePressureChart />,
  domeTemperature: () => <DomeTemperatureChart />,
  errorMetrics: () => <ErrorChart />,
  sensitivity: () => <SensitivityChart />,
  runMatrix: () => <RunMatrix />,
  schlierenCompare: () => <SchlierenCompare />,
};

/**
 * Renders a Markdown document, with the typed fenced blocks broken out as
 * components. Content comes from the site's own repository, so it is trusted
 * input — an authoring format, not user-submitted HTML.
 */
export function Markdown({ source }: { source: string }) {
  const segments = parseMarkdown(source);
  return (
    <div className="flex flex-col gap-9">
      {segments.map((segment, index) => (
        <SegmentView key={index} segment={segment} />
      ))}
    </div>
  );
}

function html(text: string) {
  return { __html: marked.parse(text) as string };
}

function SegmentView({ segment }: { segment: Segment }) {
  if (segment.type === 'markdown') {
    return <div className="md-prose" dangerouslySetInnerHTML={html(segment.text)} />;
  }

  if (segment.type === 'figure') {
    return <Figure src={segment.src} caption={segment.caption} />;
  }

  if (segment.type === 'deepdive') {
    return (
      <details className="glass deepdive">
        <summary>
          <span className="chip chip--violet">Deep dive</span>
          <span
            style={{ fontWeight: 800, fontSize: 'var(--text-base)', letterSpacing: '-0.015em' }}
          >
            {segment.title}
          </span>
          <span className="deepdive-chevron" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M2.5 4.5L6 8l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </summary>
        <div className="deepdive-body md-prose" dangerouslySetInnerHTML={html(segment.body)} />
      </details>
    );
  }

  if (segment.type === 'keyNumbers') {
    return (
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ margin: 0 }}>
        {segment.items.map((item) => (
          <GlassPanel key={item.label} radius="md" interactive className="p-5">
            <dt
              className="u-gradient-text"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              {item.value}
            </dt>
            <dd className="mt-2 text-sm" style={{ margin: '8px 0 0', color: 'var(--ink)' }}>
              {item.label}
              {item.note ? (
                <span className="mt-1 block text-xs" style={{ color: 'var(--ink-faint)' }}>
                  {item.note}
                </span>
              ) : null}
            </dd>
          </GlassPanel>
        ))}
      </dl>
    );
  }

  if (segment.type === 'callout') {
    const caution = segment.tone === 'caution';
    const accent = caution ? 'var(--amber-300)' : 'var(--ice-300)';
    return (
      <aside
        className="glass"
        style={{
          borderRadius: 22,
          padding: '20px 22px 20px 24px',
          background: caution
            ? 'linear-gradient(160deg, rgba(252,211,77,0.09), rgba(255,255,255,0.03))'
            : 'linear-gradient(160deg, rgba(125,211,252,0.1), rgba(255,255,255,0.03))',
          borderLeft: `3px solid ${accent}`,
        }}
      >
        <p className="u-label" style={{ color: accent, margin: 0 }}>
          {caution ? 'Watch out' : 'Finding'}
        </p>
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '8px 0 6px',
          }}
        >
          {segment.title}
        </h3>
        <div
          className="md-prose"
          style={{ fontSize: 'var(--text-sm)' }}
          dangerouslySetInnerHTML={html(segment.body)}
        />
      </aside>
    );
  }

  const render = CHARTS[segment.chart];
  if (!render) {
    return (
      <p className="text-sm" style={{ color: 'var(--warn)' }}>
        Unknown chart: <code>{segment.chart}</code>
      </p>
    );
  }

  return (
    <figure style={{ margin: 0 }} className="flex flex-col gap-3">
      <GlassPanel radius="xl" className="p-5 sm:p-7">
        {render()}
      </GlassPanel>
      {segment.caption ? (
        <figcaption
          className="u-measure"
          style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-muted)' }}
        >
          {segment.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

import { marked } from 'marked';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { FailureBoundaryChart, GridConvergenceChart } from '@/components/case-study/charts';
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

/**
 * Renders a Markdown document, with the typed fenced blocks broken out as
 * components. Content comes from the site's own repository, so it is trusted
 * input — an authoring format, not user-submitted HTML.
 */
export function Markdown({ source }: { source: string }) {
  const segments = parseMarkdown(source);
  return (
    <div className="flex flex-col gap-8">
      {segments.map((segment, index) => (
        <SegmentView key={index} segment={segment} />
      ))}
    </div>
  );
}

function SegmentView({ segment }: { segment: Segment }) {
  if (segment.type === 'markdown') {
    return (
      <div
        className="md-prose"
        dangerouslySetInnerHTML={{ __html: marked.parse(segment.text) as string }}
      />
    );
  }

  if (segment.type === 'keyNumbers') {
    return (
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {segment.items.map((item) => (
          <GlassPanel key={item.label} radius="md" interactive className="p-5">
            <dt
              className="font-[family-name:var(--font-mono)] tracking-tight"
              style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}
            >
              {item.value}
            </dt>
            <dd className="mt-2 text-sm">
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
    const accent = segment.tone === 'caution' ? 'var(--warn)' : 'var(--accent)';
    return (
      <aside
        className="flex flex-col gap-2.5 py-1 pl-6"
        style={{ borderLeft: `2px solid ${accent}` }}
      >
        <p className="u-label" style={{ color: accent }}>
          {segment.tone === 'caution' ? 'Caveat' : 'Finding'}
        </p>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{segment.title}</h3>
        <div
          className="md-prose u-measure"
          dangerouslySetInnerHTML={{ __html: marked.parse(segment.body) as string }}
        />
      </aside>
    );
  }

  const chart =
    segment.chart === 'failureBoundary' ? (
      <FailureBoundaryChart />
    ) : segment.chart === 'gridConvergence' ? (
      <GridConvergenceChart />
    ) : null;

  if (!chart) {
    return (
      <p className="text-sm" style={{ color: 'var(--warn)' }}>
        Unknown chart: <code>{segment.chart}</code>
      </p>
    );
  }

  return (
    <figure className="flex flex-col gap-3">
      <GlassPanel interactive className="p-5 sm:p-7">
        {chart}
      </GlassPanel>
      {segment.caption ? (
        <figcaption className="u-measure text-sm" style={{ color: 'var(--ink-muted)' }}>
          {segment.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

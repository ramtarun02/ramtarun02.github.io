import Image from 'next/image';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { FailureBoundaryChart, GridConvergenceChart } from './charts';
import type { CaseStudyBlock } from '@/content/schema';

export function Blocks({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case 'prose':
      return (
        <div className="flex flex-col gap-5">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="u-measure cs-prose">
              {paragraph}
            </p>
          ))}
        </div>
      );

    case 'heading':
      return (
        <header className="mt-8 flex flex-col gap-3">
          {block.eyebrow ? (
            <p className="u-label" style={{ color: 'var(--accent)' }}>
              {block.eyebrow}
            </p>
          ) : null}
          <h2
            className="tracking-tight text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              lineHeight: 1.1,
            }}
          >
            {block.text}
          </h2>
        </header>
      );

    case 'keyNumbers':
      return (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <GlassPanel key={item.label} radius="md" className="p-5">
              <dt
                className="font-[family-name:var(--font-mono)] tracking-tight"
                style={{ fontSize: 'var(--text-2xl)', color: 'var(--accent)' }}
              >
                {item.value}
              </dt>
              <dd className="mt-2 text-sm" style={{ color: 'var(--ink)' }}>
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

    case 'figure':
      return (
        <figure className="flex flex-col gap-3">
          {/* Scientific figures are authored on white; they are shown on a light
              surface in both themes rather than inverted, which would corrupt
              the colour encoding of the plots themselves. */}
          <div className="u-squircle overflow-hidden bg-white p-3">
            <Image
              src={block.src}
              alt={block.alt}
              width={1600}
              height={1000}
              className="h-auto w-full"
              sizes="(max-width: 900px) 100vw, 860px"
            />
          </div>
          <figcaption className="u-measure text-sm" style={{ color: 'var(--ink-muted)' }}>
            {block.caption}
          </figcaption>
        </figure>
      );

    case 'table':
      return (
        <figure className="flex flex-col gap-3">
          <div
            className="u-scroll-x u-squircle"
            style={{ border: '1px solid var(--edge)', background: 'var(--glass)' }}
          >
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="u-label px-4 py-3 text-left whitespace-nowrap"
                      style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--edge)' }}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => {
                  const highlighted = block.highlightRow === rowIndex;
                  return (
                    <tr
                      key={row.join('|')}
                      style={{
                        background: highlighted
                          ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                          : undefined,
                      }}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${cellIndex}-${cell}`}
                          className="px-4 py-3 align-top"
                          style={{
                            borderBottom: '1px solid var(--edge)',
                            color: cellIndex === 0 ? 'var(--ink)' : 'var(--ink-muted)',
                            fontWeight: highlighted ? 600 : undefined,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {block.caption ? (
            <figcaption className="u-measure text-sm" style={{ color: 'var(--ink-muted)' }}>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case 'callout': {
      const accent = block.tone === 'caution' ? 'var(--warn)' : 'var(--accent)';
      return (
        <aside
          className="flex flex-col gap-2.5 py-1 pl-6"
          style={{ borderLeft: `2px solid ${accent}` }}
        >
          <p className="u-label" style={{ color: accent }}>
            {block.tone === 'caution' ? 'Caveat' : 'Finding'}
          </p>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{block.title}</h3>
          <p className="u-measure" style={{ color: 'var(--ink-muted)' }}>
            {block.body}
          </p>
        </aside>
      );
    }

    case 'equation':
      return (
        <figure className="flex flex-col gap-3">
          <div
            className="u-squircle overflow-x-auto px-6 py-7 text-center"
            style={{
              border: '1px solid var(--edge)',
              background: 'var(--glass)',
              fontSize: '1.3rem',
            }}
            /* No aria-label: ARIA prohibits it on a generic container, and MathML is
               announced natively as an equation. The TeX stays in the content as the
               editable source, not as a label. */
            dangerouslySetInnerHTML={{ __html: block.mathml }}
          />
          {block.caption ? (
            <figcaption className="u-measure text-sm" style={{ color: 'var(--ink-muted)' }}>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case 'chart':
      return (
        <figure className="flex flex-col gap-3">
          <GlassPanel className="p-5 sm:p-7">
            {block.chart === 'failureBoundary' ? (
              <FailureBoundaryChart />
            ) : (
              <GridConvergenceChart />
            )}
          </GlassPanel>
          <figcaption className="u-measure text-sm" style={{ color: 'var(--ink-muted)' }}>
            {block.caption}
          </figcaption>
        </figure>
      );
  }
}

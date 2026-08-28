/**
 * Markdown with a few typed escape hatches.
 *
 * Case studies and posts are authored as Markdown, because that is what writing
 * long-form technical prose in a text editor should feel like. But a CFD write-
 * up needs things Markdown has no syntax for — an interactive chart, a row of
 * key numbers, a called-out finding. Those are fenced blocks with a known
 * language tag, split out here and rendered as components; everything else is
 * ordinary Markdown.
 *
 *     ```chart failureBoundary
 *     Caption text for the figure.
 *     ```
 *
 *     ```keynumbers
 *     ±0.03 | Spread in pre-shock Mach at failure | across four conditions
 *     +71%  | Incidence range recovered           | 3.4 deg to 5.8 deg
 *     ```
 *
 *     ```finding Title of the finding
 *     Body text.
 *     ```
 */

export type Segment =
  | { type: 'markdown'; text: string }
  | { type: 'chart'; chart: string; caption: string }
  | { type: 'keyNumbers'; items: { value: string; label: string; note?: string }[] }
  | { type: 'callout'; tone: 'finding' | 'caution'; title: string; body: string };

const FENCE = /^```(chart|keynumbers|finding|caution)([^\n]*)\n([\s\S]*?)\n?```$/gm;

export function parseMarkdown(source: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;

  // `FENCE` is global; reset so repeated calls start clean.
  FENCE.lastIndex = 0;
  let match = FENCE.exec(source);

  while (match !== null) {
    const [full, tag, rest, inner] = match;
    const before = source.slice(lastIndex, match.index);
    if (before.trim()) segments.push({ type: 'markdown', text: before });

    const argument = (rest ?? '').trim();
    const body = inner ?? '';

    if (tag === 'chart') {
      segments.push({ type: 'chart', chart: argument, caption: body.trim() });
    } else if (tag === 'keynumbers') {
      segments.push({ type: 'keyNumbers', items: parseKeyNumbers(body) });
    } else if (tag === 'finding' || tag === 'caution') {
      segments.push({ type: 'callout', tone: tag, title: argument, body: body.trim() });
    }

    lastIndex = match.index + full.length;
    match = FENCE.exec(source);
  }

  const tail = source.slice(lastIndex);
  if (tail.trim()) segments.push({ type: 'markdown', text: tail });

  return segments;
}

/** One item per line: `value | label | optional note`. */
function parseKeyNumbers(body: string): { value: string; label: string; note?: string }[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = '', label = '', note] = line.split('|').map((part) => part.trim());
      return note ? { value, label, note } : { value, label };
    })
    .filter((item) => item.value && item.label);
}

/** Reading time in minutes, at a deliberate 200 wpm for technical prose. */
export function readingTime(source: string): number {
  const words = source.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Headings, for a table of contents. */
export function extractHeadings(source: string): { depth: number; text: string; id: string }[] {
  const headings: { depth: number; text: string; id: string }[] = [];
  for (const line of source.split('\n')) {
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;
    const depth = match[1]?.length ?? 2;
    const text = (match[2] ?? '').trim();
    headings.push({ depth, text, id: slugify(text) });
  }
  return headings;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

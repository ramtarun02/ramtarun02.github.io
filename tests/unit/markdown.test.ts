import { describe, expect, it } from 'vitest';
import { extractHeadings, parseMarkdown, readingTime, slugify } from '@/lib/markdown/parse';

describe('parseMarkdown', () => {
  it('returns plain prose untouched as a single segment', () => {
    const segments = parseMarkdown('Just some prose.\n\nAnd more.');
    expect(segments).toHaveLength(1);
    expect(segments[0]?.type).toBe('markdown');
  });

  it('splits a chart fence out of the surrounding prose', () => {
    const segments = parseMarkdown(
      'Before.\n\n```chart failureBoundary\nA caption.\n```\n\nAfter.',
    );
    expect(segments.map((s) => s.type)).toEqual(['markdown', 'chart', 'markdown']);
    const chart = segments[1];
    if (chart?.type !== 'chart') throw new Error('expected a chart segment');
    expect(chart.chart).toBe('failureBoundary');
    expect(chart.caption).toBe('A caption.');
  });

  it('parses key numbers as value, label and optional note', () => {
    const segments = parseMarkdown(
      '```keynumbers\n±0.03 | Spread | across four\n+71% | Recovered\n```',
    );
    const block = segments[0];
    if (block?.type !== 'keyNumbers') throw new Error('expected key numbers');
    expect(block.items).toEqual([
      { value: '±0.03', label: 'Spread', note: 'across four' },
      { value: '+71%', label: 'Recovered' },
    ]);
  });

  it('ignores malformed key-number lines rather than rendering blanks', () => {
    const segments = parseMarkdown('```keynumbers\nvalue only\n\ngood | label\n```');
    const block = segments[0];
    if (block?.type !== 'keyNumbers') throw new Error('expected key numbers');
    expect(block.items).toEqual([{ value: 'good', label: 'label' }]);
  });

  it('reads callouts with a tone and a title', () => {
    const segments = parseMarkdown('```caution Watch out\nBody text.\n```');
    const block = segments[0];
    if (block?.type !== 'callout') throw new Error('expected a callout');
    expect(block.tone).toBe('caution');
    expect(block.title).toBe('Watch out');
    expect(block.body).toBe('Body text.');
  });

  it('leaves ordinary code fences alone', () => {
    const segments = parseMarkdown('```python\nprint("hi")\n```');
    expect(segments).toHaveLength(1);
    expect(segments[0]?.type).toBe('markdown');
  });

  it('can be called repeatedly — the global regex is reset', () => {
    const source = '```chart gridConvergence\nc\n```';
    expect(parseMarkdown(source)).toHaveLength(1);
    expect(parseMarkdown(source)).toHaveLength(1);
  });
});

describe('headings and reading time', () => {
  it('extracts h2 and h3 with slugged ids', () => {
    const headings = extractHeadings('# Title\n\n## First Section\n\n### Nested Bit\n');
    expect(headings).toEqual([
      { depth: 2, text: 'First Section', id: 'first-section' },
      { depth: 3, text: 'Nested Bit', id: 'nested-bit' },
    ]);
  });

  it('slugs punctuation away without collapsing distinct headings', () => {
    expect(slugify('Why It Works: an entropy jump')).toBe('why-it-works-an-entropy-jump');
  });

  it('never reports less than a minute', () => {
    expect(readingTime('one two three')).toBe(1);
    expect(readingTime('word '.repeat(1000))).toBe(5);
  });
});

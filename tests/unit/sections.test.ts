import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange } from '@/components/sections/Experience';
import { rampColor } from '@/components/sections/Skills';

describe('formatMonth', () => {
  it('renders an ISO year-month as a readable label', () => {
    expect(formatMonth('2024-09')).toBe('Sep 2024');
    expect(formatMonth('2026-01')).toBe('Jan 2026');
  });

  it('returns the input unchanged rather than throwing on bad data', () => {
    expect(formatMonth('nonsense')).toBe('nonsense');
    expect(formatMonth('2024-13')).toBe('2024-13');
  });
});

describe('formatRange', () => {
  it('shows an open-ended role as current', () => {
    expect(formatRange('2026-01')).toBe('Jan 2026 — Present');
  });

  it('shows both ends of a finished role', () => {
    expect(formatRange('2023-12', '2024-09')).toBe('Dec 2023 — Sep 2024');
  });
});

describe('rampColor', () => {
  it('maps the ends of the range to the ends of the ramp', () => {
    expect(rampColor(0)).toBe('var(--color-vel-1)');
    expect(rampColor(1)).toBe('var(--color-vel-5)');
  });

  it('stays inside the ramp for out-of-range input', () => {
    expect(rampColor(-5)).toBe('var(--color-vel-1)');
    expect(rampColor(9)).toBe('var(--color-vel-5)');
  });
});

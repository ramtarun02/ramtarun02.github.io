import { describe, expect, it } from 'vitest';
import { revealVariants, spring, staggerVariants, RISE_DISTANCE } from '@/lib/motion';

describe('spring tokens', () => {
  it('orders springs from crisp to weighty by visual duration', () => {
    expect(spring.snappy.visualDuration).toBeLessThan(spring.standard.visualDuration);
    expect(spring.standard.visualDuration).toBeLessThan(spring.weighty.visualDuration);
  });

  it('keeps overshoot restrained everywhere except the deliberately bouncy token', () => {
    expect(spring.snappy.bounce).toBeLessThan(0.25);
    expect(spring.standard.bounce).toBeLessThan(0.25);
    expect(spring.weighty.bounce).toBeLessThan(0.25);
    expect(spring.bouncy.bounce).toBeGreaterThan(0.3);
  });
});

describe('reveal', () => {
  it('rises from below and lands at rest', () => {
    expect(revealVariants['hidden']).toMatchObject({ opacity: 0, y: RISE_DISTANCE });
    expect(revealVariants['visible']).toMatchObject({ opacity: 1, y: 0 });
  });
});

describe('staggerVariants', () => {
  it('applies the requested cadence', () => {
    const variants = staggerVariants(0.1, 0.2);
    expect(variants['visible']).toMatchObject({
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    });
  });

  it('defaults to a cadence quick enough not to feel sluggish in a long list', () => {
    const variants = staggerVariants();
    const transition = (variants['visible'] as { transition: { staggerChildren: number } })
      .transition;
    expect(transition.staggerChildren).toBeLessThanOrEqual(0.08);
  });
});

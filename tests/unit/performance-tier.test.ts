import { describe, expect, it } from 'vitest';
import { TIER_SETTINGS } from '@/lib/performanceTier';

describe('tier settings', () => {
  it('never animates on the static tier', () => {
    expect(TIER_SETTINGS.static.animate).toBe(false);
  });

  it('reduces cost monotonically as the tier drops', () => {
    expect(TIER_SETTINGS.full.maxDpr).toBeGreaterThanOrEqual(TIER_SETTINGS.reduced.maxDpr);
    expect(TIER_SETTINGS.full.resolutionScale).toBeGreaterThan(
      TIER_SETTINGS.reduced.resolutionScale,
    );
    expect(TIER_SETTINGS.full.quality).toBeGreaterThanOrEqual(TIER_SETTINGS.reduced.quality);
  });

  it('caps device pixel ratio so a retina display cannot quadruple the fill cost', () => {
    expect(TIER_SETTINGS.full.maxDpr).toBeLessThanOrEqual(2);
  });
});

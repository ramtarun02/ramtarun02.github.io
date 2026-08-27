export type PerformanceTier = 'full' | 'reduced' | 'static';

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
  getBattery?: () => Promise<{ charging: boolean; level: number }>;
}

/** Cheap, synchronous capability read. Battery is checked separately, async. */
export function detectTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'static';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return 'static';

  if (!supportsWebGL2()) return 'static';

  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;

  if (cores <= 2 || memory <= 2) return 'static';
  if (cores <= 4 || memory <= 4) return 'reduced';

  // Phones and tablets: capable, but the battery cost is not worth full tier.
  if (window.matchMedia('(pointer: coarse)').matches) return 'reduced';

  return 'full';
}

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2') !== null;
  } catch {
    return false;
  }
}

/** Drops to 'reduced' on a device running on a low battery. */
export async function batteryAdjustedTier(tier: PerformanceTier): Promise<PerformanceTier> {
  if (tier !== 'full') return tier;
  const nav = navigator as NavigatorWithHints;
  if (typeof nav.getBattery !== 'function') return tier;
  try {
    const battery = await nav.getBattery();
    if (!battery.charging && battery.level < 0.25) return 'reduced';
  } catch {
    // Battery API unavailable or blocked: keep the detected tier.
  }
  return tier;
}

export const TIER_SETTINGS: Record<
  PerformanceTier,
  { maxDpr: number; resolutionScale: number; quality: number; animate: boolean }
> = {
  full: { maxDpr: 2, resolutionScale: 1, quality: 1, animate: true },
  reduced: { maxDpr: 1, resolutionScale: 0.65, quality: 0, animate: true },
  static: { maxDpr: 1, resolutionScale: 0.75, quality: 0, animate: false },
};

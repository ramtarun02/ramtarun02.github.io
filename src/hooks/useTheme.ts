'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { Theme } from '@/lib/theme';
import {
  applyThemeAttribute,
  getServerSystemScheme,
  getServerTheme,
  getStoredTheme,
  getSystemScheme,
  subscribeToStoredTheme,
  subscribeToSystemScheme,
  writeStoredTheme,
} from '@/lib/theme-store';

/**
 * Theme state with three values, not two: an explicit light/dark choice stamps
 * `data-theme` on <html>; `system` removes it and lets prefers-color-scheme
 * decide. Changes run through a view transition so the switch reads as a
 * moment rather than a flash.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToStoredTheme, getStoredTheme, getServerTheme);
  const systemScheme = useSyncExternalStore(
    subscribeToSystemScheme,
    getSystemScheme,
    getServerSystemScheme,
  );

  const resolved: 'light' | 'dark' = theme === 'system' ? systemScheme : theme;

  const setTheme = useCallback((next: Theme) => {
    const commit = () => {
      applyThemeAttribute(next);
      writeStoredTheme(next);
    };

    // View Transitions is not universally available; the optional call is the
    // feature test. Reduced motion skips it so nothing cross-fades.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion && typeof document.startViewTransition === 'function') {
      document.startViewTransition(commit);
    } else {
      commit();
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setTheme]);

  return { theme, resolved, setTheme, toggle };
}

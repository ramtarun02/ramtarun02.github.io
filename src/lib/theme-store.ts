import { THEME_STORAGE_KEY, isTheme, type Theme } from './theme';

/**
 * Theme lives in two external systems — localStorage and the OS colour-scheme
 * media query — so it is read with useSyncExternalStore rather than mirrored
 * into React state inside an effect. Both snapshots return primitives, which
 * keeps them referentially stable without a cache.
 */

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Notifies subscribers in this tab; the `storage` event only fires in others. */
export function notifyThemeChanged(): void {
  emit();
}

export function subscribeToStoredTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/** The server cannot know the preference, so it renders the signature theme. */
export function getServerTheme(): Theme {
  return 'system';
}

const LIGHT_QUERY = '(prefers-color-scheme: light)';

export function subscribeToSystemScheme(onChange: () => void): () => void {
  const media = window.matchMedia(LIGHT_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function getSystemScheme(): 'light' | 'dark' {
  return window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
}

/** Dark is the signature theme, so it is what the server assumes. */
export function getServerSystemScheme(): 'light' | 'dark' {
  return 'dark';
}

export function writeStoredTheme(theme: Theme): void {
  try {
    if (theme === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing or blocked storage: the theme still applies to this page.
  }
  emit();
}

export function applyThemeAttribute(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
}

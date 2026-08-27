export const THEME_STORAGE_KEY = 'trp-theme';

export type Theme = 'light' | 'dark' | 'system';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Runs before paint to stamp the saved theme on <html>, preventing a
 * flash of the wrong theme. Kept as a string so it can be inlined.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

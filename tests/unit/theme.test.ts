import { describe, expect, it } from 'vitest';
import { isTheme, themeInitScript, THEME_STORAGE_KEY } from '@/lib/theme';

describe('isTheme', () => {
  it('accepts the three valid states', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(true);
  });

  it('rejects anything else, including values a stale localStorage might hold', () => {
    expect(isTheme('auto')).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
    expect(isTheme(1)).toBe(false);
  });
});

describe('themeInitScript', () => {
  it('reads the same key the hook writes', () => {
    expect(themeInitScript).toContain(THEME_STORAGE_KEY);
  });

  it('never stamps data-theme for "system", so prefers-color-scheme still decides', () => {
    expect(themeInitScript).not.toContain("'system'");
  });

  it('is wrapped in try/catch, because blocked storage must not break the page', () => {
    expect(themeInitScript).toContain('try{');
    expect(themeInitScript).toContain('catch');
  });
});

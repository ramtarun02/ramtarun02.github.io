'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/hooks/useTheme';
import { spring } from '@/lib/motion';

/**
 * Two-state toggle over the resolved theme. It reports the theme it will switch
 * *to*, because that is the question a user is answering when they reach for it.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className={`glass u-squircle relative inline-flex h-9 w-16 items-center px-1 ${className}`}
      style={{ borderRadius: 'var(--radius-pill)' }}
      data-theme-toggle
    >
      <motion.span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center rounded-full"
        style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
        animate={{ x: resolved === 'light' ? 28 : 0 }}
        transition={spring.bouncy}
      >
        {resolved === 'dark' ? <MoonIcon /> : <SunIcon />}
      </motion.span>
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

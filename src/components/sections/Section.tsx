'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { revealVariants, revealViewport, staggerVariants } from '@/lib/motion';
import type { SectionCopy } from '@/content/schema';

interface SectionProps {
  id: string;
  copy: SectionCopy;
  children: ReactNode;
  /** Header spans the full width instead of sitting beside the content. */
  wide?: boolean;
}

/**
 * Shared section shell.
 *
 * The header sits in a left column on wide screens and the content takes the
 * rest, which uses the screen instead of stacking everything down a narrow
 * ribbon. Copy comes from content so headings can be edited — and so no
 * heading has to be rewritten when an entry is added.
 */
export function Section({ id, copy, children, wide = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      className="shell scroll-mt-28 py-20 sm:py-28"
      variants={staggerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <div
        className={
          wide ? 'flex flex-col gap-12' : 'grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16'
        }
      >
        <motion.header
          variants={revealVariants}
          className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start"
        >
          <p className="u-label" style={{ color: 'var(--accent)' }}>
            {copy.eyebrow}
          </p>
          <h2 className="u-display" style={{ fontSize: 'var(--text-4xl)' }}>
            {copy.title}
          </h2>
          {copy.lede ? (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}>{copy.lede}</p>
          ) : null}
        </motion.header>

        <motion.div variants={revealVariants}>{children}</motion.div>
      </div>
    </motion.section>
  );
}

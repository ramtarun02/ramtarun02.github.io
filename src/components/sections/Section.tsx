'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { revealVariants, revealViewport, staggerVariants } from '@/lib/motion';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}

/** Shared section shell: consistent rhythm, heading hierarchy and reveal. */
export function Section({ id, eyebrow, title, lede, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
      variants={staggerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <motion.p variants={revealVariants} className="u-label" style={{ color: 'var(--accent)' }}>
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={revealVariants}
        className="mt-4 tracking-tight text-balance"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', lineHeight: 1.05 }}
      >
        {title}
      </motion.h2>
      {lede ? (
        <motion.p
          variants={revealVariants}
          className="u-measure mt-5"
          style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}
        >
          {lede}
        </motion.p>
      ) : null}
      <motion.div variants={revealVariants} className="mt-12">
        {children}
      </motion.div>
    </motion.section>
  );
}

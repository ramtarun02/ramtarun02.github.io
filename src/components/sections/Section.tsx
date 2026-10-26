'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type MotionStyle } from 'motion/react';
import type { SectionCopy } from '@/content/schema';

interface SectionProps {
  id: string;
  copy: SectionCopy;
  children: ReactNode;
  /** Right-aligned header extra (links, counters). */
  headerExtra?: ReactNode;
  wide?: boolean;
}

/** Section shell: eyebrow, big title, lede, then the content — each rising into view. */
export function Section({ id, copy, children, headerExtra, wide = false }: SectionProps) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className={wide ? 'shell-wide' : 'shell'}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 24,
              flexWrap: 'wrap',
              marginBottom: 'clamp(2.25rem, 5vw, 3.5rem)',
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h2 id={`${id}-title`} className="section-title">
                {copy.title}
              </h2>
              {copy.lede ? <p className="section-lede">{copy.lede}</p> : null}
            </div>
            {headerExtra}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Rises and fades in once, when it first enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      {...(className ? { className } : {})}
      {...(style ? { style: style as MotionStyle } : {})}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import type { LatestItem } from '@/content';

/**
 * Latest work, as a strip that tracks the page rather than a carousel that
 * moves on its own.
 *
 * Scroll-linked rather than autoplaying: the reader controls it, nothing moves
 * while they are trying to read, and there are no controls to design. Under
 * reduced motion it becomes an ordinary horizontally scrollable row.
 */
export function LatestStrip({ items }: { items: LatestItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // The row drifts left as the section crosses the viewport. The range is
  // deliberately shallow — this is a parallax, not a hijacked scroll.
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-22%']);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="latest"
      className="relative overflow-hidden py-24 sm:py-28"
      aria-labelledby="latest-heading"
    >
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <p className="u-label" style={{ color: 'var(--accent)' }}>
          Latest
        </p>
        <h2
          id="latest-heading"
          className="mt-4 tracking-tight text-balance"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-4xl)',
            lineHeight: 1.05,
          }}
        >
          Recently published
        </h2>
      </div>

      {reduceMotion ? (
        <div className="u-scroll-x flex gap-5 px-6">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <motion.div className="flex gap-5 px-6" style={{ x }}>
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function Card({ item }: { item: LatestItem }) {
  return (
    <Link
      href={item.href}
      className="block w-[min(78vw,26rem)] shrink-0"
      aria-label={`${item.kind}: ${item.title}`}
    >
      <GlassPanel as="article" flowBody radius="xl" className="flex h-full flex-col p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="u-label px-2.5 py-1"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
              color: 'var(--accent)',
            }}
          >
            {item.kind}
          </span>
          <time className="u-label" style={{ color: 'var(--ink-faint)' }} dateTime={item.date}>
            {new Date(item.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </time>
        </div>

        <h3
          className="mt-5 text-balance"
          style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, lineHeight: 1.15 }}
        >
          {item.title}
        </h3>

        <p className="mt-4 flex-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
          {item.summary}
        </p>

        <p className="mt-6 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
          Read →
        </p>
      </GlassPanel>
    </Link>
  );
}

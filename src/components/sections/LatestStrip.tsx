'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { revealViewport, spring, staggerVariants } from '@/lib/motion';
import type { LatestItem } from '@/content';
import type { SectionCopy } from '@/content/schema';

/**
 * Latest work as a scrollable rail.
 *
 * The animation is an entrance, not a scroll-linked drift. Tying the rail's
 * position to page scroll meant it had already travelled by the time a reader
 * arriving from the hero could see it — the first card was half off-screen
 * before anyone had looked at it. Cards now arrive in place and stay there,
 * and the reader moves the rail themselves.
 */
export function LatestStrip({ items, copy }: { items: LatestItem[]; copy: SectionCopy }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges]);

  const page = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.8, 900), behavior: 'smooth' });
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="latest" className="py-20 sm:py-28" aria-labelledby="latest-heading">
      <div className="shell mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <p className="u-label" style={{ color: 'var(--accent)' }}>
            {copy.eyebrow}
          </p>
          <h2 id="latest-heading" className="u-display" style={{ fontSize: 'var(--text-4xl)' }}>
            {copy.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {copy.lede ? (
            <p className="hidden max-w-sm text-sm sm:block" style={{ color: 'var(--ink-muted)' }}>
              {copy.lede}
            </p>
          ) : null}
          <div className="flex gap-2">
            <RailButton label="Scroll left" disabled={atStart} onClick={() => page(-1)}>
              ←
            </RailButton>
            <RailButton label="Scroll right" disabled={atEnd} onClick={() => page(1)}>
              →
            </RailButton>
          </div>
        </div>
      </div>

      <motion.div
        ref={railRef}
        onScroll={syncEdges}
        className="u-scroll-x latest-rail"
        style={{ paddingInline: 'var(--gutter)' }}
        variants={staggerVariants(0.09, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <div className="flex w-max gap-5 pb-4">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RailButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="glass grid h-11 w-11 place-items-center text-sm transition-opacity disabled:opacity-30"
      style={{ borderRadius: 'var(--radius-pill)' }}
    >
      {children}
    </button>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: spring.standard },
};

function Card({ item }: { item: LatestItem }) {
  return (
    <motion.div variants={cardVariants} className="w-[min(84vw,24rem)] shrink-0">
      <Link href={item.href} className="block h-full" aria-label={`${item.kind}: ${item.title}`}>
        <GlassPanel as="article" interactive radius="xl" className="flex h-full flex-col p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="u-label px-2.5 py-1"
              style={{
                borderRadius: 'var(--radius-pill)',
                background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
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
    </motion.div>
  );
}

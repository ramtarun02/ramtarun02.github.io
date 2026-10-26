'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
import { extractHeadings, readingTime } from '@/lib/markdown/parse';

interface RailProps {
  source: string;
  backHref: string;
  backLabel: string;
  meta?: { label: string; value: string }[];
  tags?: string[];
}

/**
 * Left rail: back link, facts, and a contents list that follows you down the
 * page. A thin progress bar across the top shows how far through you are.
 */
export function DocumentRail({ source, backHref, backLabel, meta = [], tags = [] }: RailProps) {
  const minutes = readingTime(source);
  const headings = extractHeadings(source).filter((h) => h.depth === 2);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-15% 0px -75% 0px' },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [source]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          zIndex: 60,
          scaleX: progress,
          transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, #7dd3fc, #818cf8, #c4b5fd)',
          boxShadow: '0 0 12px rgba(125,211,252,0.7)',
        }}
      />
      <aside className="doc-rail">
        <Link
          href={backHref}
          className="u-label"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          ← {backLabel}
        </Link>

        <dl style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: 0 }}>
          {[...meta, { label: 'Length', value: `${minutes} min read` }].map((entry) => (
            <div key={entry.label}>
              <dt className="u-label" style={{ color: 'var(--ink-faint)' }}>
                {entry.label}
              </dt>
              <dd style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--ink-muted)' }}>
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>

        {tags.length > 0 ? (
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {tags.map((tag) => (
              <li key={tag} className="chip chip--muted">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {headings.length > 1 ? (
          <nav aria-label="Contents" className="doc-toc">
            <p className="u-label" style={{ color: 'var(--ink-faint)', margin: '0 0 10px' }}>
              Contents
            </p>
            {headings.map((h) => (
              <a key={h.id} href={`#${h.id}`} aria-current={active === h.id ? 'true' : undefined}>
                {h.text}
              </a>
            ))}
          </nav>
        ) : null}
      </aside>
    </>
  );
}

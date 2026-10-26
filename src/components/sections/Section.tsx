'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SectionCopy } from '@/content/schema';

interface SectionProps {
  id: string;
  copy: SectionCopy;
  children: ReactNode;
  /** Right-aligned header row (icon buttons etc.) instead of a stacked one. */
  headerExtra?: ReactNode;
}

/** Shared section shell: eyebrow + title + lede, fading up into view on scroll. */
export function Section({ id, copy, children, headerExtra }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal${visible ? ' in' : ''}`}
      style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 24px 90px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 34,
        }}
      >
        <div>
          <span className="tag tag-accent">{copy.eyebrow}</span>
          <h2 className="u-display" style={{ margin: '18px 0 10px', fontSize: 36 }}>
            {copy.title}
          </h2>
          {copy.lede ? (
            <p style={{ color: 'var(--ink-muted)', fontSize: 15, margin: 0, maxWidth: '60ch' }}>
              {copy.lede}
            </p>
          ) : null}
        </div>
        {headerExtra}
      </div>
      {children}
    </section>
  );
}

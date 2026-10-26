'use client';

import { useRef, type ElementType, type ReactNode } from 'react';

/**
 * A glass card that leans toward the pointer and catches a highlight where the
 * pointer is — the iOS "parallax icon" feel, kept to a few degrees so it reads
 * as material rather than as a gimmick. Touch and reduced-motion users get a
 * flat card.
 */
export function TiltCard({
  children,
  as: Tag = 'div',
  className = '',
  style,
  max = 5,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  max?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.classList.add('is-active');
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('is-active');
  };

  return (
    <Tag
      ref={ref}
      className={`glass tilt panel-interactive ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="tilt-sheen" aria-hidden="true" />
      {children}
    </Tag>
  );
}

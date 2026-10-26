'use client';

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { Section } from './Section';
import type { Experience as ExperienceItem, SectionCopy } from '@/content/schema';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1] ?? ''} ${y}`;
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

/**
 * The flight path: a vertical route that draws itself as you scroll, with a
 * small aircraft riding the leading edge. Stops alternate either side of the
 * route on wide screens and stack on one side on phones. Each stop opens to
 * show the detail.
 */
export function Experience({ copy, items }: { copy: SectionCopy; items: ExperienceItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const planeTop = useTransform(progress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  return (
    <Section id="experience" copy={copy}>
      <div ref={ref} className="tl">
        {/* Route */}
        <div className="tl-route" aria-hidden="true">
          <div className="tl-route-track" />
          <motion.div
            className="tl-route-fill"
            style={{ scaleY: reduce ? 1 : progress, transformOrigin: 'top' }}
          />
          {!reduce ? (
            <motion.div className="tl-plane" style={{ top: planeTop }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
                  transform="rotate(180 12 12)"
                />
              </svg>
            </motion.div>
          ) : null}
        </div>

        <ol className="tl-list">
          {items.map((item, i) => (
            <Stop key={item.id} item={item} side={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </ol>
      </div>

      <style>{`
        .tl { position: relative; overflow-x: clip; padding-block: 4px; }
        .tl-route { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; transform: translateX(-50%); }
        .tl-route-track { position: absolute; inset: 0; border-radius: 2px;
          background: repeating-linear-gradient(180deg, rgba(180,205,255,0.22) 0 6px, transparent 6px 14px); }
        .tl-route-fill { position: absolute; inset: 0; border-radius: 2px;
          background: linear-gradient(180deg, #7dd3fc, #818cf8 60%, #a78bfa);
          box-shadow: 0 0 14px rgba(125,211,252,0.6); }
        .tl-plane { position: absolute; left: 50%; transform: translate(-50%, -50%); color: #e0f2fe;
          filter: drop-shadow(0 0 10px rgba(125,211,252,0.9)); }
        .tl-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 28px; }
        .tl-stop { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .tl-stop[data-side='right'] .tl-card-wrap { grid-column: 2; }
        .tl-node { position: absolute; left: 50%; top: 30px; width: 14px; height: 14px; border-radius: 50%;
          transform: translate(-50%, 0); background: var(--night-900); border: 2px solid #7dd3fc;
          box-shadow: 0 0 0 5px rgba(125,211,252,0.12); z-index: 1; }
        .tl-date { position: absolute; top: 24px; font-family: var(--font-mono); font-size: 0.78rem;
          color: var(--ink-faint); letter-spacing: 0.04em; white-space: nowrap; }
        .tl-stop[data-side='left'] .tl-date { left: calc(50% + 32px); }
        .tl-stop[data-side='right'] .tl-date { right: calc(50% + 32px); }
        .tl-card { width: 100%; text-align: left; cursor: pointer; border-radius: 24px; padding: 22px 24px; color: inherit; font: inherit; }
        @media (max-width: 860px) {
          .tl-route { left: 11px; transform: none; }
          .tl-plane { left: 1px; }
          .tl-stop { grid-template-columns: 1fr; gap: 0; padding-left: 40px; }
          .tl-stop[data-side='right'] .tl-card-wrap { grid-column: 1; }
          .tl-node { left: 12px; top: 26px; }
          .tl-date { display: none; }
        }
      `}</style>
    </Section>
  );
}

function Stop({ item, side }: { item: ExperienceItem; side: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const isEducation = item.kind === 'education';
  const panelId = `xp-${item.id}`;

  return (
    <li className="tl-stop" data-side={side}>
      <span className="tl-node" aria-hidden="true" />
      <span className="tl-date" aria-hidden="true">
        {formatRange(item.start, item.end)}
      </span>
      <motion.div
        className="tl-card-wrap"
        initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <button
          type="button"
          className="glass panel-interactive tl-card"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className={isEducation ? 'chip chip--violet' : 'chip'}>
              {isEducation ? 'Education' : item.kind === 'internship' ? 'Internship' : 'Role'}
            </span>
            <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
              {formatRange(item.start, item.end)}
            </span>
          </div>
          <h3
            style={{
              margin: '14px 0 2px',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {item.role}
          </h3>
          <p style={{ margin: 0, color: 'var(--accent)', fontWeight: 500, fontSize: 15 }}>
            {item.organisation}
            <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}> · {item.location}</span>
          </p>
          <p
            style={{
              margin: '12px 0 0',
              color: 'var(--ink-muted)',
              lineHeight: 1.65,
              fontSize: 15.5,
            }}
          >
            {item.story ?? item.summary}
          </p>

          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                id={panelId}
                key="detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <ul
                  style={{
                    margin: '16px 0 0',
                    padding: 0,
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                  }}
                >
                  {item.highlights.map((h) => (
                    <li
                      key={h}
                      style={{
                        display: 'flex',
                        gap: 10,
                        fontSize: 14.5,
                        lineHeight: 1.55,
                        color: '#cfdaf0',
                      }}
                    >
                      <span aria-hidden="true" style={{ color: 'var(--accent)', flex: 'none' }}>
                        ›
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                {item.tags.length ? (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
                    {item.tags.map((t) => (
                      <span key={t} className="chip chip--muted">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 14,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ice-200)',
            }}
          >
            {open ? 'Show less' : 'Show details'}
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              animate={{ rotate: open ? 180 : 0 }}
              aria-hidden="true"
            >
              <path
                d="M2.5 4.5L6 8l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </motion.svg>
          </span>
        </button>
      </motion.div>
    </li>
  );
}

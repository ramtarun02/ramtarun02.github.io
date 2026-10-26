'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Reveal, Section } from './Section';
import type { Publication, SectionCopy } from '@/content/schema';

export function Publications({ items, copy }: { items: Publication[]; copy: SectionCopy }) {
  return (
    <Section id="papers" copy={copy}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((pub, i) => (
          <Reveal key={pub.id} delay={i * 0.06}>
            <PaperCard pub={pub} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PaperCard({ pub }: { pub: Publication }) {
  const [open, setOpen] = useState(false);
  const firstAuthor = pub.selfIndex === 0;
  const id = `abs-${pub.id}`;

  return (
    <article
      className="glass panel-interactive paper"
      style={{ borderRadius: 26, padding: 'clamp(20px, 3vw, 28px)' }}
    >
      <div className="paper-grid">
        <div className="paper-year" aria-hidden="true">
          <span className="u-gradient-text">{pub.year}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span className="chip" style={{ whiteSpace: 'normal' }}>
              {pub.venue}
            </span>
            <span className="chip chip--muted">Conference paper</span>
            {firstAuthor ? <span className="chip chip--good">First author</span> : null}
            {pub.status ? <span className="chip chip--violet">{pub.status}</span> : null}
          </div>
          <h3
            style={{
              margin: '14px 0 8px',
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              textWrap: 'balance',
            }}
          >
            {pub.title}
          </h3>
          <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-faint)' }}>
            {pub.authors.map((a, i) => (
              <span key={a}>
                {i > 0 ? ', ' : ''}
                <span
                  style={i === pub.selfIndex ? { color: 'var(--ink)', fontWeight: 700 } : undefined}
                >
                  {a}
                </span>
              </span>
            ))}
            <span className="sr-only"> ({pub.year})</span>
          </p>

          <AnimatePresence initial={false}>
            {open && pub.abstract ? (
              <motion.p
                id={id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  overflow: 'hidden',
                  margin: 0,
                  color: 'var(--ink-muted)',
                  lineHeight: 1.7,
                  maxWidth: '75ch',
                }}
              >
                <span style={{ display: 'block', paddingTop: 14 }}>{pub.abstract}</span>
              </motion.p>
            ) : null}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            {pub.abstract ? (
              <button
                type="button"
                className="btn btn-ghost"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen((v) => !v)}
                style={{ minHeight: 38, paddingInline: 14 }}
              >
                {open ? 'Hide summary' : 'Read summary'}
              </button>
            ) : null}
            {pub.href ? (
              <a
                href={pub.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-glass"
                style={{ minHeight: 38 }}
              >
                {pub.doi ? `DOI ${pub.doi}` : 'View paper'} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <style>{`
        .paper-grid { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 20px; }
        .paper-year { font-size: 2.6rem; font-weight: 800; letter-spacing: -0.06em; line-height: 1; padding-top: 2px; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        @media (max-width: 640px) {
          .paper-grid { grid-template-columns: 1fr; gap: 6px; }
          .paper-year { font-size: 1.6rem; }
        }
      `}</style>
    </article>
  );
}

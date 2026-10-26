'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import sizes from './data/figure-sizes.json';

const SIZES = sizes as unknown as Record<string, [number, number]>;

/**
 * A report figure on a light card (the plots are drawn on white), which opens
 * full-screen on tap so contour detail is actually readable on a phone.
 */
export function Figure({ src, caption }: { src: string; caption: string }) {
  const [open, setOpen] = useState(false);
  const [w, h] = SIZES[src] ?? [1800, 900];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <figure style={{ margin: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge figure: ${caption}`}
        className="glass panel-interactive"
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          borderRadius: 20,
          cursor: 'zoom-in',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
        }}
      >
        <span
          style={{ display: 'block', borderRadius: 14, overflow: 'hidden', background: '#fff' }}
        >
          <Image
            src={src}
            alt={caption}
            width={w}
            height={h}
            sizes="(max-width: 900px) 100vw, 860px"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </span>
      </button>
      <figcaption
        style={{
          marginTop: 12,
          fontSize: 14,
          lineHeight: 1.55,
          color: 'var(--ink-muted)',
          maxWidth: 'var(--measure)',
        }}
      >
        {caption}
      </figcaption>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 80,
              display: 'grid',
              placeItems: 'center',
              padding: 'clamp(12px, 3vw, 40px)',
              background: 'rgba(2,5,12,0.88)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              cursor: 'zoom-out',
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                width: 'min(100%, 1600px)',
                maxHeight: '100%',
                overflow: 'auto',
                borderRadius: 16,
                background: '#fff',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={caption}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </motion.div>
            <button
              type="button"
              className="btn btn-glass btn-icon"
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', top: 16, right: 16 }}
            >
              ✕
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </figure>
  );
}

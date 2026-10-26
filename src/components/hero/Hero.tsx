'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Profile } from '@/content/schema';

/**
 * Centred greeting over the softly blurred A380 sunset (the photo itself lives
 * in <SkyBackdrop>, fixed behind the whole page). Nothing here is tied to the
 * scroll position: entrance animations run once, then the hero is static, so
 * phones scroll it without any jitter.
 */
export function Hero({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section
      id="top"
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '110px var(--gutter) 120px',
      }}
    >
      {/* Soft vignette so the centred text always has contrast, wherever the sky is bright. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'radial-gradient(60% 45% at 50% 46%, rgba(7,12,26,0.5), rgba(7,12,26,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.p
        {...rise(0.1)}
        style={{
          margin: 0,
          fontSize: 'clamp(1.25rem, 1rem + 1vw, 1.75rem)',
          fontWeight: 800,
          color: 'var(--ice-100)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        Hi there{' '}
        <span className="wave" aria-hidden="true">
          👋
        </span>
      </motion.p>

      <motion.h1
        {...rise(0.2)}
        style={{
          margin: '6px 0 0',
          fontWeight: 900,
          fontSize: 'clamp(3.6rem, 1.6rem + 9vw, 9rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          color: '#fff',
          textShadow: '0 6px 40px rgba(0,0,0,0.35)',
        }}
      >
        I&rsquo;m <span className="u-gradient-text">{profile.name.split(' ')[0]}.</span>
      </motion.h1>

      <motion.p
        {...rise(0.32)}
        style={{
          margin: '22px 0 0',
          maxWidth: '30ch',
          fontSize: 'clamp(1.15rem, 1rem + 0.7vw, 1.55rem)',
          fontWeight: 700,
          lineHeight: 1.4,
          color: '#eef4ff',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}
      >
        Aerospace engineer. I write CFD solvers, then find out where they break.
      </motion.p>

      <motion.div
        {...rise(0.44)}
        style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        <a
          href="#case-study"
          className="btn btn-primary"
          style={{ minHeight: 50, padding: '12px 28px' }}
        >
          See my work
        </a>
        <a
          href="#contact"
          className="btn btn-glass"
          style={{ minHeight: 50, padding: '12px 24px' }}
        >
          Say hello
        </a>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="hero-scroll"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 28,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(235,243,255,0.75)',
          fontSize: 13,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            width: 24,
            height: 38,
            borderRadius: 14,
            border: '1.5px solid rgba(255,255,255,0.45)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 7,
          }}
        >
          <span
            style={{
              width: 3,
              height: 8,
              borderRadius: 2,
              background: '#fff',
              animation: 'float-y 1.8s ease-in-out infinite',
            }}
          />
        </span>
      </a>
      <style>{`
        .wave { display: inline-block; transform-origin: 70% 80%; animation: wave 2.4s ease-in-out 1s 2; }
        @keyframes wave { 0%,60%,100% { transform: rotate(0) } 10%,30% { transform: rotate(16deg) } 20% { transform: rotate(-8deg) } 40% { transform: rotate(-4deg) } 50% { transform: rotate(10deg) } }
        @media (max-height: 640px) { .hero-scroll { display: none !important; } }
      `}</style>
    </section>
  );
}

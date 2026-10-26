'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { Profile } from '@/content/schema';

/**
 * Full-bleed A380 at sunset. As the page scrolls the photo drifts slower than
 * the text and the sky deepens into the blue-hour navy the rest of the site is
 * painted in, so the hero hands over to the page instead of ending at a line.
 */
export function Hero({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, reduce ? 1.04 : 1.14]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const nightfall = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  const facts = [
    profile.location.split(',')[0],
    'MSc by Research · Cranfield',
    'CFD · solver development',
  ];

  return (
    <section
      id="top"
      ref={ref}
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, y: imageY, scale: imageScale, zIndex: -2 }}
      >
        <Image
          src="/assets/hero-a380-sunset.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 46%',
            filter: 'saturate(1.12) contrast(1.05) brightness(1.02)',
          }}
        />
      </motion.div>

      {/* Sky grading: cool the top, keep the horizon warm, fall into night at the bottom. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: [
            'linear-gradient(180deg, rgba(7,12,26,0.6) 0%, rgba(7,12,26,0.1) 24%, rgba(7,12,26,0) 45%)',
            'linear-gradient(90deg, rgba(7,12,26,0.7) 0%, rgba(7,12,26,0.3) 36%, rgba(7,12,26,0) 58%)',
            'linear-gradient(0deg, var(--night-900) 0%, rgba(7,12,26,0.7) 7%, rgba(7,12,26,0) 24%)',
            'radial-gradient(120% 60% at 50% 0%, rgba(56,120,220,0.25), transparent 60%)',
            'radial-gradient(55% 45% at 22% 62%, rgba(7,12,26,0.5), transparent 75%)',
          ].join(','),
        }}
      />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'var(--night-900)',
          opacity: nightfall,
        }}
      />

      <motion.div
        className="shell-wide"
        style={{ y: textY, opacity: textOpacity, paddingBottom: 'clamp(4.5rem, 11vh, 8rem)' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="eyebrow"
          style={{ color: 'var(--ice-200)' }}
        >
          Aerospace engineer · CFD
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.25, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="u-display"
          style={{
            fontSize: 'var(--text-6xl)',
            margin: '18px 0 0',
            maxWidth: '11ch',
            color: '#fff',
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            textShadow: '0 4px 40px rgba(0,0,0,0.35)',
          }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            margin: '24px 0 0',
            maxWidth: '44ch',
            fontSize: 'var(--text-xl)',
            lineHeight: 1.45,
            color: 'rgba(240,246,255,0.92)',
            textShadow: '0 1px 18px rgba(0,0,0,0.5)',
            letterSpacing: '-0.01em',
          }}
        >
          I can&rsquo;t watch an A380 take off without running the lift numbers in my head — old
          habit, still haven&rsquo;t found the off switch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}
        >
          <a
            href="#case-study"
            className="btn btn-primary"
            style={{ minHeight: 50, padding: '12px 26px' }}
          >
            See the work
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M7 2v10M2.5 7.5L7 12l4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="btn btn-glass"
            style={{ minHeight: 50, padding: '12px 26px' }}
          >
            Get in touch
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 1 }}
          aria-label="At a glance"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            listStyle: 'none',
            padding: 0,
            margin: '30px 0 0',
          }}
        >
          {facts.map((fact) => (
            <li
              key={fact}
              className="glass"
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 13,
                color: 'rgba(235,243,255,0.9)',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              {fact}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 22,
          translateX: '-50%',
          width: 26,
          height: 42,
          borderRadius: 14,
          border: '1.5px solid rgba(255,255,255,0.4)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 8,
        }}
        className="hero-scroll"
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
      </motion.a>
      <style>{`@media (max-width: 640px){ .hero-scroll{ display:none !important; } }`}</style>
    </section>
  );
}

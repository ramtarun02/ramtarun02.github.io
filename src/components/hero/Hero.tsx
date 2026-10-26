import Image from 'next/image';
import type { Profile } from '@/content/schema';

/** Full-bleed sunset hero with a warm gradient scrim, matching the approved design. */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '94vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/assets/hero-a380-sunset.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 58%',
            filter: 'saturate(0.6) contrast(0.92) brightness(1.06) sepia(0.15)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(100deg, color-mix(in srgb, var(--color-accent-900) 85%, black) 0%, color-mix(in srgb, var(--color-accent-900) 55%, transparent) 36%, color-mix(in srgb, var(--color-bg) 15%, transparent) 66%, transparent 88%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 260,
            background: 'linear-gradient(0deg, var(--color-bg) 0%, transparent 100%)',
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 640,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0 24px 60px clamp(24px, 6vw, 64px)',
        }}
      >
        <span
          className="tag"
          style={{
            fontSize: 12,
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.6)',
          }}
        >
          Aerospace engineering · CFD &amp; solver development
        </span>
        <h1
          className="u-display"
          style={{
            fontSize: 'clamp(2.8rem, 3vw + 2.2rem, 5rem)',
            margin: '22px 0 16px',
            color: '#fff',
            textShadow: '0 2px 28px rgba(0,0,0,0.4)',
          }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.94)',
            maxWidth: '46ch',
            margin: '0 0 30px',
            textShadow: '0 1px 14px rgba(0,0,0,0.45)',
          }}
        >
          I can&rsquo;t watch an A380 take off without running the lift numbers in my head — old
          habit, still haven&rsquo;t found the off switch.
        </p>
        <a
          href="#projects"
          className="btn"
          style={{
            padding: '14px 30px',
            fontSize: 15,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--accent-fill)',
            color: 'var(--accent-contrast)',
          }}
        >
          View work
        </a>
      </div>
    </section>
  );
}

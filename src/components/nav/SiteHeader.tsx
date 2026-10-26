'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Publications' },
  { href: '#case-study', label: 'Case study' },
] as const;

/**
 * Floating glass pill nav. Past a small scroll threshold the link row
 * collapses and the avatar shrinks, leaving a compact brand mark plus the
 * Contact button — mirrors the approved design's collapsing header exactly.
 */
export function SiteHeader({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 16,
          left: 0,
          right: 0,
          zIndex: 40,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 22px',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '8px 10px 8px 8px',
            borderRadius: 'var(--radius-pill)',
            pointerEvents: 'auto',
            transition: 'padding 300ms ease',
          }}
        >
          <a href="#top" style={{ flex: '0 0 auto', lineHeight: 0 }} aria-label="Back to top">
            <Image
              src="/assets/profile-pic.png"
              alt={name}
              width={44}
              height={44}
              priority
              style={{
                width: scrolled ? 36 : 44,
                height: scrolled ? 36 : 44,
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid color-mix(in srgb, #fff 55%, transparent)',
                display: 'block',
                transition: 'width 300ms ease, height 300ms ease',
              }}
            />
          </a>
          <nav
            aria-label="Sections"
            style={{
              display: 'flex',
              gap: 20,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              opacity: scrolled ? 0 : 1,
              maxWidth: scrolled ? 0 : 620,
              transition: 'opacity 320ms ease, max-width 380ms ease',
            }}
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ color: 'var(--ink-muted)', fontSize: 14, textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="btn"
            style={{
              background: 'var(--accent-fill)',
              color: 'var(--accent-contrast)',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            Contact
          </a>
        </div>
      </header>

      <a
        href="#top"
        aria-label="Back to top"
        className="glass"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 45,
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: 18,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'opacity 320ms ease',
        }}
      >
        ↑
      </a>
    </>
  );
}

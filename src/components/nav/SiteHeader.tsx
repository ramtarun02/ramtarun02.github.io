'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'case-study', label: 'Case study' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'papers', label: 'Papers' },
] as const;

/**
 * Floating glass pill.
 *
 * It gets out of the way while you read: scrolling down slides it off the top,
 * any scroll up brings it straight back. On the home page the pill tracks the
 * section in view. On phones the links collapse into a sheet.
 */
export function SiteHeader({ name, onHome = true }: { name: string; onHome?: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        setScrolled(y > 40);
        if (y < 120) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome || !('IntersectionObserver' in window)) return;
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const showPill = !hidden || menuOpen;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: showPill ? 0 : -110, opacity: showPill ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        style={{
          position: 'fixed',
          top: 14,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 14px',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: 'min(100%, 760px)',
            padding: 6,
            borderRadius: 'var(--radius-pill)',
            background: scrolled
              ? 'linear-gradient(160deg, rgba(22,34,60,0.72), rgba(10,18,34,0.62))'
              : 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
            transition: 'background 0.4s ease',
          }}
        >
          <Link
            href={onHome ? '#top' : '/'}
            aria-label={`${name} — home`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              padding: '0 10px 0 0',
              flex: 'none',
            }}
          >
            <Image
              src="/assets/profile-pic.png"
              alt=""
              width={40}
              height={40}
              priority
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(255,255,255,0.35)',
              }}
            />
            <span style={{ fontWeight: 650, fontSize: 15, letterSpacing: '-0.02em' }}>
              {name.split(' ')[0]}
            </span>
          </Link>

          <nav aria-label="Sections" className="nav-links" style={{ flex: 1 }}>
            <ul
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id} style={{ position: 'relative' }}>
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.12)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                        }}
                      />
                    ) : null}
                    <a
                      href={href(link.id)}
                      aria-current={isActive ? 'true' : undefined}
                      style={{
                        position: 'relative',
                        display: 'block',
                        padding: '9px 13px',
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a href={href('contact')} className="btn btn-primary nav-cta" style={{ minHeight: 38 }}>
            Get in touch
          </a>

          <button
            type="button"
            className="btn btn-glass btn-icon nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ minHeight: 40, width: 40, marginLeft: 'auto' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <motion.path
                d="M2 5h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={menuOpen ? { d: 'M3.5 3.5l11 11' } : { d: 'M2 5h14' }}
              />
              <motion.path
                d="M2 13h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={menuOpen ? { d: 'M3.5 14.5l11-11' } : { d: 'M2 13h14' }}
              />
            </svg>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 48,
                background: 'rgba(2,5,12,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            />
            <motion.nav
              key="sheet"
              id="mobile-menu"
              aria-label="Sections"
              className="glass glass--strong"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              style={{
                position: 'fixed',
                top: 74,
                left: 14,
                right: 14,
                zIndex: 49,
                borderRadius: 26,
                padding: 10,
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {[...LINKS, { id: 'contact', label: 'Get in touch' }].map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <a
                      href={href(link.id)}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 16px',
                        borderRadius: 16,
                        fontSize: 18,
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        textDecoration: 'none',
                        color: active === link.id ? 'var(--accent)' : 'var(--ink)',
                      }}
                    >
                      {link.label}
                      <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
                        ›
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      <motion.a
        href={onHome ? '#top' : '#main'}
        aria-label="Back to top"
        className="glass"
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0.8 }}
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          zIndex: 45,
          width: 46,
          height: 46,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--ink)',
          textDecoration: 'none',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 13V3M3.5 7.5L8 3l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.a>

      <style>{`
        .nav-burger { display: none; }
        @media (max-width: 820px) {
          .nav-links, .nav-cta { display: none !important; }
          .nav-burger { display: inline-flex; }
        }
      `}</style>
    </>
  );
}

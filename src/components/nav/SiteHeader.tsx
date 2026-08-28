'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { href: '/work', label: 'Case studies' },
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#projects', label: 'Code' },
  { href: '/#research', label: 'Research' },
  { href: '/writing', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
] as const;

/** Transparent over the hero, glass once the page scrolls under it. */
export function SiteHeader({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled ? 'glass glass--flat' : ''
      }`}
      style={scrolled ? { borderRadius: 0, borderWidth: '0 0 1px 0' } : undefined}
    >
      <div className="shell flex items-center gap-6 px-6 py-3">
        <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-tight">
          {name}
        </Link>
        <nav aria-label="Sections" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-7">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto md:ml-0"></div>
      </div>
    </header>
  );
}

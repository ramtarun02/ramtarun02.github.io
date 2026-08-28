'use client';

import { motion } from 'motion/react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { revealVariants, spring, staggerVariants } from '@/lib/motion';
import type { Profile } from '@/content/schema';

/**
 * The hero no longer owns a flow field — the field spans the page and lives in
 * the layout, so the wing rises out of frame as the reader descends rather than
 * being clipped at the end of a section.
 */
export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center">
      <div className="shell w-full py-28 sm:py-24">
        <motion.div
          className="w-full max-w-3xl"
          variants={staggerVariants(0.08, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <GlassPanel variant="strong" radius="xl" interactive className="p-7 sm:p-10 md:p-12">
            <motion.p
              variants={revealVariants}
              className="u-label inline-flex items-center gap-2.5"
              style={{ color: 'var(--accent)' }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              {profile.availability}
            </motion.p>

            <motion.h1
              variants={revealVariants}
              className="mt-5 tracking-tight text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-6xl)',
                lineHeight: 0.98,
              }}
            >
              {profile.name}
            </motion.h1>

            <motion.p
              variants={revealVariants}
              className="mt-4"
              style={{ fontSize: 'var(--text-xl)', color: 'var(--ink-muted)' }}
            >
              {profile.headline}
            </motion.p>

            <motion.p
              variants={revealVariants}
              className="u-measure mt-6"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {profile.summaryShort}
            </motion.p>

            <motion.div variants={revealVariants} className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href="#work">See the work</PrimaryLink>
              {profile.links.map((link) => (
                <SecondaryLink key={link.href} href={link.href}>
                  {link.label}
                </SecondaryLink>
              ))}
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      className="inline-flex min-h-11 items-center px-6 py-3 text-sm font-semibold"
      style={{
        borderRadius: 'var(--radius-pill)',
        background: 'var(--accent)',
        color: 'var(--accent-contrast)',
      }}
    >
      {children}
    </motion.a>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      className="glass inline-flex min-h-11 items-center px-6 py-3 text-sm font-medium"
      style={{ borderRadius: 'var(--radius-pill)' }}
    >
      {children}
    </motion.a>
  );
}

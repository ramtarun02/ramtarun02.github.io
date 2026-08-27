'use client';

import { motion } from 'motion/react';
import { FlowField } from './FlowField';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { revealVariants, spring, staggerVariants } from '@/lib/motion';
import type { Profile } from '@/content/schema';

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <FlowField />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-24">
        <motion.div
          className="w-full max-w-2xl"
          variants={staggerVariants(0.08, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <GlassPanel variant="strong" radius="xl" className="p-8 sm:p-12">
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

            <motion.div variants={revealVariants} className="mt-9 flex flex-wrap gap-3">
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

      <ScrollCue />
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
      className="inline-flex items-center px-6 py-3 text-sm font-semibold"
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
      className="glass inline-flex items-center px-6 py-3 text-sm font-medium"
      style={{ borderRadius: 'var(--radius-pill)' }}
    >
      {children}
    </motion.a>
  );
}

function ScrollCue() {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, 6, 10, 14] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span
        className="block h-8 w-[1px]"
        style={{ background: 'linear-gradient(var(--accent), transparent)' }}
      />
    </motion.div>
  );
}

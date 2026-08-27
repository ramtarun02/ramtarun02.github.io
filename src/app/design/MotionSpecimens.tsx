'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { spring } from '@/lib/motion';

const SPECIMENS = [
  ['snappy', spring.snappy, 'Buttons, toggles, chips'],
  ['standard', spring.standard, 'Panels and cards — the default'],
  ['weighty', spring.weighty, 'Large surfaces, section changes'],
  ['bouncy', spring.bouncy, 'The theme toggle, and little else'],
] as const;

export function MotionSpecimens() {
  const [fired, setFired] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setFired((n) => n + 1)}
        className="glass u-squircle self-start px-5 py-2.5 text-sm font-medium"
        style={{ borderRadius: 'var(--radius-pill)' }}
      >
        Play all springs
      </button>

      {SPECIMENS.map(([name, transition, use]) => (
        <GlassPanel key={name} variant="quiet" radius="md" className="flex items-center gap-5 p-4">
          <code
            className="w-20 flex-none font-[family-name:var(--font-mono)] text-xs"
            style={{ color: 'var(--accent)' }}
          >
            {name}
          </code>
          {/* `left` rather than `x`: a percentage transform resolves against the
              ball, not the track, so the specimen would barely move. */}
          <div className="relative h-8 flex-1" style={{ minWidth: 0 }}>
            <motion.span
              key={`${name}-${fired}`}
              className="absolute top-1 h-6 w-6 rounded-full"
              style={{ background: 'var(--accent)' }}
              initial={{ left: '0%' }}
              animate={{ left: 'calc(100% - 1.5rem)' }}
              transition={transition}
            />
          </div>
          <span className="hidden flex-none text-xs sm:block" style={{ color: 'var(--ink-faint)' }}>
            {use}
          </span>
        </GlassPanel>
      ))}
    </div>
  );
}

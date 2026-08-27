import type { ReactNode } from 'react';

/**
 * Varied content to sit glass on top of. A material cannot be judged over a
 * flat ground — blur, saturation and refraction only read against something
 * with structure and colour behind them.
 */
export function SpecimenBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="u-squircle relative overflow-hidden p-6" style={{ isolation: 'isolate' }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(38% 60% at 12% 30%, var(--color-vel-2) 0%, transparent 70%),
            radial-gradient(34% 55% at 55% 78%, var(--color-vel-3) 0%, transparent 72%),
            radial-gradient(30% 50% at 88% 22%, var(--color-vel-6) 0%, transparent 70%),
            linear-gradient(140deg, var(--color-vel-0), var(--color-vel-1))
          `,
          opacity: 0.85,
        }}
      />
      {/* Fine rule grid: the detail that makes refraction visible at the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgb(255 255 255 / 0.16) 0 1px, transparent 1px 22px),
            repeating-linear-gradient(90deg, rgb(255 255 255 / 0.16) 0 1px, transparent 1px 22px)
          `,
        }}
      />
      {children}
    </div>
  );
}

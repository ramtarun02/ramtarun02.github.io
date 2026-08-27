import type { Transition, Variants } from 'motion/react';

/**
 * Motion tokens.
 *
 * SwiftUI's feel comes from springs described by physical intent — how much it
 * settles, how long it takes — rather than by cubic-bezier guesswork. Motion's
 * `visualDuration`/`bounce` pair maps onto the same mental model, so these are
 * named for what they are used for, not for their numbers.
 */

export const spring = {
  /** Buttons, toggles, chips. Crisp, barely any overshoot. */
  snappy: { type: 'spring', visualDuration: 0.22, bounce: 0.16 },
  /** Panels and cards entering or moving. The house default. */
  standard: { type: 'spring', visualDuration: 0.42, bounce: 0.22 },
  /** Large surfaces, section transitions. Weighty, settles slowly. */
  weighty: { type: 'spring', visualDuration: 0.72, bounce: 0.18 },
  /** Playful — the theme toggle, the one place overshoot is the point. */
  bouncy: { type: 'spring', visualDuration: 0.5, bounce: 0.42 },
} as const satisfies Record<string, Transition>;

/** Non-spring easings, for opacity and colour where a spring reads as a wobble. */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  instant: 0.12,
  quick: 0.2,
  base: 0.35,
  slow: 0.6,
} as const;

/** Distance a surface travels when it rises into place, in pixels. */
export const RISE_DISTANCE = 16;

/** Scroll reveal: surfaces rise and fade as they enter. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: RISE_DISTANCE },
  visible: { opacity: 1, y: 0, transition: spring.standard },
};

/**
 * Stagger container. `delayChildren` gives the group a beat before the first
 * child moves, which reads as deliberate rather than mechanical.
 */
export function staggerVariants(stagger = 0.06, delay = 0.04): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/** Viewport config shared by every scroll reveal, so timing is consistent. */
export const revealViewport = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' } as const;

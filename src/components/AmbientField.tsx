/**
 * A quiet field behind the content sections.
 *
 * Not the flow field — running the solver the length of the page would be
 * wasteful and visually noisy. This is a static gradient in the same velocity
 * ramp, at low opacity, purely so the glass panels have something to refract
 * and blur. It drifts very slowly, and not at all under reduced motion.
 */
export function AmbientField() {
  return <div aria-hidden="true" className="ambient-field" />;
}

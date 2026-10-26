/**
 * The page's backdrop: the A380 sunset, pre-blurred at build time (a CSS blur
 * filter would be re-rasterised on every scroll frame on a phone), pinned
 * behind everything. It is sized to the *large* viewport (lvh) so iOS/Android
 * toolbars collapsing never resize it — that resize is what makes fixed
 * backgrounds jump on mobile.
 */
export function SkyBackdrop() {
  return (
    <div aria-hidden="true" className="sky">
      <div className="sky-img" />
      <div className="sky-tint" />
      <style>{`
        .sky { position: fixed; left: 0; right: 0; top: 0; height: 100lvh; z-index: -10; overflow: hidden;
          pointer-events: none; background: var(--night-900); }
        .sky-img { position: absolute; inset: -2%; background: url('/assets/hero-a380-blur.jpg') center 46% / cover no-repeat; }
        .sky-tint { position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(7,12,26,0.55) 0%, rgba(7,12,26,0.15) 30%, rgba(7,12,26,0.2) 62%, rgba(7,12,26,0.8) 100%),
            radial-gradient(120% 70% at 50% 0%, rgba(56,120,220,0.18), transparent 60%); }
        @media (max-width: 820px) {
          .sky-img { background-image: url('/assets/hero-a380-blur-sm.jpg'); background-position: 50% 50%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Everything below the hero sits on this: it fades from clear to night over
 * the first screen, so the sunset glows through the top of the page and the
 * rest reads on a calm, solid navy.
 */
export function NightFade({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        background:
          'radial-gradient(900px 700px at 0% 160vh, rgba(56,189,248,0.08), transparent 60%), radial-gradient(1000px 700px at 100% 280vh, rgba(129,140,248,0.08), transparent 60%), linear-gradient(180deg, rgba(7,12,26,0) 0, rgba(7,12,26,0.82) 55vh, var(--night-900) 110vh)',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
}

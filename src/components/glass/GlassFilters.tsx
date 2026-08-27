'use client';

import { useEffect } from 'react';

/**
 * The SVG filter that gives glass panels their refraction, plus the runtime
 * feature detection that switches it on.
 *
 * `backdrop-filter` accepts a url() filter reference only in Chromium. Safari
 * supports backdrop-filter but not filter references; Firefox supports neither
 * reliably. @supports cannot distinguish those cases, so we test at runtime and
 * add a class to <html>. Everything degrades to blur + saturate, which is the
 * honest fallback: same layout, same contrast, slightly less character.
 */
export function GlassFilters() {
  useEffect(() => {
    const supportsFilterRef =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      (CSS.supports('backdrop-filter', 'url(#glass-refraction)') ||
        CSS.supports('-webkit-backdrop-filter', 'url(#glass-refraction)'));

    if (supportsFilterRef) {
      document.documentElement.classList.add('supports-refraction');
    }
  }, []);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="glass-refraction"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Low-frequency noise, softened, then used to bend the backdrop.
              Amplitude is deliberately small — glass distorts, it does not smear. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.013"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={8}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

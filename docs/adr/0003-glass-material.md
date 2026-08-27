# 3. Glass is layered CSS with a legibility floor, not a single filter

Date: 2026-08-27
Status: Accepted

## Context

The brief asked for Apple's Liquid Glass. Apple's implementation refracts what is
behind a panel, bends light at its edges, and adapts its tint so foreground text stays
readable over arbitrary content. On the web only part of that is directly available.

`backdrop-filter` accepts `blur()` and `saturate()` almost everywhere, but accepts a
`url()` filter reference — which is what buys actual refraction — only in Chromium.
Safari supports `backdrop-filter` without filter references; Firefox supports neither
reliably. `@supports` cannot distinguish those cases.

Transparency also fights legibility. Rendered over the velocity-ramp backdrop, body
copy on a lightly tinted panel lost contrast wherever the content behind it was bright.

## Decision

Build the material in layers, each degrading independently:

1. **Base, everywhere.** `blur()` + `saturate()`, a 1px specular gradient along the top
   edge angled to one notional light source, and squircle geometry via `corner-shape`
   where supported.
2. **Legibility floor, everywhere.** A `--glass-scrim` colour composited *under* the
   glass tint, so contrast has a guaranteed minimum regardless of the backdrop. A
   `.glass--clear` modifier removes it for decorative panels carrying no text.
3. **Refraction, where possible.** A turbulence-driven `feDisplacementMap`, switched on
   by a runtime `CSS.supports()` test that adds a class to `<html>`.

## Consequences

- The material is consistent everywhere and better where the browser allows it. No user
  sees a broken panel; some see a nicer one.
- The scrim is a deliberate trade: slightly less transparency in exchange for text that
  stays readable over the flow field. Legibility wins.
- True per-shape edge refraction — Apple's normal-map approach — is not reproduced. The
  turbulence displacement is an approximation, and an honest one.
- One place to change the material: `.glass` in `globals.css`, consumed only through
  the `GlassPanel` component.

# 1. Build for the web, not SwiftUI

Date: 2026-08-27
Status: Accepted

## Context

The brief asked for a personal portfolio built in SwiftUI and Xcode, on the grounds
that SwiftUI offers a superior UI to traditional web frameworks.

SwiftUI compiles to native Apple binaries. It has no browser target: no URL, no SEO,
and nothing a recruiter on Windows or Android can open. A portfolio that cannot be
linked to has failed at its primary job.

The only bridge from Swift to the browser is SwiftWasm with Tokamak. That toolchain is
effectively dormant, produces multi-megabyte WebAssembly bundles before any content
paints, offers no SSR, and cannot reach `backdrop-filter` or WebGL natively — so it
would have produced a slower, less capable and less attractive site than plain React.

## Decision

Build a website with Next.js 15 and React 19, and reproduce the SwiftUI *design
language* explicitly: layered `backdrop-filter` with SVG displacement for refraction,
continuous-curvature (squircle) geometry, and spring-physics motion.

## Consequences

- The site is reachable at a URL on every platform, and indexable.
- The Apple feel must be engineered rather than inherited, which is a real cost — see
  the design-system work in `src/app/globals.css` and the glass primitives.
- Swift skills are not exercised by this project. A native companion app remains
  possible later and would share the same content API.

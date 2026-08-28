# 5. A space background, dark only

Date: 2026-08-28
Status: Accepted
Supersedes: ADR 0003's flow-field background

## Context

The background was potential flow past a Joukowski aerofoil: physically exact,
and on-theme for an aerodynamicist. Two rounds of tuning made it beautiful in
isolation and it still did not work as a page. Streamlines are directional and
busy; they crossed body text, competed with panels for attention, and made every
section feel like it had something happening in it.

The brief that followed was explicit: simple but immersive, space-themed, dark
only, with panels that move rather than sit.

## Decision

Replace the flow field with a deep-space field: a graded void, domain-warped
nebula, three parallax star layers driven by scroll and pointer, and a faint
galactic band for composition. Delete the light theme, the theme toggle and the
theme store entirely.

## Consequences

- Space is a quiet background in a way a flow field is not. Stars are points,
  not lines: they never lead the eye anywhere, which is what a background needs.
- Removing the second theme removes a whole class of contrast bugs and a
  meaningful amount of CSS, and lets the palette be tuned for one world instead
  of compromised across two. It also means no reader gets to choose, which is a
  real cost and a deliberate one.
- Case-study pages dropped from 154 kB to 107 kB of first-load JavaScript: the
  flow field, the theme system and their motion no longer ship there at all.
- Star size is computed in device pixels rather than in grid cells. Falloff in
  cell units makes a sparse layer draw soft blobs and a dense one draw specks —
  the first attempt looked like bokeh, not a sky.

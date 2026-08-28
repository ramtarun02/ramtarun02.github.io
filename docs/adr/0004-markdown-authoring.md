# 4. Case studies and posts are Markdown, with typed escape hatches

Date: 2026-08-28
Status: Accepted
Supersedes: the structured-block model introduced with the first three case studies

## Context

Case studies were first modelled as a discriminated union of typed blocks —
prose, figure, table, callout, chart — so that the admin could generate an editor
for them from the schema, with no free-form content the form could not represent.

That reasoning was sound for the admin and wrong for the writing. Long-form
technical prose is written in a text editor, in Markdown, and a block list makes
the author think in containers rather than in argument. The request was explicit:
studies and posts should be `.md`.

## Decision

The document body is a single Markdown string. Four fenced blocks with known
language tags carry what Markdown cannot express — `chart`, `keynumbers`,
`finding`, `caution` — and are split out before rendering and drawn as
components. Everything else is ordinary Markdown, rendered with `marked` and
styled by one `.md-prose` contract.

## Consequences

- Writing feels like writing. A study can be drafted anywhere and pasted in.
- The admin keeps generating itself: `body` is simply a field whose editor is a
  Markdown textarea, and the live preview renders the same component the site
  uses.
- Rendering happens at build time, so no Markdown parser ships to the browser.
- Content is trusted input from this repository, so the rendered HTML is not
  sanitised. That is a deliberate boundary: if content ever comes from anywhere
  else, this decision has to be revisited before that happens.
- Tables and figures lose a little structure — a table's highlighted row is now
  bold cells rather than a typed field. Worth it.

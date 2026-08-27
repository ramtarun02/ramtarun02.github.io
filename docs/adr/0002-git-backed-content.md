# 2. Content lives in the repository, not a database

Date: 2026-08-27
Status: Accepted

## Context

No content may be hardcoded: experience, projects, publications, case studies and posts
all change over time and must be editable without touching code. Hosting is not yet
chosen, and may end up being a static host with no server or database available.

## Decision

Every content type is defined once as a Zod schema. That schema produces the TypeScript
types the site compiles against, the runtime validation that fails the build on
malformed content, and the admin's editing form. Content is stored as JSON and MDX
committed to this repository via the GitHub API.

## Consequences

- Works on any host, including a purely static one.
- Content is version-controlled, diffable and revertible — a bad edit is a `git revert`.
- Saving is not instant: a commit triggers a rebuild, so the public site trails an edit
  by a minute or two. Live preview in the admin covers the editing experience.
- Binary assets must be managed carefully, since git retains every version. The admin
  commits optimised derivatives only, with a per-file size cap.

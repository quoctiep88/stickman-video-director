# QTx Video Director — operating contract

Read this file, `docs/qtx/PROJECT.md`, and `docs/qtx/STATUS.md` first in every session.

- Canonical local path: `D:\Programing\vibecode2026\qtx-video-director`.
- Upstream: https://github.com/kaomei/stickman-video-director (MIT). Preserve its LICENSE, attribution, credits, history and directory layout.
- Upstream first: P00/P01 establish faithful understanding and full upstream parity before QTx extensions. Preserve all style/catalog behavior and keep upstream updates mergeable.
- QTx product code belongs under `qtx/`; local productions belong under ignored `productions/`. These boundaries do not authorize new phases.
- Series workflow: read the selected Series bible/metadata, current episode brief/metadata and relevant shared assets; follow `qtx/templates/PRODUCTION-AGENT.md`. Do not scan previous episode renders by default.
- Inspect Series `shared/` before planning/generating assets; reuse approved assets by reference. New assets stay episode-local in `assets/generated/`. Promotion is an explicit reusable-asset approval decision, never video approval or permission to silently replace shared content. See `docs/qtx/SERIES-WORKFLOW.md`.
- No unapproved scope, speculative frameworks/layers, over-engineering, or features merely because they seem useful. No web UI, database, API/service architecture, queue, Docker or infrastructure for MVP. Production is filesystem-first.
- P00 is fork, baseline verification and documentation only: no Unity, new video features, provider abstractions, renderer redesign, visual changes or behavioral refactors. Only a demonstrated necessity to run upstream may justify a narrowly scoped compatibility fix.
- Preserve accepted production assets. Never regenerate, revoice or overwrite approved assets without an explicit production reason and the applicable approval. Technical checks never substitute for creative approval or authorize paid generation.
- Use upstream's own checks and minimal meaningful testing; do not invent a large test suite. Distinguish code defects, missing local prerequisites and unverified external services.
- Make frequent meaningful Git commits at completed boundaries. Require a clean working tree at phase closure; inspect changes and never discard others' work. Push only to the QTx fork, never upstream.
- Keep context concise: update STATUS as a handoff, not a diary; keep architecture detail in the inventory. Record evidence and limitations instead of claiming untested parity.
- Keep secrets, generated media, caches and large production/Unity outputs out of Git; do not delete bundled upstream reference media. Preserve LF checkout bytes (`git config core.autocrlf false`) because upstream hashes text resources.
- Do not begin the next phase without a user request.

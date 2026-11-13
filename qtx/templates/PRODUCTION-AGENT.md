# Episode context contract

For one episode, read only:

1. Repository `AGENTS.md`.
2. `docs/qtx/PROJECT.md`.
3. `docs/qtx/STATUS.md`.
4. Selected Series `SERIES.md`.
5. That Series `series.json`.
6. Current episode `brief.md` and `video.json`.
7. Current episode files needed for the task (plan/script/manifest/report as relevant).
8. Relevant Series `shared/` directories and assets.

Inspect shared assets before planning/generating anything new. Reuse suitable approved
files by relative path. New/unapproved assets stay in `assets/generated/`. Promotion
requires the human/Codex approval decision; never silently regenerate/replace shared
assets. Read SERIES-WORKFLOW when CLI usage or ownership is unclear.

Do not scan previous episode renders or load the whole upstream repository by default.
For a runtime question, read only its entry point or selected style reference.
Do not duplicate the style catalog. Obtain user plan/script approval before production;
preserve upstream preview/approval/render ownership. Technical tests are not creative
approval or permission for paid generation.

For QTx Unity production, follow docs/qtx/PRODUCTION-MVP.md and use qtx/produce.mjs.
Apply skills/qtx-natural-narration/SKILL.md to the factual draft, read it aloud and audit the Series voice. After script approval, prepare exact thought blocks for long-form synthesis as described in the production contract.
Author plan.md, exact spoken script.md and visual-plan.md; stop for explicit human
approval before recording approve-plan or making provider calls. Check fingerprints,
reuse matching outputs and never automatically retry a paid call. Actual narration
timing drives scenes and captions. Inspect the encoded preview and stop again for
explicit human approval before approve-preview/render. Changes invalidate approval.
Use only current-Series shared references; other-Series fixtures require local import
and explicit P02 promotion, preserving the source. No global asset library.

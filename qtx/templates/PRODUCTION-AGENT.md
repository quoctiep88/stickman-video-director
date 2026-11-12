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

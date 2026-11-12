# QTx Series production workflow

P02 wraps upstream production with local files. Product code lives in `qtx/`;
production content stays in ignored `productions/`. No provider calls are automated.

## Layout and metadata

```text
productions/<series-slug>/
  SERIES.md
  series.json
  promotions.json                 # created on first promotion
  shared/
    characters/
    props/
    backgrounds/
    symbols/
    interactions/
  videos/<episode-id-slug>/
    brief.md
    plan.md
    script.md
    video.json
    project.json                  # only for upstream routes needing it
    assets/generated/
    audio/
    scenes/
    preview/
    output/
    reports/
```

`SERIES.md` is the human/AI bible: purpose, audience, language, duration, route/style,
visual/narration direction, recurring cast/environments/props and rules. Refine the
starter from `qtx/templates/SERIES.md` for the Series.

`series.json` version 1 contains `id`, `title`, `language`, `default_style_id`,
`aspect_ratio`, `resolution: {width,height}`, `fps`,
`target_duration_seconds: {min,max}` and `shared_path: "shared"`.
Defaults: B1, en, 16:9, 1280×720, 30fps, 60–480 seconds. Edit JSON/bible to set
preferences. The duration range is a planning preference, not a gate.

`video.json` version 1 contains `id`, `title`, `topic`, `language`,
`duration_seconds`, `style_id` and `shared_path: "../../shared"`.
Initialization snapshots language/style and defaults duration to the Series minimum.
Later Series changes do not silently change existing episodes. Render dimensions/fps
are explicitly authored in upstream manifests; QTx metadata does not override them.

Store upstream IDs such as A1/B1/B4. QTx checks ID syntax only; upstream routing/style
references remain authoritative. P01's “A1 Classic Light” treatment is still A1.

## CLI (Node 20+, no QTx dependencies)

From the repository root:

```sh
node qtx/production.mjs init-series productions/backend-explained --title "Backend Explained" --language en --style B1
node qtx/production.mjs init-video productions/backend-explained 001-how-backend-works --title "How Backend Works" --topic "How backend servers work" --style B1 --duration 480
node qtx/production.mjs promote-asset productions/backend-explained 001-how-backend-works assets/generated/host shared/characters/host
node qtx/production.mjs check productions/backend-explained
node qtx/production.mjs check productions/backend-explained 001-how-backend-works
node --test qtx/production.test.mjs
```

Initialization refuses existing targets, never merges and generates no media. IDs use
lowercase alphanumeric hyphenated slugs. `init-video` requires a valid Series.
`check` verifies canonical files/directories, used metadata and promoted hashes;
without an episode ID it checks every video. It does not validate creative quality,
upstream schemas or approval. Commands return JSON on success and exit 1 on error.

## Ownership, promotion and reuse

New/unapproved assets belong in episode `assets/generated/`. Approved reusable assets
belong to that Series's `shared/`, never a global library.

Reuse approved Series assets before generating new episode-specific assets.

Assets under `shared/` are approved Series assets and must not be silently regenerated or overwritten.

Inspect relevant shared directories before planning/generating assets. Reuse suitable
files by reference. A newer generation is not permission to replace approved content.
Replacement requires an explicit future/user decision; P02 has no replace command or
version history.

Invoking `promote-asset` is the approval signal for that reusable asset. Its source is
episode-relative and must stay inside the episode (including audio/other approved
files); its destination is Series-relative and below one of the five shared categories.
Links/junctions are refused. Files/directories are copied with source preserved.
Existing byte-identical content succeeds unchanged; differing content fails without
merging or overwriting.

`promotions.json` records original episode/path, promoted path, kind, SHA256 and UTC
time. Files hash their bytes; directories hash a sorted JSON tree of names, kinds and
digests, including empty directories. Identical repeats preserve the first record.
`check` detects changed promoted content. Records are replaced via temporary file and
rename after copy verification.

Use serial operations: no simultaneous promotions or source edits while copying.
This is not a transactional store. Interrupted copies may leave partial new targets;
inspect before explicit recovery. Completed copies whose record write failed can be
retried identically. Never automatically delete/replace accepted shared content.

## Human and agent workflow

1. Create/select a Series, refine its bible, then create an episode with topic/duration.
2. Codex reads the bible/shared assets, refines `brief.md`, authors `plan.md` including
   shared references/new asset needs, and writes `script.md`.
3. User approves plan/script. Future production steps may create episode-local assets;
   P02 calls no providers and grants no paid generation permission.
4. Approved reusable assets may be promoted. Other assets remain local.
5. Follow upstream preview/review/approval/render. Final media stays in episode
   `output/`. Promotion does not approve a video or preview.

Normal context is the exact list in [production-agent instructions](../../qtx/templates/PRODUCTION-AGENT.md).
Do not scan earlier episode renders or reload upstream without a runtime question.

## Upstream integration

B1–B4 episodes can hold ordinary upstream `project.json` files. Image layers may use
`"path": "../../shared/symbols/packet.png"`, relative to that manifest. No Series fields
are added to upstream's schema. Author from the selected upstream contract; upstream
`init` expects an absent directory, so do not run it on an initialized QTx episode.
QTx intentionally does not fabricate a render-ready manifest.

```sh
node skills/directing-stickman-videos/scripts/autopilot.mjs validate productions/SERIES/videos/EPISODE/project.json
node skills/directing-stickman-videos/scripts/autopilot.mjs preview productions/SERIES/videos/EPISODE/project.json --seconds 2
```

After genuine preview approval, use upstream `approve ... --note TEXT` and `render ...`.
Upstream puts previews/reports/approval/cache in episode `output/`; QTx `preview/` and
`reports/` remain for separate planning/review artifacts. Do not relocate upstream
evidence or weaken its gate. Director A episodes may retain proposals/prompts without
`project.json`; A6/B5 retain their distinct routes.

See [P02 evidence](acceptance/P02-RESULTS.md). Series workflow wraps upstream production.

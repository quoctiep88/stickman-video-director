# P02 technical acceptance

Executed 2026-11-13. Starting SHA `f39edbbceb397e546e5624be5e153e5a5fea4515`;
upstream unchanged at `105b134f80fa11abe7a012f713712d39f20936f3`.
Clean starting `main`; `core.autocrlf=false`; origin is the QTx fork.

## Local evidence

Ignored Series `productions/p02-demo-series/` was created via `init-series`;
episodes `001-introduce-packet` and `002-reuse-packet` via `init-video`.
Canonical structure/metadata pass `check`. Repeated Series/episode initialization
exits 1 without overwriting.

Episode 001's locally drawn 100×80 PNG `assets/generated/packet.png` was explicitly
selected/promoted for this technical acceptance into `shared/symbols/packet.png`.
No paid generation/external call. Source preserved; both copies have SHA256:
`7d1870da67e604dea98ae7bc7ed6ad11479281ef5b85665c4721fd2fdca25c6e`.
`promotions.json` identifies episode, relative source/destination, kind, hash and time.
Repeat promotion succeeds with unchanged provenance. Different local text targeting
the same shared filename exits 1; source/shared PNG hashes remain unchanged.

Episode 002's ordinary B1 `project.json` references `../../shared/symbols/packet.png`.
Its `assets/generated/` is empty. Its plan was written after reading Series
bible/metadata, current brief/video metadata and listing/visually inspecting the shared
symbol. Episode 001 plan/script/audio/renders were not needed/read for that step.
This is workflow evidence, not a quota benchmark or isolated model-session test.

Upstream `autopilot.mjs validate` and `preview --seconds 2` pass without runtime/schema
changes: 640×360, 12fps, 24 frames, one shot/caption, full decode pass. Report input
resolves directly into Series shared with the same PNG hash. Local motion diagnostic:
1,186 changed pixels. Contact sheet inspected: packet moves from browser toward server.
MP4 SHA256: `489d717cae1b247900ec7f701a84564c9d40c888e310936cdac6ab6507a56282`.

Episode 002 artifacts: `output/preview.mp4`, `.srt`, `.vtt`,
`preview-contact-sheet.png`, `preview-report.json`; `reports/p02-acceptance.json`.
Helper scripts remain ignored in the demo Series. No approval.json created; no full
render invoked; no public-release/creative approval claimed. Audio/caption are synthetic
plumbing fixtures, not speech alignment or listening evidence.

## Executed checks

| Check | Result |
| --- | --- |
| `node --test qtx/production.test.mjs` | 5/5 pass, zero skipped: CLI smoke/defaults/no overwrite, path boundaries, file provenance/idempotency/conflict, directory copy/no merge, junction escape |
| Demo initialization + `check` | Series/both episodes pass; repeated targets refused |
| `node productions/p02-demo-series/verify.mjs` | Source preserved, repeat provenance unchanged, conflict refused, shared hash in upstream report, no episode 002 copy/approval |
| Upstream B1 `validate`, `preview --seconds 2` | Pass; 24 frames; full decode pass |
| `node --test skills/directing-stickman-videos/tests/b-style-quality.test.mjs` | 10/10 pass; existing motion/caption/audio checks |
| `git diff --check` and scope/ignore review | Pass; only QTx code/docs/contracts tracked; production ignored; upstream untouched |

Initial sandbox execution blocked Node child processes/FFprobe with EPERM; approved
process access resolved that environment limitation. First fixture validation correctly
rejected missing continuous ambience. Adding a local synthetic ambience track satisfied
the existing gate; no renderer/gate changes.

No full P01 matrix rerun: upstream files unchanged. Existing P01 limitations remain in
PARITY. P02 is serial local filesystem tooling, with syntax-only style validation and
no automated partial-copy recovery; see SERIES-WORKFLOW for recovery limits.

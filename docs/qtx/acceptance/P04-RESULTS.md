# P04 technical acceptance

Date: 2026-11-13 (Asia/Bangkok). **PASS** for requested local technical scope.
Technical fixture review is not publication/creative approval.

Starting main SHA: `0525859b34cfc1eb32671f7249ee1ece13fe17eb`; clean tree,
origin/main matched. Unity 6000.6.7f1; FFmpeg/FFprobe 9.0.2. No package additions.
No older QTx2D source was inspected/reused. No upstream source/assets changed.

## Production

Ignored Series: `productions/p04-animation-demo/`; episode `videos/001-semantic-actions/`.
Ten seconds, 640×360, 12fps, **120 expected / 120 rendered frames**.
Shared directories were inspected and empty. New synthetic character/contact assets
were authored episode-locally and explicitly promoted for the user-requested
technical reusable packages; provenance retained. No existing shared asset changed.

- Character: `shared/characters/technical-host/character.json`, torso/head rasters,
  continuous arm/leg rasters; six visible semantic parts plus implicit root.
- Interaction: `shared/interactions/hold-card/interaction.json` and one raster
  containing bent arm, palm, blank card and front thumb.
- Ordinary P03 object `cpu`: episode-local raster at `[3,2]`.
- Actor `host`: WALK_TO `[-5,-2]` → `[-1.5,-2]` at 0–2s; LOOK_AT cpu 2–5s;
  POINT_AT cpu 3–5s; HOLD_CARD 5–8s; IDLE 8–10s.
- Scene is JSON only. The Python fixture tool draws source artwork, not poses.
  No individual-scene C# or provider calls. Source packages remain outside Unity.
- Connected CPU two-bone skinned limbs; rationale and exact contract in
  [ANIMATION-ENGINE](../ANIMATION-ENGINE.md).

## Executed checks

| Check | Result |
| --- | --- |
| Node semantic validation | 4/4 PASS: packages, targets, IDs, actions, ranges, conflicts, required continuous parts, interaction compatibility |
| Existing P03 Node tests | 7/7 PASS |
| Existing Series tests | 5/5 PASS |
| Unity compilation/interpolation | PASS |
| Unity semantic assertions | PASS: linear/chained root travel, facing, deterministic gait/out-of-order evaluation, named/position/actor targets, pointing direction, LOOK_AT, contact timing, connected mesh vertex identity, unknown action rejection |
| Actual renderer contact assertions | PASS: ordinary arm hidden and authored module visible during HOLD_CARD; arm restored/contact hidden at end |
| Final original/repeat/target-mutation renders | Each 120 frames, H.264, correct dimensions/fps/count; FFprobe and full FFmpeg decode PASS |
| Repeat PNG hashes | All 120 identical |
| Repeat MP4 bytes | Identical; SHA256 `3f22d4f77b55be594f61fbd133664923640149263f6dd8e3f60848a4fc034e6d` |
| Target mutation | Exactly frames 24–59 changed (36); other 84 unchanged; original scene bytes restored |
| Unknown action mutation | Fails: `unknown action UNKNOWN` |
| Missing interaction mutation | Fails: `interaction: missing file .../missing-interaction.json` |
| P03 retained fixture regression | 72/72 PNGs and MP4 byte-identical to retained P03 baseline; probe/decode PASS |
| Series check | PASS including promoted hashes |
| Visual inspection | PASS as below |

Initial sandbox tests failed on a nonexistent nested temporary-directory path;
Unity also crashed in that sandbox. Normal local execution resolved this environment
issue. An initial self-test initializer syntax error was fixed before successful
compilation. No unresolved test/compiler/render failures remain. No upstream suite
was rerun: upstream files are untouched, and P03 has direct pixel-level regression.

## Visual evidence

Codex inspected frames **0,6,18,30,48,72,108,119** in the contact sheet, plus an
individual HOLD_CARD frame. Frames 6/18 show opposing leg poses and knee bends
during root travel, with no detached segments or elbow seam patches. Frame 30
shows an upward head tilt; frame 48 shows a continuous bent arm aimed at CPU.
Frame 72 shows a thumb over the card edge with palm/arm behind it, and no ordinary
right arm underneath. Frames 108/119 restore the normal arm and neutral head.
The ordinary CPU sprite remains visible. No computer-vision QA was used.

These are technical proportions/motion, not publication artwork. The gait lacks
foot locking and pose/contact switches are instantaneous; limitations are explicit.

## Retained local evidence

Under the episode `output/unity/`:

- `frames-Xa0wfY/film.mp4`: final original.
- `frames-8rWIKd/film.mp4`: identical repeat.
- `frames-3MIMGI/film.mp4`: target-mutation evidence.
- `render-report.json`: restored pointer to original.
- `animation-acceptance.json`: all frame hashes, changed indices, validation
  errors, output paths and recorded visual PASS.
- `contact-sheet.png`: inspected eight-frame sheet.
- Each run retains normalized job, PNGs, Unity log/version and report.

P03 regression: `productions/p02-demo-series/videos/003-unity-packet/output/unity/frames-qVBXMf/film.mp4`.
SHA256 remains `6cc7be3a312267488e1dd3e6d5cc5c82ade5cca0bd94675ec729e1fa2ac5fbc7`.

Reproduction is in [ANIMATION-ENGINE](../ANIMATION-ENGINE.md). Re-running acceptance
resets visual status to PENDING until inspection. All production media/packages,
logs and caches stay ignored. Git closure is in [STATUS](../STATUS.md). P05 not begun.

# QTx status

- Phase: **P03 — Unity Renderer MVP; CLOSED PASS for requested local technical scope**. P00/P01/P02 remain closed. P04 not begun.
- Starting P03 SHA: 51bbf7893ecb58e1b66be6cd8934774503c8c1ef. Engine/bridge commit d2981f2; tests/acceptance commit 0eaf8dc. Resolve final docs/closure SHA with git rev-parse HEAD and remote agreement with git rev-parse origin/main.
- Branch main; origin https://github.com/quoctiep88/stickman-video-director.git; upstream baseline remains 105b134f80fa11abe7a012f713712d39f20936f3. No upstream runtime/schema/styles/license/assets modified.
- Delivered: one Unity 6000.6.7f1 project at qtx/unity/QTxVideoDirector/, dependency-light Node doctor/validate/frames/render, external PNG/JPEG sprite loading, independent linear transform tracks, exact indexed frames, FFmpeg finishing and input/output hash report. See [renderer contract](UNITY-RENDERER.md).
- Ignored acceptance: productions/p02-demo-series/videos/003-unity-packet/; two scene JSONs and distinct unity-project.json reuse shared/symbols/packet.png directly. Six seconds, 640x360, 12fps, 72 PNGs, valid H.264 MP4; full decode passes. Original technical output: output/unity/frames-E98oA5/film.mp4.
- Determinism: all 72 frame hashes and MP4 hash identical across unchanged runs. Scene-2 mutation changed exactly 36 frames, leaving scene 1 identical; original scene bytes restored. Contact sheet frames 0/18/35/36/71 visually inspected: transforms, transparency, layering/background correct.
- Checks: Node Unity validation 7/7, existing Series tests 5/5, Series contract/promotion hashes, C# compilation, batch interpolation self-test, Node-to-Unity smoke, three full render/probe/decode runs PASS. Initial Unity license error 198 resolved by user activation; no installation required.
- Evidence and reproduction: [P03 acceptance](acceptance/P03-RESULTS.md). Prior [Series workflow](SERIES-WORKFLOW.md), [P02 evidence](acceptance/P02-RESULTS.md), [PARITY](PARITY.md) remain authoritative.
- Limits: same-environment raster determinism only; JPEG is implemented but not acceptance-tested. Serial local commands, no cache/recovery automation. Technical evidence is not creative approval. No rigs/SpriteSkin/limbs/actions/interactions/walking, audio/lip sync/captions, Timeline/physics, providers/UI/services/database.
- Next only on user request: **P04 — QTx Animation Engine**.

# QTx status

- Phase: **P04 — QTx Animation Engine; CLOSED PASS for requested local technical scope**. P00/P01/P02/P03 remain closed. P05 not begun.
- Starting P04 SHA: 0525859b34cfc1eb32671f7249ee1ece13fe17eb. Engine commit 7ea005b; acceptance/test commit 0cc7f24. Resolve final docs/closure SHA with git rev-parse HEAD and remote agreement with git rev-parse origin/main.
- Branch main; origin https://github.com/quoctiep88/stickman-video-director.git. Upstream baseline remains 105b134f80fa11abe7a012f713712d39f20936f3; no upstream runtime/schema/styles/license/assets changed.
- Delivered: additive actors/actions/interactions, external Series character loader, continuous CPU two-bone skinned limbs, exactly IDLE/WALK_TO/LOOK_AT/POINT_AT, and authored HOLD_CARD contact/replacement. Existing P03 objects and deterministic frame loop preserved. See [animation contract](ANIMATION-ENGINE.md).
- Ignored acceptance: productions/p04-animation-demo/videos/001-semantic-actions/. Ten seconds, 640x360, 12fps, 120 frames, valid decoded H.264 MP4. Final original: output/unity/frames-Xa0wfY/film.mp4; eight-frame contact sheet visually PASS. Character/contact artwork is synthetic technical Series material, not publication approval.
- Determinism: all 120 repeated frame hashes and MP4 bytes identical. Target mutation changes exactly frames 24–59; original scene bytes restored. P03 regression reproduces all 72 retained baseline frames and MP4 byte-for-byte.
- Checks: semantic Node 4/4, P03 Node 7/7, Series 5/5, Unity compilation/interpolation/semantic/contact-visibility assertions, final original/repeat/mutation renders, P03 render/probe/decode, Series promotion integrity and visual inspection PASS. Sandbox temp-path failures resolved by normal local execution.
- Evidence: [P04 acceptance](acceptance/P04-RESULTS.md). Prior [P03](acceptance/P03-RESULTS.md), [Series workflow](SERIES-WORKFLOW.md), [PARITY](PARITY.md) remain authoritative. No old QTx2D source inspected/reused.
- Limits: simple side-view humanoid, fixed joint proportions, authored gait without foot locking/speed adaptation, right-arm-only point/contact, abrupt pose switches, same-environment raster determinism. No generic IK/grasp/hands, facial/lip-sync/audio, providers, UI/services/database or production orchestration.
- Next only on user request: **P05 — End-to-End QTx Production MVP**.

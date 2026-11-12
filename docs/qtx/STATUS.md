# QTx status

- Phase: **P02 — QTx Series Production Workflow; CLOSED PASS for requested local technical scope**. P03 not begun.
- Starting P02/P01 final SHA: `f39edbbceb397e546e5624be5e153e5a5fea4515`; tooling commit `cb6ff73`. Resolve final closure SHA with `git rev-parse HEAD` and remote agreement with `git rev-parse origin/main`.
- Branch `main`; origin `https://github.com/quoctiep88/stickman-video-director.git`; upstream baseline remains `105b134f80fa11abe7a012f713712d39f20936f3`; `core.autocrlf=false`. Upstream runtime/schema/styles/license/assets unchanged.
- Delivered: dependency-free `qtx/production.mjs` init-series/init-video/promote-asset/check, concise Series bible and production-agent templates. Shared approval/reuse is Series-local; source-preserving promotion is idempotent and refuses conflicting bytes, with durable SHA256 provenance.
- Navigation: [workflow](SERIES-WORKFLOW.md), [P02 acceptance](acceptance/P02-RESULTS.md), [agent context](../../qtx/templates/PRODUCTION-AGENT.md). P01 evidence remains in [PARITY](PARITY.md) and [P01 acceptance](acceptance/P01-RESULTS.md).
- Ignored acceptance: `productions/p02-demo-series/`, episodes `001-introduce-packet` and `002-reuse-packet`. Episode 001 packet promoted to `shared/symbols/packet.png`; episode 002 references those exact bytes with no local copy. Upstream B1 preview passes: 2s, 640×360, 12fps, 24 frames, full decode; report identifies shared input hash. No new preview approval/full render recorded.
- Checks: QTx 5/5; existing focused upstream B-style tests 10/10; demo creation, no-overwrite, promotion/provenance/reuse and contract checks pass. Sandbox child-process restriction resolved through approved execution. Initial missing-ambience fixture correctly rejected, then repaired without runtime change.
- Limits: serial filesystem operations, no partial-copy recovery automation; style IDs syntax-checked, upstream authoritative. Synthetic preview audio is technical evidence, not speech/listening/creative approval. No provider integration, Unity, services or new approval state machine. Existing P01 limitations remain in PARITY.
- Next only on user request: **P03 — Unity Renderer MVP**.

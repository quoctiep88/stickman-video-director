# QTx Video Director

Build a repeatable, filesystem-first video production workflow orchestrated by Codex, beginning with faithful Stickman Video Director behavior. This is a fork so upstream's production knowledge, validated examples and evolving styles remain available without rebuilding them prematurely.

Canonical checkout: `D:\Programing\vibecode2026\qtx-video-director`.
Upstream: https://github.com/kaomei/stickman-video-director (MIT).
Baseline: `105b134f80fa11abe7a012f713712d39f20936f3`.

The intended user journey is topic → plan/script approval → preview approval → final video. Preserve upstream route-specific contracts: A1–A5 ordinarily deliver prompts, A6 has independent finishing, and B delivers rendered video. QTx's future journey does not rewrite those contracts during parity work.

P02 architecture: upstream Director/Autopilot remains the foundation; additive `qtx/production.mjs` manages filesystem Series/Video workspaces in ignored `productions/` and promotes approved Series assets with provenance. Normal upstream manifests reference shared files by relative path; upstream retains preview/approval/render ownership. See [Series workflow](SERIES-WORKFLOW.md). ElevenLabs is a future voice integration; Unity is an additive P03 renderer (see [Unity renderer](UNITY-RENDERER.md)); FFmpeg handles media finishing. Codex orchestrates production and recovery. No web UI, database or service stack is planned for MVP.

P00/P01/P02 are closed; P03 adds one deterministic Unity sprite renderer beside upstream. Later phases require a new user request. See [ROADMAP](ROADMAP.md), [STATUS](STATUS.md) and [upstream inventory](UPSTREAM.md).

## Preservation and updates

Keep upstream history and directories intact; `upstream` tracks the original repository and `origin`, when authenticated, must be our QTx fork. Fetch and review upstream changes, merge on a reviewable branch, rerun relevant upstream checks, and record the newly reviewed baseline. Never push QTx changes to upstream or silently replace the recorded P00 baseline. Keep modifications additive and preserve all upstream licenses/credits. Do not duplicate the style catalog: references remain authoritative. New machines should clone the QTx fork when available, configure upstream and `core.autocrlf=false`, then follow the inventory's setup instructions.

# QTx status

- Phase: **P00 — Fork, Baseline & Project Contract; PARTIAL**. Documentation/local fork established; baseline checks are not green. P01 has not begun.
- Upstream baseline and starting local SHA: `105b134f80fa11abe7a012f713712d39f20936f3`.
- Current reviewed local SHA: baseline above until the P00 documentation commit; resolve the live checkout with `git rev-parse HEAD`. A committed file cannot contain its own commit hash.
- Repository: canonical `D:\Programing\vibecode2026\qtx-video-director`, branch `main`, full upstream history. `upstream=https://github.com/kaomei/stickman-video-director.git`; origin absent, push not attempted because `gh auth status` reports no authenticated hosts. Preserve local LF checkout configuration.
- Environment: Node 22.14.0, npm 10.9.2, Python 3.12.3; locked Canvas/Sharp installed; bundled fonts pass. FFmpeg/FFprobe absent from PATH; Windows symlink privileges missing. Gemini key absent; external providers untested.
- Verification: Node 128/200 pass, 71 fail, one skip; A6 references pass, Python unit 19/20 pass; nine root Python checks pass, four fail. See [BASELINE](BASELINE.md) for commands and prerequisite vs upstream failure classification.
- Verified 11 styles: A1 Classic Black & White; A2 Modern Pop; A3 Prehistoric Cave; A4 Cozy Storytelling; A5 Historical Cartoon; A6 Amber Noir; B1 Minimal Line Art; B2 Colorful Hand-Drawn; B3 Retro TV; B4 Survival Thriller; B5 Character Explainer. A1/A2 variants and reference links: [UPSTREAM](UPSTREAM.md).
- Entry points: `skills/directing-stickman-videos/SKILL.md`, `references/autopilot.md`, `references/autopilot-runtime.md`, `scripts/autopilot.mjs`, `scripts/character-explainer.mjs`, `scripts/a6_finish.py` (paths after SKILL are within the skill).
- Limitations: missing local media tools/symlink privileges; B5 Windows path comparison; stale roadmap assertions; voice test assumes origin/main; no provider-backed or visual/audio parity verification. No QTx functionality or upstream behavior changes.
- Next phase only: **P01 — Upstream Full Parity**, when requested, resolve and verify upstream runtime/workflow parity before QTx extensions.

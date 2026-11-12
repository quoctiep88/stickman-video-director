# P00 baseline verification — 2026-11-12

Baseline `105b134f80fa11abe7a012f713712d39f20936f3`, Windows, Node 22.14.0, npm 10.9.2, Python 3.12.3. Upstream source behavior and test assertions are unchanged. **PARTIAL: baseline is not green.** No production parity or provider readiness is claimed.

## Executed checks

| Command/check | Observed result |
| --- | --- |
| `gh --version`; `gh auth status` | CLI 2.103.3 installed; no authenticated hosts. No fork/origin/push created. |
| `git clone https://github.com/kaomei/stickman-video-director.git .` | Complete clone/history; initial sandbox network failure, succeeded with approved network access. |
| `node --version`; `npm --version`; `python --version` | Versions above. |
| `ffmpeg -version`; `ffprobe -version` | Neither executable available on PATH. |
| `npm ci --no-audit --no-fund` in skill directory | Installed 10 packages from existing lockfile. Initial offline cache restriction resolved with approved network access. No lockfile edit. |
| `npm run doctor` | Node, Canvas, Sharp, fonts and B4 hook font pass; FFmpeg/FFprobe fail. Gemini key absent; network intentionally unchecked. |
| `npm test` in skill directory | Final exact-byte checkout: **200 tests: 128 pass, 71 fail, 1 skip**. Initial sandbox test workers hit spawn EPERM; rerun with approved child-process access. Earlier CRLF-induced fingerprint/routing errors resolved by restoring upstream blob bytes and local `core.autocrlf=false`. |
| `python skills/directing-stickman-videos/scripts/a6_reference_check.py` | PASS: three bundled references; no generation/visual claim. |
| `python -m unittest discover -s skills/directing-stickman-videos/tests -p 'test_*.py'` | 20 tests: 19 pass, one Windows symlink-privilege error (WinError 1314). |
| Root `python tests/verify-*.py`, each of the 13 existing scripts | Nine pass after LF restoration: a6-guidance, ab-preservation, b-common-quality, b1-baseline, b1-production-standard, cozy-storytelling, first-use-guidance, historical-cartoon, thumbnail-kit. Four limitations below. |

The preservation and historical-cartoon checks were rerun after LF restoration and pass. Root shell checks and manual behavioral scenarios were not run. No render smoke claim: required FFmpeg tools are absent. No test files were added or weakened.

## Failure classification

- **Local prerequisites:** missing FFmpeg/FFprobe blocks the doctor and most Node media fixtures/encodes, plus `verify-a6-finishing.py`. Both Node and Python symlink checks encounter Windows privilege restrictions. Do not infer renderer defects from missing executable failures.
- **Upstream Windows compatibility:** B5 closed-file-lock test compares Windows `path.relative` backslashes with slash-separated manifest names. The same pattern in `scripts/b5-production-quality.mjs` `exactLegacy()` rejects the bundled legacy example, causing the selected-frame test to demand a new-story production manifest. These failures remain recorded, not bypassed.
- **Upstream test drift:** `verify-chinese-onboarding.py` expects a 10,000 Stars heading; `verify-localized-readmes.py` expects older milestone states. The baseline commit itself updates the creator roadmap to 20,000 across languages. No README/test rewrite was made to hide these failures.
- **Fork-specific test assumption:** `verify-voice-continuity.py` hardcodes `origin/main`; only `upstream/main` exists because GitHub authentication is absent. Do not create a misleading origin just to pass it.
- **Optional external integrations:** Gemini key absent; image/TTS/video service authentication, models, quota and generation untested. No paid credits used. Whisper/model availability and full A6 finishing dependency readiness were not verified.

To reproduce elsewhere, keep exact upstream LF bytes, install locked npm dependencies, make FFmpeg/FFprobe available (shared runtime supports `FFMPEG`/`FFPROBE`), and run the same checks. Some tests call executable names directly, so PATH matters. Use an environment with symlink support for those tests. Address remaining compatibility/test-drift issues only within separately authorized parity work; do not change production style contracts.

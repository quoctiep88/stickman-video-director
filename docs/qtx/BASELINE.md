# P00 baseline verification — 2026-11-12

**P00 closure checks satisfied locally; closure commit and push follow this record.** This is baseline accounting, not full production parity. Baseline: `105b134f80fa11abe7a012f713712d39f20936f3`; retry starting SHA: `34d8dca69cafe1ec9dfc2bd6adbc3660c88b91e5`.

## Environment and Git

Windows; Node 22.14.0, npm 10.9.2, Python 3.12.3. Installed Gyan.FFmpeg 9.0.2 with winget (installer hash verified); FFmpeg and FFprobe both report 9.0.2. Fresh test processes resolve both by name after loading persisted Machine + User PATH; an already-running desktop process may need restarting to inherit it. No binaries added to Git. Locked Canvas/Sharp and bundled fonts pass doctor. Gemini key absent; external services, quota/billing and Whisper/model readiness unverified. No paid generation or OS security changes.

- Branch: `main`; upstream baseline remains an ancestor; history not rewritten.
- `origin`: `https://github.com/quoctiep88/stickman-video-director.git` (fetched successfully).
- `upstream`: `https://github.com/kaomei/stickman-video-director.git`.
- Local `core.autocrlf=false` retained. Push status: pending required post-closure-commit attempt; update follows the actual result.

## Executed existing checks

| Command/check | Result |
| --- | --- |
| `npm run doctor` in skill directory | All seven local checks true: Node, FFmpeg, FFprobe, Canvas, Sharp, fonts, B4 hook font. Network unchecked. |
| `npm test` in skill directory | 200 total: **192 passed, 8 failed, 0 skipped**. Child-process access enabled. |
| `python -m unittest discover -s skills/directing-stickman-videos/tests -p 'test_*.py'` | 20 total: **19 passed, 1 error**. |
| `python skills/directing-stickman-videos/scripts/a6_reference_check.py` | PASS: three references; offline integrity/structure only. |
| Each existing root `python tests/verify-*.py` | **13 scripts: 10 passed, 3 failed**. |

Passing root scripts: a6-guidance, ab-preservation, b-common-quality, b1-baseline, b1-production-standard, cozy-storytelling, first-use-guidance, historical-cartoon, thumbnail-kit, voice-continuity. The last now passes with the real fetched `origin/main`. Root shell checks/manual scenarios were not run; no full visual/audio or provider parity claim. Disposable upstream test fixtures do not constitute creative approval. Accepted bundled assets remain unchanged.

## Exhaustive remaining failure classification

| Category | Affected checks | Verified cause | Introduced by QTx? |
| --- | --- | --- | --- |
| UPSTREAM_WINDOWS | Node #85, `b4-opening-runtime.test.mjs`: rounded typography lock | Assertion requires `i.path.endsWith('/Nunito.ttf')`; upstream `autopilot-core.mjs` constructs the font path with Windows `path.join`. Doctor verifies the font hash. | No |
| UPSTREAM_WINDOWS | Node #143, `b5-local-baseline.test.mjs`: exact closed lock | `path.relative` returns backslashes; expected lock paths use slashes. Assertion output shows this mismatch. | No |
| UPSTREAM_WINDOWS | Node #150, `b5-production-quality.test.mjs`: byte-identical legacy exception; #164, `character-explainer.test.mjs`: selected frames | Same separator comparison in `exactLegacy()` rejects the historical scene and demands new-story `production.json`. | No |
| UPSTREAM_WINDOWS | Node #166, `character-explainer.test.mjs`: incomplete frame sequence | Cascades from #164: shared temporary frames were never created; encode reports missing `frames.json` before the expected incomplete-sequence assertion. Confirmed shared fixture dependency in test source. | No |
| ENVIRONMENT | Node #132 resource symlink, #196 output symlink, #197 nested cache symlink; Python `test_unsafe_and_symlink_paths_block` | Symlink creation fails with EPERM / WinError 1314. No Developer Mode or security changes made. | No |
| UPSTREAM_WINDOWS | Root `verify-a6-finishing.py` | FFmpeg synthetic fixtures succeed; test omits font overrides and upstream A6 defaults to macOS `/System/Library/Fonts/Supplemental/Impact.ttf`, absent on Windows. | No |
| STALE_UPSTREAM_TEST_OR_DOC | Root `verify-chinese-onboarding.py`, `verify-localized-readmes.py` | Tests expect a 10,000 Stars heading / old milestone states; unchanged upstream READMEs contain the 20,000 roadmap and newer milestones. | No |

No remaining QTX_REGRESSION or UNKNOWN failure. The entire tracked delta against baseline is seven paths: AGENTS.md, five docs/qtx documents, and .gitignore's `/productions/` entry. Git comparison confirms all upstream runtime, tests, README files, references and assets are unchanged. LICENSE, credits, directory layout and upstream history remain intact. Classification rests on the observed errors and unchanged upstream source, not a claimed independent second checkout run. No B5 or other runtime patch was made.

Local raw rerun logs are temporary, outside Git: `%TEMP%/qtx-p00-node.log`, `qtx-p00-python.log`, `qtx-p00-a6.log`, and `qtx-p00-verify-*.log`. P01 remains unstarted.

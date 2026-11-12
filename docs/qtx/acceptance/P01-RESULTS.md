# P01 acceptance evidence — 2026-11-12

Starting SHA: `79e06cf8258b09458b51ac5dd8b6948ce4da8bb7`. Runtime/test fix: `bef33b1`.

| Executed check | Observed result |
| --- | --- |
| Existing Node suite (`npm test`, local FFmpeg PATH loaded) | 200 tests: 197 pass, 3 fail, 0 skip; all failures Windows symlink EPERM. Initial sandbox launch attempt could not spawn children; successful suite ran with child-process access. |
| Existing Python unit discovery | 20 tests: 19 pass, one WinError 1314 symlink error. |
| Root `tests/verify-*.py` | 13 scripts: 11 pass, two stale Chinese/localized README milestone assertions fail. |
| A6 reference check | Three bundled references pass integrity/structure. |
| A6 finishing check (also counted among root checks) | 2 seconds/48 frames, synthetic picture/tone; explicit NotoSans fixture fonts; text/timing guards, repeated-word highlight, AAC preservation, SRT, decode, no-overwrite pass. Does not certify prescribed DIN/Impact visual match. |
| Doctor | All seven local checks true; Gemini key absent, network not checked. |
| B5 dedicated smoke | `init productions/p01/b5`, then `frames ... --frames 0,128,390,580 --trusted-code`; four PNGs and incomplete `frames.json` produced. Existing suite compares selected frames to baseline and rejects incomplete encoding. |
| Director A1 | User approved RAM proposal in chat; three standalone 10s prompts produced with repeated anchors, exact VO, continuity and expected output package. No generated video. |
| B1 validation and preview | Eight shots, 33.333333s narration timeline; full validate passes; 20s preview rendered/decoded. Contact sheet visually inspected. Actual user preview decision pending. |

B1: `productions/p01/b1/project.json`, `script.json`, `source.json`, `words.json`, `narration.wav`, `packet.png`, `bed.wav`, `output/preview.mp4`, `.srt`, `.vtt`, contact sheet and report. Local Windows System.Speech provides unpaid narration; sentence durations measured with FFprobe. Evenly distributed word timings are deterministic fixtures, not claimed speech alignment. Quiet sine bed is a technical sound fixture. Original script explains address lookup, DNS, connection, HTTPS, response and browser resources. No provider credentials or paid calls.

Existing upstream runtime tests exercised approval denial before approval, approval, full render, changed reviewed content rejection, preview byte tampering, tail-only edits, cache reuse and original voice preservation. B3/B4 focused behavior is included in the Node total. Full B1 acceptance results will be appended after the actual preview decision; tests do not stand in for that decision.

Raw local logs: `%TEMP%/qtx-p01-node.log`, `qtx-p01-python.log`, `qtx-p01-verify-*.log`, `qtx-p01-b1-preview.log`. Generated media and helper scripts are ignored under `productions/p01/`; bundled upstream media unchanged.

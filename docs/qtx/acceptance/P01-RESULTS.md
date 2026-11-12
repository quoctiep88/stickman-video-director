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
| B1 validation and preview | Eight shots, 33.333333s narration timeline; full validate passes; 20s preview rendered/decoded. Contact sheet visually inspected. User subsequently explicitly approved technical acceptance rendering. |

B1: `productions/p01/b1/project.json`, `script.json`, `source.json`, `words.json`, `narration.wav`, `packet.png`, `bed.wav`, `output/preview.mp4`, `.srt`, `.vtt`, contact sheet and report. Local Windows System.Speech provides unpaid narration; sentence durations measured with FFprobe. Evenly distributed word timings are deterministic fixtures, not claimed speech alignment. Quiet sine bed is a technical sound fixture. Original script explains address lookup, DNS, connection, HTTPS, response and browser resources. No provider credentials or paid calls.

Existing upstream runtime tests exercised approval denial before approval, approval, full render, changed reviewed content rejection, preview byte tampering, tail-only edits, cache reuse and original voice preservation. B3/B4 focused behavior is included in the Node total. Full B1 acceptance followed actual explicit user approval; tests did not stand in for that decision.

Raw local logs: `%TEMP%/qtx-p01-node.log`, `qtx-p01-python.log`, `qtx-p01-verify-*.log`, `qtx-p01-b1-preview.log`. Generated media and helper scripts are ignored under `productions/p01/`; bundled upstream media unchanged.

## Completed B1 acceptance

User explicitly approved the linked preview for technical full rendering and invalidation testing, retaining synthetic timing/bed limitations and excluding publication approval. CLI recorded that actual decision in `output/approval.json`.

- Full film: 33.333333 seconds, 640×360, 12fps, 400 frames, eight shots; four shot cache hits from preview. FFmpeg full decode passes; MP4, SRT/VTT, contact sheet and report exist.
- MP4 SHA256: `cb0de14affc57422fa9fe855524e28f71d2b7166dfff563994cdb20209def9dc`.
- Same command returns `reused:true` without replacement.
- Changed first-shot heading in a temporary mutation of the acceptance manifest: full render exits 1 with `Approval invalidated; preview and user approval required again`.
- Restored exact original manifest bytes; full render again allowed and reused. Approved narration/artwork untouched.
- Temporarily moved final artifacts aside to simulate missing final output while keeping shot cache: reconstruction reused **8/8** shots, passed decode and produced the identical MP4 hash. Original final artifacts restored; rebuilt evidence retained in ignored `resume-original/`. This tests completed-cache recovery, not forced process termination.
- Final contact sheet inspected; caption sidecar inspected. Timing and caption grouping remain synthetic/heuristic plumbing fixtures, not polished semantic/alignment acceptance. No physical listening claimed.
- Machine-readable local evidence: `productions/p01/b1/acceptance-evidence.json`; final media: `productions/p01/b1/output/film.mp4`.

**P01 PASS for the requested upstream/local technical parity scope**, with the explicitly permitted external/synthetic boundaries and upstream/environment limitations recorded above. No P02, paid generation, provider abstraction or approved upstream media changes. Existing suite failures remain classified; none is a demonstrated QTx regression.

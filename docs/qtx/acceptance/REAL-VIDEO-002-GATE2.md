# Real Video 002 — Gate 2 preview handoff

2026-11-13. Computing Clearly / `002-url-to-page`. Full 11-scene Gate 2 preview exists. **Await human preview approval.** No final 24fps release, engine expansion, promotion, P06 or N06.

## Recovery and frozen approval

Exact Gate 1 fingerprint remains `dda3a74a25252c3718f5435b1e3bc09097f000bc17dba54a7d1e8db87d7a095f`. Existing normal approval rechecked before spending and after production. Script, blocks, contexts, visual plan, Series bible/config and shared assets unchanged.

Original block-01 attempt/failure/request records remain byte-identical. Explicit user authorization was saved in `audio/block-01/authorized-recovery-attempt-1/authorization.json`, linked by hashes to original evidence. Recovery reused the exact saved request and succeeded HTTP 200. Blocks 02–07 each received one attempt and HTTP 200; no automatic retry or fallback. The original transport failure has no request ID, audio or confirmed billing outcome.

## Narration

Seven exact thought blocks reconstruct all approved UTF-8 script bytes. Full block and assembly decode PASS; original alignment text and ordered timing PASS. Duration **406.56s**; 1,016 whitespace words; **149.94 WPM** observed. Lauren B / `DODLEQrClDo8wCz460ld` / `eleven_v4` / `mp3_44100_128`; normalization off, no tags, custom settings or speed override.

| Block | Duration | Request ID |
| --- | ---: | --- |
| block-01 | 61.68s | `n8OaYmSP2x48JwIw3HcQ` |
| block-02 | 41.44s | `VezRN8a1BuT40zu2Cgq9` |
| block-03 | 42.64s | `Ni0QAq5l09FaipUYnVeJ` |
| block-04 | 42.72s | `7nnPc7BYBf28leWitD5P` |
| block-05 | 75.04s | `GRDS6DB9fgGWYr0M8lUg` |
| block-06 | 76.08s | `ShlKB2wE6KZ9RxUIlcAn` |
| block-07 | 66.96s | `t3RP5qHt7iQG8nJ5ccH5` |

Assembled MP3 SHA256: `d564814310df04c8d2a1630560efa0593387f1528cd1b3f89aea778527a6fcc5`.
Assembled PCM WAV SHA256: `fe34e59b3ce7f8b2ecc47812132728fc865df5492e403a45c7417743200423b5`.
Script SHA256: `f3ad38992d6e565d15908ecf19bcde693a7c7eac6aa5439509f6c78b5a2fb485`.

Input/audio/context hashes and original provider responses are preserved per block. `reports/narration-assembly.json` records all hashes, decoded sample offsets, endpoint measurements and timing adjustments. No samples or meaningful pauses removed; no time stretching. Three-millisecond edge ramps make assembled join samples continuous. Preview uses the assembled WAV plus existing limiter.

**Listening review flag:** block 05 has a brief terminal transient after a quiet tail, near episode time **263.52s (4:23.52)**. Decode and exact alignment do not prove acoustic completeness; listen to this join during Gate 2. No regeneration or hidden speech repair was performed. Original alignment includes small punctuation/whitespace overhangs beyond decoded audio (19 character entries); only derived timeline bounds were capped to media duration, with originals preserved. No audible listening PASS is claimed.

## Captions and local visuals

195 upstream QTx caption groups. Exact approved spoken wording preserved, first start 0, final end 406.56s, no cue beyond narration. Maximum measured caption width 906px in the 1180px safe width. Actual provider/sample timing drives scenes; frame boundaries quantized to 12fps without cumulative scene padding.

73 deterministic episode-local PNG assets under `assets/generated/local-diagrams/`: A=26, B=18, C=12, D=12, E=5. Local Pillow/Noto Sans drawing, warm field/ink/teal/amber, with word labels and direction as well as color. Asset hashes recorded. Zero image-provider calls or shared promotions.

| Scene | Actual seconds | State / motion |
| --- | --- | --- |
| S01 | 0.000–30.333 | Browser on desk; empty to finished conceptual page; Address fades in, Enter flashes, text then image appear |
| S02 | 30.333–61.667 | Large URL separates into scheme, name and path; Annotated strips spread apart; /about appears |
| S03 | 61.667–103.083 | Vertical DNS desk with resolver, saved answer and name servers; Lookup arrows descend; address card returns upward |
| S04 | 103.083–145.750 | Diagonal route map with alternative and serving destination; Packets follow authored segments; nearby serving node highlights |
| S05 | 145.750–188.417 | Certificate and matching name over protected endpoints; Certificate check appears, then channel; content remains absent |
| S06 | 188.417–226.500 | Request card on left; server workbench on right; Request travels to server; file and code/data alternatives light |
| S07 | 226.500–263.500 | Tall response document and alternate narrow/wide layouts; Status and HTML reveal; layout crossfade |
| S08 | 263.500–301.750 | Radial HTML hub with CSS, image, JavaScript and font cards; Separate outgoing requests and overlapping returned resource dots |
| S09 | 301.750–339.583 | Large page canvas with structure, styling, menu and late image; Structure becomes styled; menu opens; image arrives after useful text |
| S10 | 339.583–379.667 | Local cache shelf on left; remote validation on right; separate DNS cache; Fresh resource moves locally; validation travels out and back |
| S11 | 379.667–406.583 | Five-tile journey arc over finished browser; host returns; Tiles highlight in spoken order, then stable finished-page hold |

## Preview and QA

All artifact paths below are relative to ignored `productions/computing-clearly/videos/002-url-to-page/`. Preserve this local directory; Git contains documentation only.

- Movie: `preview/run-REcFBK/preview.mp4`.
- Contact sheet: `preview/run-REcFBK/contact-sheet.png`.
- Captions: `preview/run-REcFBK/preview.srt` and `.vtt`.
- Reports: `reports/preview-report.json`, `preview-probe.json`, `gate-2-qa.json`, `scene-timeline.json`, `local-assets.json`, `narration-assembly.json`.

Preview: **1280×720, 12fps, 406.583333s, 4,879 frames**, H.264/AAC. Full decode PASS, all numbered frames nonempty/contiguous, zero detected black intervals. SHA256 `0b49bd2a197bd70151db2bf87b75b3474f920e9860d19f791f25b6a8b9340665`.

Inspected 34 decoded frames: opening/midpoint/end of each scene plus S11 POINT_AT. No missing assets, detached host parts, caption collisions or remaining label overlaps observed. Distinct compositions and complete late scene states present. Local defects fixed before delivery: unsupported diagram glyphs, crossing DNS arrow, server-label border overlap, menu/image ordering, recap footer spacing. No creative redesign or post-review polish.

Host references unchanged current-Series technical-host only in S01/S11, with IDLE/LOOK_AT/POINT_AT. Existing technical-fixture publication-artwork caveat remains; this preview does not grant publication approval.

Unity 6000.6.7f1. First sandbox capture crashed during licensing initialization before frames; log retained in `output/unity/frames-ymfBw8/`. Unrestricted local capture succeeded. First inspection capture retained in `frames-QzKFPM/`; corrected capture is `frames-Bflq87/`. Generated Project Auditor diagnostic bytes restored to HEAD after Unity exited. No engine/source changes and no ENGINE_GAP_CONFIRMED.

The episode-local full-preview scripts call unchanged Unity rendering and existing QTx fingerprint/caption code; the normal P05 CLI preview remains a 20–30-second prefix. `unity-project.json` stays 24fps for the later final; `unity-preview.json` is 12fps and shares scene JSON. The preview report binds final production inputs plus the preview manifest hash and assembled PCM hash. No preview approval was recorded.

## Calls and preservation

- Total synthesis invocations: **8** (ceiling reached).
- Confirmed HTTP 200 responses: **7**.
- Failed/unknown original attempt: **1**; billing remains unknown.
- Explicit authorized recovery attempts: **1**; automatic retries: **0**.
- Image calls: **0**.
- Episode 001 inventory sizes/mtimes unchanged; Series/shared SHA256 unchanged.
- qtx engine/P05 code, Natural Narration rules and N01–N05 evidence unchanged.
- Original failure evidence preserved. No final render, promotion, new episode or phase.

Next: **Await human Gate 2 preview approval.** Include block-05 endpoint/join listening in that review. Technical checks do not grant artistic approval.

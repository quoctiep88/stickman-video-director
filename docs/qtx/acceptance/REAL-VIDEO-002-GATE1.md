# Real Video 002 — Gate 1 planning handoff

2026-11-13. Computing Clearly / `002-url-to-page` / **What Happens When You Type a URL?** Planning complete; **await human Gate 1 approval**. This is an episode, not P06 or N06.

Local package: `productions/computing-clearly/videos/002-url-to-page/`. Per repository contract, production files remain ignored and are not uploaded by this documentation commit. Preserve that local directory for continuation.

- `brief.md`: audience, scope and explicit 7–8 minute episode duration override.
- `plan.md`: story, research/caveat matrix and authoritative links, Natural Narration editorial audit, future voice constraints, verbatim snapshot of current Series narration guidance.
- `script.md`: exact spoken text, 1,016 whitespace tokens (989 counting spaced initialisms as one). Eleven paragraphs map to eleven visual beats, not final narration blocks.
- `visual-plan.md`: full scene purposes, narration mappings, compositions, host use, assets, semantic requirements and transitions; inventory/reuse/board/gap decisions.
- `video.json`: Lauren B / DODLEQrClDo8wCz460ld / eleven_v4; planning duration 450 seconds, target 420–480. No changes to accepted Series config/bible.
- `reports/production-context.json`: existing P05 plan input hashes and fingerprint.
- `reports/gate-1-checks.json`: minimal validation evidence; preservation baseline in `reports/preservation-before.json`.

Narrative/visual sequence: desk/browser → address close-up → vertical DNS lookup → diagonal route map → centered certificate/channel → server workbench → response document → radial resources → full-page construction → cache shelf → compact recap. Host only at opening/recap. Reuse Series technical-host package by reference; its existing artwork caveat remains. New assets are proposed deterministic local PNG diagram sets (browser, network, service/security, assembly, cache), not generated yet. Zero generated boards required; no promotions. No genuine ENGINE_GAP_CANDIDATE identified.

Speech estimate 6.6–7.0 minutes at 145–155 WPM; roughly 7–8 with breathing/visual holds is planning guidance, not a duration guarantee. Actual synthesis/alignment will govern. Read-aloud audit was a text-based conversational read-through, not an audible listening test. Future long-form thought blocks/context follow the existing contract after script approval; P05 voice does not itself consume narration-blocks.json.

Checks PASS: production.mjs episode check (including shared promotion ownership), Natural Narration skill quick_validate.py, file resolution/count/11 beats, verbatim guidance snapshot, git diff --check. Episode 001 file inventory/sizes/mtimes unchanged (no prior render inspection); shared and Series bible/config SHA256 unchanged. No qtx/P05 code or historical N01–N05 evidence changed. No paid calls, generated assets, narration blocks, render/preview or approval record.

Gate 1 fingerprint: `dda3a74a25252c3718f5435b1e3bc09097f000bc17dba54a7d1e8db87d7a095f`.

Exact bound inputs (paths relative to the episode or Series as prefixed):

- `episode/plan.md`: `7b3f7d3aeaf65de1052f1dab9d416f38e3db0f6ec0013e563c19bd646970d02e`
- `episode/script.md`: `f3ad38992d6e565d15908ecf19bcde693a7c7eac6aa5439509f6c78b5a2fb485`
- `episode/visual-plan.md`: `79fc29870f98729f0638aa32f5d29157445b55b96c70f2fe1e2fb9f98d6167dc`
- `episode/brief.md`: `1b0c169212c689be7f21e9368590982de77abcbc09688e52a089b4567630a286`
- `episode/video.json`: `0824413ad4547064ac774d444065da20b4e26fb97829f3ce1fcfa7d645377bb7`
- `series/SERIES.md`: `7522a16f011a7c4cc630b728be9b9c0d669dda7390d05728aec34ba0b0d83a73`
- `series/series.json`: `0dd1f0edca5b8819cfdfdf32c854c63a5d42923303a4aff04d425e09c0c6e531`
- `series/shared`: `709dcc4b0bd500f672571ea4137c75996486470c74a560d854fd1bcd79240710`

`series/shared` binds the entire tree, including technical-host character.json/head.png/torso.png/arm.png/leg.png and empty shared categories. The current narration supplement is bound through its verbatim plan.md snapshot; relevant visual guidance is in SERIES.md and visual-plan.md. This fingerprint is a review candidate, not an approval. Do not run approve-plan until explicit human approval. Provider calls = 0.

Source maintenance (2026-11-13): current TLS authority in plan.md updated from RFC 8446 to [RFC 9846](https://www.rfc-editor.org/rfc/rfc9846.html), including authentication section §4.5. RFC 9846 obsoletes RFC 8446 and retains TLS 1.3 as a backward-compatible minor update (§1.2). Creative package editorially approved; production approval awaits the refreshed fingerprint. Brief/script/visual-plan/video.json and all Series/shared input hashes are unchanged; script remains 1,016 words and 11 scenes. Provider calls = 0. Only plan.md and derived fingerprint/report fields changed locally.

Next: Await human Gate 1 approval for Real Video #2 production.

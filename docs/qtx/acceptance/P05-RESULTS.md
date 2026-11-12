# P05 evidence — CLOSED PASS

Real episode: `productions/computing-clearly/videos/001-api-request/` (ignored).
Created through P02 init-series/init-video. English, 202 words; completed final
85.5 seconds at 1280x720/24fps. User explicitly approved plan and real preview.

- User required Series ownership correction, then explicitly replied “Approved”.
  `plan-approval.json` hashes plan/script/visual plan/brief/metadata/bible/config/shared.
  Plan fingerprint: `87e25351cf9013981064312c8207331cc18dc1922e81a08f1f50678b6f10df36`.
- P04 fixture imported episode-locally and promoted using P02 into this Series.
  Original/import/promoted package content hash identical:
  `ddb500feebc422bb79ec2a94b41200bb9cfdbc7321d055126e1f1809012a2c7a`.
- One OpenAI built-in image-tool call; original symbol board and six crops plus
  receipts under assets/generated/. Prompt saved in symbol-board.receipt.json.
  Exact tool model unavailable. No alternate provider, generation retry or asset replacement.
- ElevenLabs timestamps endpoint: initial HTTP 402, preserved failed attempt.
  User said “try again”; one explicitly authorized retry succeeded. Voice
  `DODLEQrClDo8wCz460ld`, model `eleven_multilingual_v2`, exact script sent.
  Audio duration 85.495873s. Script SHA256:
  `884ab81123fe55650a532a3007a8e88bb1cd0ca8bead47aa8c5b682c36ef4550`.
  Audio SHA256: `a649806f49ddfcebb5e867401a9d6f3b6c3a573f0d62c856920f807de205d555`.
  Unchanged voice rerun returned reused=true, making no additional API request.
- Original provider alignment: 202 words, 34 upstream-grouped captions, SRT/VTT.
  Seven authored semantic scenes follow measured paragraph/word timing; frame
  rounding yields 85.5s without voice stretching. Current-Series host performs
  LOOK_AT/POINT_AT/IDLE; ordinary sprites show phone/server/data/request/response.
- Preview `preview/run-jhCCLv/preview.mp4`: 29.25s opening, 702 frames, H.264/AAC,
  1280x720/24fps, actual voice and burned Noto Sans captions plus procedural click.
  SHA256 `2e68faac2db0950d37f17f83afd16d7cbbefef04725d553441de8e9707e16cef`.
  Full decode/probe PASS; no detected black intervals; peak -3.1 dBFS, mean -25.7 dBFS.
  Six sampled frames inspected for missing assets, limbs, pointing, caption placement
  and aspect. User then explicitly accepted this creative/technical baseline,
  including simple fixture character, abrupt transitions and no lip sync.
- Node tests: 21/21 PASS (`produce`, `production`, Unity `render` and `animation`).
  Plan/script/shared mutation invalidates paid gate; preview/movie/scene/caption/
  asset/audio mutation invalidates final gate; cross-Series references refused.
  Mock adapter preserves exact text, audio/alignment and makes no automatic retry.
- Separate `productions/p05-local-smoke/` synthetic fixture exercised real Unity
  preview/final assembly, caption burn-in, audio mux, decode and unchanged final reuse.
  It is explicitly test-only, uses local tone, and is not the acceptance episode.
  An initial smoke failure caught Unity's diagnostic whitespace rewrite; excluding
  non-rendering ProjectAuditorSettings resolved it. Original tracked bytes restored.
- Real preview rerun reused its output. Real final command refused before approval.
  After explicit approval, the unchanged seven-scene timeline rendered successfully.
  Seven image receipts verified against files.

## Final production and closure

- Explicit full-production approval recorded in preview/preview-approval.json.
  Bound production input fingerprint:
  `18a2e2aeffb4e2420870a6ce3cbb0db4da0cf838106d964a820f114206005a51`.
  Approval record fingerprint:
  `79e1ec7b28047027adf878855ee281df1c5cb7653f71f2f66fdc15e5d13d26ad`.
- Final: output/final.mp4, 85.5s, 1280x720, 24fps, 2,052 decoded frames, H.264/AAC.
  SHA256: `dbf5891c36c8fa9d817212b9448bc69f29644a9513fe879024373f5b0b5f8d70`.
  Final SRT SHA256: `733608470cd63065f9d7e80f116e1b0b678ecf65052f17321bea2f2623e215e4`.
  Final VTT SHA256: `548ad9c5180a9e6d0599aa0c92247342b320cf9b65ad304b66b2f0b62b803d2c`.
- reports/final-report.json records source/script/audio/asset/scene/engine hashes,
  approval fingerprint, dimensions, frames and full decode. Additional measured
  checks and frame-preservation evidence: reports/final-verification.json.
- All first 702 final Unity PNG frames match approved preview frames byte-for-byte;
  encoded preview bytes remain unchanged. No approval-sensitive input changed.
- Full FFprobe/count/decode PASS. Audio stream duration 85.5s covers preserved
  85.495873s narration. Final caption ends at 85.228s; all 34 cue texts together
  match the entire exact script after whitespace normalization. No truncated ending.
- No black intervals detected (0.1s minimum). Audio peak -3.1 dBFS, mean -25.2 dBFS.
  Fifteen decoded frames across all seven scenes visually inspected: no obvious
  missing assets, detached limbs, incorrect aspect or caption collisions.
- Unchanged final rerun reused output bytes; unchanged narration rerun reused saved
  audio. Image receipt hashes still match; zero new provider calls during final
  production. Original P04 fixture and imported/Series-owned copies preserved.
- No engine expansion, second provider, infrastructure, publishing or post-MVP work.
  Accepted MVP limitations: simple fixture character, abrupt pose transitions,
  no lip sync. OpenAI tool model ID is unavailable; image generation remains a
  Codex tool boundary. Approval is a local human record, not authentication.
- Phase start: fb75826e6c0b1fa0f02d750ae1305be564d1b40e. Commits: planning 64aee5c,
  implementation 6e81611, preview handoff 9217565, followed by this closure commit.
  Resolve final SHA via git rev-parse HEAD and verify it equals origin/main.
  Secrets/media/caches remain ignored. No upstream code/license/catalog changed.

MVP CLOSED — await next product decision

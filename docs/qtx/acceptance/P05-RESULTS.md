# P05 evidence — partial, preview gate

Real episode: `productions/computing-clearly/videos/001-api-request/` (ignored).
Created through P02 init-series/init-video. English, 202 words; intended final
85.5 seconds at 1280x720/24fps. No P05 final acceptance or closure yet.

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
  and aspect. Human listening/creative approval remains required.
- Node tests: 21/21 PASS (`produce`, `production`, Unity `render` and `animation`).
  Plan/script/shared mutation invalidates paid gate; preview/movie/scene/caption/
  asset/audio mutation invalidates final gate; cross-Series references refused.
  Mock adapter preserves exact text, audio/alignment and makes no automatic retry.
- Separate `productions/p05-local-smoke/` synthetic fixture exercised real Unity
  preview/final assembly, caption burn-in, audio mux, decode and unchanged final reuse.
  It is explicitly test-only, uses local tone, and is not the acceptance episode.
  An initial smoke failure caught Unity's diagnostic whitespace rewrite; excluding
  non-rendering ProjectAuditorSettings resolved it. Original tracked bytes restored.
- Real preview rerun reused its output. Real final command refused before approval;
  no acceptance `output/final.mp4` exists. Seven image receipts verified against files.

Pending: explicit real preview approval; final render/probe/decode/report; final
visual/audio review; clean-tree/remote closure agreement. No MVP PASS claim.

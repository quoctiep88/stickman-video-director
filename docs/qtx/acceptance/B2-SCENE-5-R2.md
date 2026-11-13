# B2 Scene 5 R2 — authoring and asset recovery

Human rejected R1 for artistic parity. Classification B2 AUTHORING / ASSET-PACK FAILURE. The native upstream runtime is accepted and untouched.

R1 Shot 2 exposed disconnected hands/paper on an empty field. Shot 4 used an oversized cropped carriage. Dense watercolor scenes depended on crops. R2 uses two newly authorized production boards with sparse flat shapes, simple Maya and purpose-built settings. The tabletop includes the timetable, table edge and cup. The full carriage settles inside the platform frame with both ends and the bicycle symbol visible.

## Assets and budget

Two built-in image_gen calls, no retry, no ElevenLabs or other paid calls. Both used the approved upstream B2 board as a visual reference. Board B additionally used Board A for consistency. Model identity was not exposed. Exact prompts and receipts are in the local preview generation-plan.json and generation-receipts.json.

Board A SHA256 79a0cbee6673f6246f61d64f75209f425b51b80ceddc4baf64aca1fdb3727353.
Board B SHA256 0fcdfb937bb2b305540056fcaa1dc08bc98b92d26c8f292a6148dd8ecd26cdc0.

Assets in assets/generated/b2-r2. Board A crops are reading Maya, standing phone Maya, timetable, phone, note, keys and pencil. Board B crops are kitchen, complete tabletop, platform, full train, folded map and arch. Deterministic background flood masks isolate complete figures/props. Native gaze animation uses locally derived head/body alpha masks. Source boards remain intact.

Final-scale QA inspected complete bodies and stool, matching dark forelock/teal/brick identity, full carriage ends/wheels, readable bicycle icon, sparse backgrounds and crop edges before authoring. Thirteen base crops inspected across crop-qa-a.png and qa-*.png. A small timetable-edge inclusion in the reading head mask was found during encoded inspection and corrected locally. No provider retry. No crop required replacement generation. Keys and standalone timetable remain unused.

## Native project

productions/everyday-ai/videos/001-ai-internet-habits/preview/upstream-b2-r2/project.json
Authored from scratch as native version 1 style B2, with the exact previous narration excerpt and all 14 caption cues.
Renderer skills/directing-stickman-videos/scripts/autopilot-render.mjs.
CLI autopilot.mjs preview PROJECT --seconds 24.8.
Project fingerprint 7aa5b4b81763a073fbab57c06550cc7694d2c779568d3fd6171210bffc8739eb.

| Shot | Seconds | Composition and local action |
| --- | --- | --- |
| 1 | 0–2.44 | Sparse kitchen wide, seated Maya reading, small gaze change |
| 2 | 2.44–5.36 | Purpose-built table/timetable/cup close-up, pencil follows a stop |
| 3 | 5.36–7.24 | Brief platform establishing view |
| 4 | 7.24–9.12 | Complete carriage enters and slows, bicycle door is focal |
| 5 | 9.12–12.60 | Physical note settles beside arch, drawn pointer connects them |
| 6 | 12.60–16.56 | Standing Maya with phone, gaze change and question note settling |
| 7 | 16.56–19.80 | Map detail, pencil route develops toward bridge |
| 8 | 19.80–21.92 | Smaller map and phone, route connects to conversation |
| 9 | 21.92–24.80 | Kitchen return to Maya, map and better question |

Nine shots, maximum 3.96s, average 2.76s. Native smoothstep image keys and line progress provide motion. No runtime extension or global camera drift. Sound reuses the previous quiet procedural air bed and native paper accents at .48, 9.4 and 13.2s. These are designed textures, not recorded Foley.

## Encoded preview

preview/upstream-b2-r2/scene-5.mp4 is a byte-identical delivery copy of output/preview.mp4.
1280x720, 30fps, 744 frames, 24.800s, H.264/AAC, full decode pass.
SHA256 ab4063ad84d9dad4a96109ac11c41e987ea9f3e2e8ddcc3eaa68c49da95555ea.
Decoded peak -7.81 dBFS.
Native isolated-picture motion checks passed. output/preview-reference contains hash-bound evidence, 27 frames, nine continuous audible shot clips and an unknown review template.

## Reference comparison and limits

Compared chronological reference frames from both full public clips and the B2 approved board with R2 encoded contact sheets and full-size frames. This is sampled-frame review; continuous-playback and listening parity remain pending.

- Visual economy. Sleep uses spare room/prop/concept views. Phone/weather uses sparse room/table/diagram staging. R2 now uses flat fills, large negative space and economical silhouettes. Maya is a fuller simplified figure than their stick figures.
- Composition. Sleep alternates bedside, clock and concept shots. Phone/weather alternates room, phone and route views. R2 similarly alternates human, tabletop, platform, entrance and route, with complete bodies and a fully readable settled train.
- Editing rhythm. R2 uses nine 1.88–3.96s beats. The previous 5.36s map hold is split into map development and a map/phone connection.
- Motion. R2's encoded temporal evidence shows gaze change, pencil motion, carriage entry/settle, note placement and developing routes. Effect naturalness remains for human playback review.
- Sound. Existing narration and understated paper/air mix retained. Decode and level checks pass. Comparative sound quality has not been established by listening.
- Captions. Exact 14 original cues retain native B2 Noto Sans/40 ivory-label treatment, closely matching the phone/weather label grammar. Sleep's sampled subtitle appearance differs. No caption edits.

No artistic approval or independent pass is recorded. Actual MP4 review remains required.

## Preservation and Git

Original script, full WAV, five narration blocks, three original boards and their crops, captions, exact excerpt, rejected Unity preview and rejected native R1 pass hash checks. All tracked qtx and skills bytes match starting HEAD, including runtime, quality logic, Unity and Natural Narration. No asset promotion. Full episode remains stopped. Runtime tests were not repeated because runtime bytes are unchanged; native validation/render/motion/decode checks exercised this project.

Await human artistic-parity review of B2 Scene 5 R2.

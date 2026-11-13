# Everyday AI / 001 — canonical native opening ready for human review

The 2026-11-13 follow-up resolves the earlier interval-approval blocker by explicitly returning to upstream's opening-prefix workflow. No interval support, approval schema, runtime wrapper or approval bypass was added. **STOP: no native approve or full render.**

Episode root: `productions/everyday-ai/videos/001-ai-internet-habits/`.

## Canonical complete project

- `project.json`: 184.96 seconds, eight narrative scenes, 62 shots; all assets, original narration, 92 exact-word caption cues and native sound tracks present.
- Full native validation: PASS, fingerprint `c5e6230700bae8a454b83e37aecbcd2c7494c29c3399e4863bc6c807390dc96e`.
- Project file SHA256: `50905fb16f562158d1257e16ec4762d1cac5471ddf0d66112376f04889597cab`.
- Shots span 1.88–4.24s, mean 2.983s. Narrative boundaries: 0, 17.12, 46.08, 68.4, 91.04, 115.84, 139.6, 162.8, 184.96s. Narration blocks are independent of this scene/shot structure.
- Native validation paints every full-project caption and checks media/motion coverage. Later shots are authored and validated, not yet encoded or human-reviewed.

## Canonical opening

- `output/preview.mp4`: actual canonical prefix **0–43.5s**, 15 shots, 20 cues, 1,305 frames, 1280×720, nominal 30fps, H.264/AAC.
- SHA256: `d0053254e5e419eedc64ca7e076d399f9d056ec4c32a46972c0d621a994ef3e3`.
- Native scoped preview fingerprint: `3e1fbcf564fd57a67a160476df851e97040da3dc0fde56439a5c8ec09ef17e89`. Upstream scopes its preview fingerprint; the separately recorded full-project fingerprint and file hash identify the complete canonical source. Neither hash is fabricated or substituted for the other.
- Native and separate full decode PASS; no black intervals detected. Video stream duration is 43.499674s, container/audio 43.5s; native mux reports nominal 30/1 and average 4008960/133631. No finishing/runtime alteration was made.
- Unchanged narration dominates objective waveform comparison: correlation 0.999517, fitted gain 0.998902, residual including SFX/AAC roughly 30dB below narration RMS; encoded sample peak −5.8dBFS. This is not a listening-quality certification.
- Native SRT/VTT, preview report, encoded shot evidence and unknown independent-review template remain under `output/`. No `approval.json` or `film.mp4` exists.

## Assets and preservation

Two built-in image-generation attempts, two successes, zero failures/retries; zero ElevenLabs/other paid calls. Prior provider history remains separate. New boards: `assets/generated/b2-full/board-c.png` (laptop/bicycle contact poses and everyday props) and `board-d.png` (towpath, bridge, cyclist and blank paper/browser/source artwork). No more calls needed. Exact prompt text, receipts, crop boxes and hashes are in `reports/native-full/`.

Reused R3 kitchen, platform, train, map, entrance arch, reading/phone Maya poses and derivatives, note, phone, pencil and timetable treatment. All nine Scene 5 shots retain the accepted picture choreography; only global timeline offset, relative asset paths and unique layer-ID prefix changed. No approved files were regenerated or replaced. No Series promotion.

**REPRESENTATIVE B2 PASS** remains historical mid-film quality evidence, SHA256 `d1c2fac2d87bc3c7ab35ba0acf4cbb242915cbdee3252d372c2a77f29124ea81`; it does not approve this opening. Style-lock hash remains `1d4906c0503220a006389e68b2df41121efc4ef07be208e62350e623fba0abb1`.

Existing Lauren B / ElevenLabs `eleven_v4` narration remains SHA256 `56e2cb184d56881aa85f6adf7952eac86a74f6282056fc47708eb58c4f458326`. All original five block recordings/responses and exact 519-word script preserved by hash. Captions use original provider character alignment and assembly offsets; tiny provider boundary spill is capped at the next block/end, without changing audio. Scene 5 uses its exact accepted cues rebased. Final cue ends at 184.96s.

## Opening inspection and limits

Inspected all 15 encoded shot midpoint frames, targeted full-size frames and selected start/mid/end temporal samples. Ivory grain, irregular dark ink and muted teal/brick/ochre/blue remain visible. Maya retains the swept forelock/low ponytail, teal overshirt and brick trousers. New contact poses keep hands attached to their props. Crops retain whole silhouettes and clean gutters; clock crop trimmed to exclude the next cell. Locally typeset words are separate from generated artwork.

Opening moves from kitchen/bicycle to river map/train, back to Maya, then browser/photograph/rules, forum, station/door and the remembered video beside Maya. Native rolling local-motion checks pass; temporal samples show route drawing, train travel, page movement and subtle gaze changes. No global pan/zoom substitutes. Captions remain clear below action in inspected frames. QA corrected train placement, a seated pose under the word “standing,” and the remembered train's browser framing. Earlier authoring encodes preserved under `preview/native-opening-authoring-v1/` and `v2/`; these are not R4 or replacements of R3.

The side-on train against the perspective platform remains a stylized spatial compromise. Continuous audiovisual playback/listening and independent reference-effect acceptance have not been performed or claimed. The unknown native review template remains unknown. Opening approval will not imply every later shot was human-reviewed.

Machine prerequisites: installed WinGet FFmpeg/FFprobe 9.0.2 discovered and passed to native CLI with `FFMPEG`/`FFPROBE`; sandboxed Node child spawning returned EPERM, resolved through approved elevated execution. No installation/upgrade. Runtime, Unity, other Series and Natural Narration untouched.

Durable episode records: `reports/native-full/qa.json`, `validation.json`, `probe.json`, `shot-ledger.json`, `sound-script.json`, `preserved-authorities.json`, image prompts/receipts, all-shot sheets and temporal samples. Production media remain ignored by Git.

**Next: Await human approval of the canonical native-B2 opening preview.**

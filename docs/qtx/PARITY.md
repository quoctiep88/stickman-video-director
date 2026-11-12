# P01 upstream parity reference

Audited 2026-11-12 against upstream `105b134f80fa11abe7a012f713712d39f20936f3`; starting QTx `79e06cf8258b09458b51ac5dd8b6948ce4da8bb7`. Paths below are under `skills/directing-stickman-videos/` unless qualified. This is a navigation/evidence map, not a replacement style catalog. No external generation or P02 implementation.

## Styles and route contracts

A1–A5 share agent-authored proposal → actual approval → standalone approximately ten-second prompts with exact audio-only narration and frozen voice/character blocks. Normal deliverable is a prompt package, not a bundled video renderer. `SKILL.md`, `references/storyboard-template.md`, `voice-continuity.md`, `omni-flash-prompt-contract.md` govern output; changed global direction requires reapproval. Optional reference images do not guarantee continuity.

| Style/use | Visual/asset contract and important difference | Source; evidence |
| --- | --- | --- |
| A1 Classic Black & White: explanations/ideas | Hollow head, monochrome line figure, light/dark polarity, up to three prop accent colors; repeated anchor, no generated text. | `references/style-catalog.md`; approved RAM proposal + three standalone prompts in `docs/qtx/acceptance/`. |
| A2 Modern Pop: tech or narrative stories | Red beanie/yellow shirt; 2A white high-key grid/glass UI versus 2B colored cinematic environments. | `references/style-catalog.md`; routing/contract inspection, preservation checks. |
| A3 Prehistoric Cave: comic analogy | White filled expressive heads, animal hide, earthy cave world; cast-specific setup/escalation/ironic payoff overrides generic discussion ending and pacing. | `references/prehistoric-dark-comedy.md`; source inspection, A/B preservation check. |
| A4 Cozy Storytelling: everyday reflective stories | White filled cartoon characters, dark limbs, colored 2D locations; new recognizable location each segment unless approved otherwise; prop/narrator continuity across cuts. | `references/cozy-storytelling.md`; existing guidance verification passes. |
| A5 Historical Cartoon: history/daily life | Era pack, period clothing/scenery, connected short white neck, expressive face, compact black fingerless palms; cast cards, era music; reference-view advice is optional. | `references/historical-cartoon.md`; existing guidance verification passes. |
| A6 Amber Noir: illustrated narrative acting | Matte-black heads/necks, cream eyes, angular contours, amber light/plum shadows; shot first-frame references, independent Puck narration, no inherited ten-second recipe. | `references/amber-noir.md`, `a6-reference-prompts.md`, `a6-finishing.md`; three reference hashes and 48-frame synthetic finishing pass. |
| B1 Minimal Line Art: factual explanation | Bundled pose atlas/crayon props, clean monochrome/grid, handwritten headings; original voice, local meaningful prop/actor motion. | `references/b1-minimal-handdrawn.md`, `assets/b1/`; 33.33s local acceptance under `productions/p01/b1`. |
| B2 Colorful Hand-Drawn: varied explanatory/story settings | Warm paper, irregular ink, muted colorful independent art, no B1 atlas/grid; fresh staging per story; dark single-line captions on ivory label, size 40. | `references/b2-colorful-handdrawn.md`, `assets/b2/approved-style-board.*`; existing background/caption/style-switch tests pass. |
| B3 Retro TV: editorial explanations/stories | Authored numeric shapes/paths, local group/pivot action, layered poses; television finish; own reference pack, not B1 art. | `references/b3-television.md`, `scripts/b3-graphics.mjs`; pivot, nested media, finish/cache and original audio tests pass. TV pass adds blur/offset ghost, scanlines and vignette before clean captions; no random full-screen glitch. Private source comparison unavailable. |
| B4 Survival Thriller: causal survival/horror stories | Locked white-glove references, meaningful shots <=3s unless approved hold; fixed Nunito hook, left shadow/setup/payoff and visible threat/action; Brian identity default. | `references/b4-survival-storytelling.md`, `b4-audio-direction.md`, `b4-opening-direction.md`; style-lock/opening pixel/encoded audio tests pass. |
| B5 Character Explainer: presenter + physical-comedy explanation | Warm paper/dark ink/red accents, presenter bottom right, anonymous code-animated left actors, Instrument Sans/Anton, <=3 semantic caption lines. Dedicated trusted scene code; no B1–B4 alias. | `references/b5-character-explainer.md`, `b5-production-gate.md`, `b5-left-stage-motion.md`; four-frame smoke and baseline/production tests pass. |

B1–B4 share `scripts/autopilot.mjs` validate/preview/approve/render and `autopilot-core.mjs`/`autopilot-render.mjs`. B1/B3 single-line Noto Sans size 34, B2 size 40; B4 keeps its separate hook typography and common subtitle handling. Selected original-rate voice, sound-led scene planning, continuous motivated bed/cuts and causal SFX are required; sample voice credits are not universal defaults. B4 Brian substitutions require explicit override. All need actual encoded preview review/approval before CLI full render. B1–B3 require meaningful local motion, not global camera drift; B4 allows held poses with meaningful visual changes. These routes share shot caching below. B5 does not.

## Actual lifecycle and ownership

1. Agent researches brief/topic, writes exact script and visual/sound plan, chooses route/style, obtains required creative approval. No local topic-to-film generator exists.
2. External tool or supplied local file provides narration; voice duration leads the timeline. Agent corrects/aligns words and authors semantic cues. `align_captions.py` optionally transcribes local audio using cached Whisper (`--allow-model-download` explicitly required to fetch a model). No Whisper model installed for P01.
3. `autopilot.mjs captions WORDS OUTPUT` consumes `{words:[{start,end,word}]}`. `groupWords` flushes at sentence punctuation, gap >0.4s, eight words, >3.5s or >58 characters. This heuristic is not semantic understanding: agent review/splitting is still required. JSON cues use start/end/text; scene start/end must fit voice+lead+tail, not automatically derive content from captions.
4. Agent plans assets, obtains generated/supplied PNG/JPEG and authors `project.json` shots/layers, keys, captions and sound tracks. B1 may resolve `@b1/` resources. External image tools do not author animation logic automatically.
5. Local validation checks timeline/media/style/fonts/motion; preview scopes inputs to the selected interval (default 20s). Canvas generates frames, FFmpeg encodes shot cache, assembles original-rate audio/SFX, burns captions, exports MP4/SRT/VTT/contact sheet/report and decode-checks.
6. Human reviews encoded picture/audio; CLI `approve PROJECT --note TEXT` records genuine approval. `render PROJECT` verifies current preview/hash then produces full film. Final report is technical evidence, not creative acceptance. SFX/mix and burned captions occur within rendering, not a separate automatic post-production agent.
7. A1–A5 instead stop at standalone prompts; external video generation/editing follows separately. A6: agent orchestrates approved first frames/clips (Flow recommended, Renoise optional), independent narration, edited picture and synchronized mix; `a6_finish.py` adds title/active-word captions and exports final MP4/SRT/proofs/manifest. It does not generate clips, synthesize voice or add SFX itself.

## Source of truth and entry points

| Concern | Authoritative path |
| --- | --- |
| Routing/style contracts | `SKILL.md`, `references/mode-execution-boundaries.md`, selected style reference above; `autopilot-runtime.md`, `autopilot-production-qa.md`, `autopilot-sound-system.md` |
| B1–B4 authored project | External project `project.json`; schema/validation in `scripts/autopilot-core.mjs`, `b-style-quality.mjs`, B4 helpers |
| Assets/audio | Actual local paths in manifest (or bundled `assets/b1`); input SHA256 values in report, never output as source |
| Caption source/output | `project.json` cues; optional words JSON; `output/preview.srt/.vtt`, `film.srt/.vtt`; burned into corresponding MP4 |
| Approval | `output/approval.json` plus `output/preview-report.json` and actual `preview.mp4` bytes |
| Render/evidence/cache | `output/film.mp4`, `film-report.json`, `film-contact-sheet.png`, `checkpoint.json`, `render.lock`, `cache/<key>.mp4` |
| B5 scenes | `scene/renderer.cjs` and local modules, `config.json`, `word-timings.json`, `caption-groups.json`, `speech-levels.json`, asset/font atlas; new stories `scene/production.json` |
| B5 locks/entry | `assets/b5/baseline-lock.json`, `assets/b5/local-baselines/jensen-v13/`; `scripts/character-explainer.mjs`, `b5-production-quality.mjs`; output `frames.json` fingerprints/files |
| A6 reference/finish | `assets/a6/reference-manifest.json`; `scripts/a6_reference_check.py`, `a6_finish.py`; project-specific finish JSON and output `manifest.json` |

B5 frame code is explicitly trusted with `frames PROJECT_DIR --output NEW_DIR --frames 0,128,390,580 --trusted-code`; `--all` makes a full sequence. `encode` takes frames, approved mix and `--approval-note`. It validates scene/input/frame evidence and refuses incomplete sequences/overwrites. Baseline locks protect byte-identical historical assets; new scenes need production evidence, approved presenter asset, caption fonts, sound rights/review and motion. Agent authors interactions, timing and audio envelope; no arbitrary-avatar rigging, phoneme-accurate lip sync, topic scripting, mixing or paid generation is automated. New presenter requires static approval and speaking test. Baseline is landscape; portrait remains upstream pending.

## Approval and cache semantics from code

`loadProject` SHA256 fingerprints scoped timeline/global properties, range end, referenced asset/audio/font bytes and engine source hashes. CLI also requires preview path, report fingerprint and actual preview SHA256 to agree. `approval.json` stores preview_fingerprint, preview_seconds, preview_sha256, note and approved_at. Reviewed content/global changes invalidate; changes exclusively beyond the reviewed interval can remain valid. A note is evidence recorded by the agent, not an authentication service. No gate weakened.

Renderer caches completed shot MP4s using shot data, frame bounds, style/TV, dimensions/fps, overlapping captions, grid/caption size, referenced image/font bytes and renderer hashes. Hits are probed for frame count, not a cryptographic validation of cached video pixels. Audio-only edits require approval/reassembly but can reuse silent picture shots. Caption changes invalidate overlapping shots; asset/shot changes invalidate dependents; style/resolution/engine changes broaden invalidation. Identical final fingerprint+file hash returns `reused:true` without overwrite. Partial shot files are not accepted; completed cache survives failure; `checkpoint.json` records stage and a stale process lock can be recovered. Existing upstream resume and tail-edit tests pass; no forced process-kill experiment performed.

## Audio, provider boundaries and Windows

FFmpeg mixes original-rate narration with optional music, ambience, dialogue, file/procedural tap/paper/pop/chime/jingle SFX; cuts mute backgrounds, preserve speech; limiter caps mix, AAC 192k final audio, H.264 video, full decode check. Premixed `contains_sfx` forbids duplicate tracks. B4 has first-frame audio/early-speech checks, causal SFX and Brian metadata (metadata does not authenticate voice). A6 accepts synchronized edited picture + approved mix, copies AAC packets or encodes non-AAC once; uppercase positional highlights use corrected words. B5 accepts an already authored mix.

| Boundary | Input → output/location; integration |
| --- | --- |
| Image | Prompt/reference → PNG/JPEG local manifest paths; B5 raster/rig assets with provenance and hashes. Agent-selected providers allowed. Optional `gemini-media.mjs image` is fixed Gemini endpoint, explicit model/network authorization, receipt/no automatic retry. |
| Voice | Exact script/named voice → local decodable narration file; optional Gemini adapter wraps PCM as WAV. Supplied audio/provider-neutral runtime; B4 Brian default, A6 Puck default. P01 uses local Windows speech only. |
| Video | Approved standalone A prompts or A6 first-frame/action references → external clips; agent edits local montage. No bundled general video-generation API. Historical A6 sample Veo 3.1 Fast provenance is not current access verification. |
| Alignment | Audio → corrected word JSON via supplied timestamps or optional Whisper; agent semantic review. P01 evenly distributed word fixtures use measured sentence audio spans, not claimed ASR alignment. |

Only runtime fix: B5 `exactLegacy` converts `path.relative` separators to manifest slashes before exact comparison; file hashes unchanged. Existing legacy-accept/changed-scene-reject test is regression coverage. POSIX behavior unchanged. B4 font assertion now uses basename; B5 baseline test normalizes separators. A6 synthetic test explicitly passes bundled NotoSans font paths instead of assuming macOS fonts. Production A6 defaults/visual contract unchanged: Windows has Impact, but DIN Condensed Bold or an explicitly approved substitute still must be provided. No silent font substitution or symlink privilege changes.

## Updates and evidence

New styles typically touch SKILL routing, references, assets/examples, runtime style dispatch/specialist modules, tests and multilingual README galleries. Future QTx work belongs in `qtx/`/ignored `productions/`, avoiding catalog duplication. Conflict hotspots: core style dispatch, font/style gates, shared renderer and baseline locks. Procedure: fetch upstream → inspect changes/licenses/styles → merge on reviewable branch → baseline smoke → QTx smoke → record reviewed baseline. P01 does not merge beyond P00. No updater built.

Executed: Node 197/200 pass, three symlink EPERM failures; Python 19/20 pass, one symlink privilege error; root verify scripts 11/13 pass, two unchanged stale milestone/readme assertions. A6 three references pass and offline 48-frame finish verifies text/timing guards, repeated-word highlighting, AAC preservation, decode, SRT and no-overwrite. Doctor seven checks pass. B3/B4/B5 focused tests are included in those totals, not additional independent totals. B5 four selected frames also rendered into `productions/p01/b5-frames`.

Director proposal was explicitly user-approved in this chat; three prompts delivered as committed text fixtures. B1 local assets and logs remain ignored under `productions/p01/` / `%TEMP%/qtx-p01-*`. Preview rendered 20s; full acceptance and gate evidence recorded in the acceptance result once complete. No physical listening or public release approval claimed. External services remain untested; B3 private source unavailable; B5 portrait not established upstream.

# P00 upstream architecture inventory

Audited at `105b134f80fa11abe7a012f713712d39f20936f3` on 2026-11-12. Paths below are relative to `skills/directing-stickman-videos/` unless stated otherwise. This is a navigation summary, not a replacement style catalog or a claim of production parity.

## Structure and authority

Repository root holds multilingual READMEs, MIT LICENSE, showcase `assets/`, historical `docs/superpowers/`, README maintenance `scripts/`, and static/behavioral `tests/`. The single installed skill contains `SKILL.md`, `agents/openai.yaml`, references, runtime scripts, assets/fonts, examples, tests and the npm lockfile. There is no application server or database.

Start with `SKILL.md`, `references/mode-execution-boundaries.md`, and `references/getting-started.md`. A1–A5 use `style-catalog.md`, `storyboard-template.md`, `voice-continuity.md` and `omni-flash-prompt-contract.md`; specialist style references override generic rules within their scope. B uses `autopilot.md`, `autopilot-runtime.md`, `autopilot-production-qa.md` and `autopilot-sound-system.md` plus the selected style reference.

## Verified style families

Cross-checked the root `README.en.md` gallery against SKILL routing and the references below. There are **11 families**, not 11 independent runtime presets. A7 is a coming-soon placeholder, not supported. A1 themes and A2 variants are included in their families.

| ID | Public name / internal mapping | Authoritative reference |
| --- | --- | --- |
| A1 | Classic Black & White / Style 1 Classic Minimalist, light and dark | `references/style-catalog.md` |
| A2 | Modern Pop / Modern Beanie Zeke; A2.1 Minimal Tech = Style 2A Modern Studio Tech; A2.2 Colorful Story = Style 2B Cinematic Story | `references/style-catalog.md` |
| A3 | Prehistoric Cave / Prehistoric Hand-Drawn / Dark Comedy | `references/prehistoric-dark-comedy.md` |
| A4 | Cozy Storytelling | `references/cozy-storytelling.md` |
| A5 | Historical Cartoon | `references/historical-cartoon.md` |
| A6 | Amber Noir | `references/amber-noir.md`, `a6-reference-prompts.md`, `a6-finishing.md` |
| B1 | Minimal Line Art | `references/b1-minimal-handdrawn.md` |
| B2 | Colorful Hand-Drawn | `references/b2-colorful-handdrawn.md` |
| B3 | Retro TV | `references/b3-television.md` |
| B4 | Survival Thriller | `references/b4-survival-storytelling.md` and B4 audio/opening/repeatability references |
| B5 | Character Explainer | `references/b5-character-explainer.md`, production gate, left-stage motion and accepted baselines |

## Workflows

**A1–A5 Director:** resolve source, ratio and style; default 60 seconds with ten-second clip units. Produce a proposal/storyboard with frozen voice and character direction, wait for actual approval, then deliver standalone clip prompts. Changed global direction invalidates the proposal approval. Generated clip execution/editor finishing is external. Narration is audio-only in the generation prompt; optional overlays are separate. Do not impose B captions or provider defaults on this route.

**A6:** separate approved proposal/reference-guided shot workflow; Flow is the recommended route, Renoise MCP an explicit alternative. Sample provenance is Veo 3.1 Fast, up to eight-second clips, independent Gemini Puck narration and local finishing. `scripts/a6_reference_check.py` verifies bundled reference integrity. `scripts/a6_finish.py` assembles media with uppercase active-word captions, title and SFX. A6 does not inherit A1–A5 ten-second rules. Provider access and actual generation remain unverified in P00.

**B Autopilot:** agent researches/plans and authors files; the CLI does not invent a film from a topic. Confirm script/design/voice, establish original-rate narration, align captions, author images and meaningful local motion, then produce approximately 20 seconds with sound. Review actual encoded picture/audio and obtain user approval before full production. Complete later shots and verify the whole film. Native 16:9/9:16 compositions are required, not stretching/cropping; B5's accepted baseline is landscape only and portrait acceptance remains pending upstream.

**B5 exception:** `autopilot.mjs init --style B5` scaffolds a separate code-authored route. `character-explainer.mjs` checks/validates, renders frames with explicitly trusted reviewed local code, then encodes with production evidence and actual approval. A new complex/real-person presenter requires generated or approved raster art, static approval and a short speaking test; the left stage remains anonymous code-animated stickmen. It is not arbitrary-avatar auto-rigging. `b5-production-quality.mjs` validates assets, captions, sound and motion evidence. Do not route it through B1–B4's manifest renderer.

## Runtime and media

- `scripts/autopilot.mjs`: doctor, probe, init, captions, validate, preview, approve, render. `autopilot-core.mjs` validates local declarative manifests, timing, media, style rules and hashes. `autopilot-render.mjs` paints Canvas frames, encodes H.264 through FFmpeg, mixes audio and exports MP4, SRT/VTT, contact sheet and verification report.
- `b3-graphics.mjs`: B3 paths/shapes/pivot groups and TV finish. B1 uses its pose atlas; B2–B4 require independent artwork. B4 runtime/style-lock/opening helpers preserve its own references, Brian voice contract and encoded opening checks. `b-style-quality.mjs` and motion geometry helpers enforce scoped technical gates.
- Voice sets timing; pictures fit speech. No automatic speed/pitch changes or revoicing. B1/B2/B3/B5 example voice credits are not mandatory services; B4 defaults to Brian with explicit override support. Supplied audio is valid. `gemini-media.mjs` is an optional fixed-endpoint image/speech adapter with explicit network flags, selected model/voice and no automatic paid retries. Other tools can supply compatible local media; no QTx adapter was added.
- `align_captions.py` optionally uses Whisper with an already cached model; supplied aligned word timestamps need no Whisper. The CLI groups real word timings. B1–B4 use one semantic caption line; B5 allows up to three. Fixed fonts and safe bounds remain style-specific.
- Shared B1–B4 audio supports local ambience, dialogue, licensed music/file SFX, procedural tap/paper/pop/chime/jingle and motivated audio cuts. Native voice rate is preserved; already mixed masters cannot receive duplicate sound layers. Human listening and rights review remain necessary.
- Shared rendering caches shots by content/assets/captions/fonts/style/renderer/timing, probes cache hits, records `output/checkpoint.json` and uses a local process lock. Re-run the same command to resume. Preview approval binds sample bytes, scoped content and global settings including narration; later-only edits need not invalidate it. Changed accepted content requires re-review. Outputs refuse overwrite unless explicitly requested. B5 has separate frame/asset evidence; do not assume shared shot-cache semantics there.

## Dependencies and reproducibility

From the skill directory: `npm ci`, `npm run doctor`, `npm test`. Node >=20; lockfile dependencies `@napi-rs/canvas` 0.1.100 and `sharp` 0.35.5; local FFmpeg/FFprobe. Bundled fonts have licenses; A6 finishing additionally imports Pillow. Python supports A6/reference/static checks and optional Whisper alignment. No root npm project exists. Use LF checkout bytes (`git config core.autocrlf false`) for fingerprinted text resources; this is local configuration, not an upstream source change.

Image/video/TTS generation needs a configured native tool, authenticated interface or authorized provider integration; installation and doctor do not verify quota or billing. No paid calls, new production or large media generation occurred in P00. See [BASELINE](BASELINE.md) for actual results and Windows issues.

## Update boundary

New styles likely touch SKILL routing, style references, runtime style dispatch/specialist modules, assets/examples/tests and multilingual README galleries. Preserve all of these, bundled locks, credits and fonts; do not copy the catalog into QTx code or move upstream directories. Keep future QTx code in `qtx/` and productions outside the installed skill in `productions/`. Historical superpowers docs and test reports are evidence, not new scope authorization.

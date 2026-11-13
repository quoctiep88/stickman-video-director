# QTx production MVP (P05)

Codex writes and directs; local files hold state; Unity executes semantic scenes.
The upstream routes and their approvals remain unchanged. P05 uses one image tool
(OpenAI), one TTS provider (ElevenLabs), Unity and FFmpeg. No service or workflow framework.

## Practical flow

Create a Series and episode through `qtx/production.mjs` as described in
[Series workflow](SERIES-WORKFLOW.md). Ask Codex: “Create this episode, topic X,
target 90 seconds, English, using the Series style.” Codex runs the commands below;
the user need not operate the internal tools manually.

1. Read Series bible/config, current brief/metadata and relevant shared inventory.
   Read the Series narration profile, research the facts and write a factual draft. Apply the [Natural Narration skill](../../skills/qtx-natural-narration/SKILL.md), read aloud and audit the Series voice before submitting for approval.
   Write `plan.md`, exact narration in `script.md` (no headings/stage directions),
   and `visual-plan.md`. `produce.mjs plan SERIES EPISODE` reports that context.
2. Present those files and stop for explicit human approval. Only after approval,
   `approve-plan SERIES EPISODE --note TEXT` writes `plan-approval.json`.
3. `check-plan` verifies the gate before image generation or voice spending.
   `voice` sends the exact UTF-8 script, including whitespace, to ElevenLabs once.
4. `timing` converts original provider character alignment to `audio/word-timings.json`,
   `audio/captions.json`, `audio/narration.srt` and `.vtt`. It reuses upstream
   `groupWords`; no Whisper or second caption-grouping system. Codex may adjust the
   canonical caption groups. Final subtitles and burned captions use those groups.
5. Author `unity-project.json` and scene JSON against measured voice timing.
   Supported P04 actions and P03 sprite objects use the existing contracts.
6. `preview --seconds 29.25` captures only an opening prefix (20–30 seconds), with
   actual audio, burned Noto Sans captions and optional local SFX. Codex inspects it.
7. Stop and present the preview for explicit human creative/technical approval.
   `approve-preview --note TEXT` records that actual decision. Never auto-approve.
8. `render` requires that approval and produces `output/final.mp4`, `.srt`, `.vtt`
   and `reports/final-report.json`. Probe and full decode are mandatory.

Command prefix: `node qtx/produce.mjs COMMAND SERIES EPISODE`. For local `.env`
configuration, use Node 20.12+ / 22: `node --env-file=.env qtx/produce.mjs ...`.
Environment variables inherited from the shell also work. Never print credentials.

## Series narration profile

Keep optional creative guidance in the Series bible or a short supplement. Include whichever details help the writer hear the narrator: audience, personality, formality, energy, humor, technical density, vocabulary, explanation style or preferred pace. [Computing Clearly](narration/computing-clearly.md) uses calm, curious, slightly informal explanations and concrete examples for an intelligent beginner. Its relaxed 145–155 WPM range is a planning aid. Listen for rushed or dragging passages in context. Each Series can choose its own pace, and listening judgment governs acceptance. For a new voice, use the [calibration contract](narration/VOICE-CALIBRATION.md).

## Long-form narration after approval

Codex reads the approved `script.md` and chooses coherent thought boundaries: an explanation, example, question and answer, or transition. Keep connected sentences together as needed. Sentence, word and character counts do not determine a cut. Prepare episode-local `audio/narration-blocks.json`. This is an authoring contract for future block synthesis. The existing P05 `voice` command still sends one complete script and does not consume this file.

```json
{
  "schema": "qtx-narration-blocks-v1",
  "blocks": [
    {"id":"beat-01","text":"What changed? The light went out.\n\n","previous_text":null,"next_text":"Listen for the click."},
    {"id":"beat-02","text":"Listen for the click.","previous_text":"What changed? The light went out.\n\n","next_text":null}
  ]
}
```

Before synthesis, join decoded `text` values in array order with an empty separator and compare the UTF-8 bytes with the fingerprinted script. Preserve boundary whitespace, punctuation and the final newline exactly. Stop on a mismatch and correct the blocks. Check each context field against its immediate neighbor's exact text, using null at either end. Only `text` is spoken. Use neighboring context where supported, or compatible request-ID continuity for adjacent takes. Continue to require approval before spending and reuse matching outputs.

Use actual audio duration and provider alignment on the assembled timeline for captions, then scenes and final video duration. WPM and word count serve only as planning estimates.

## Approval and preservation

Plan approval hashes the exact plan, script, visual plan, brief, episode metadata,
Series bible/config and current shared asset tree. Any change invalidates paid
production approval. The local note/time/hash record is a workflow gate, not authentication.
Voice selection comes from `ELEVENLABS_VOICE_ID` or episode/Series `voice_id`;
no default voice or silent alternative. Model defaults to `eleven_multilingual_v2`
and can be set via `ELEVENLABS_MODEL_ID` or `voice_model_id`.

Preview approval binds the actual encoded bytes and preview report to the complete
production manifest/scenes, referenced package JSON/artwork, voice/response/timings,
canonical captions, SFX, plan fingerprint, QTx render source, Unity source/settings,
bundled font and FFmpeg/FFprobe version evidence. Non-rendering Project Auditor
diagnostics are excluded because Unity rewrites their serialization on launch.
Inputs are checked again after capture. Cross-Series scene/asset references and
symlinks/junctions are refused. Prefix capture changes frame counts only, retaining
the original action durations and sprite interpolation. No animation engine redesign.

For this small MVP the entire intended timeline is authored before preview approval.
Unrendered later scenes may be refined, but changing any bound input requires a
fresh preview and explicit reapproval. This conservative gate avoids partial-scene
approval rules. Final picture duration follows voice with at most 0.5s frame padding;
voice speed is never changed. Unity frame output retains its existing unique folders.

## ElevenLabs and recovery

Set `ELEVENLABS_API_KEY` locally in the environment or ignored `.env`. The adapter
uses [create speech with timing](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps),
MP3 44.1kHz/128kbps and `apply_text_normalization: off`. It saves audio plus useful
original and normalized response alignment; no request headers or secret credentials.
It rejects timing whose original text differs from the exact approved narration.

`audio/narration.json` records script/voice/model/request/audio/response hashes,
measured duration and timing source. Matching artifacts are reused before any call.
Changed inputs never silently overwrite narration. `voice-attempt.json` is written
before the request, and failures stop without retry. A timeout can still have been
billed. Preserve partial audio/response before diagnosing local postprocessing.
An explicit user-authorized retry may archive the failed attempt and record the
retry authorization locally before one new invocation. Never erase evidence or
automatically repeat a paid request. HTTP failures report status without credentials.

## Images and Series ownership

Inspect and reuse approved Series shared assets before generation. Use the available
built-in OpenAI image tool after `check-plan`; this is a documented Codex tool boundary,
not a second provider or an image API wrapper. Before each call check for matching
existing output and receipt. One requested call, no automatic paid regeneration.
Save the original under episode `assets/generated/` with prompt, time, provider/tool,
model if exposed, original output path and SHA256. Deterministic crops have source
hash/coordinates/output hash sidecars; preserve alpha and the original. The current
tool does not expose its exact model ID; record null rather than inventing one.

A package from another Series is only a source fixture: copy/import it episode-locally
with source provenance, then explicitly promote through P02 into the current Series.
Reference only that Series-owned package. Never replace the original fixture or
introduce cross-Series runtime links. Promotion is separate from video approval.

## Small audio/output contract

Optional episode `production.json`: `{"sfx":[{"path":"audio/click.wav","start":8.87,"gain":0.18}]}`.
At most eight episode-local SFX cues, mixed at explicit gain; narration remains
original-speed, with a simple output limiter. No music provider or audio workstation.

Previews live under `preview/run-*/preview.mp4` with SRT/VTT; the latest successful
`reports/preview-report.json` identifies the exact movie. New runs preserve old ones.
Final artifacts have stable `output/final.*` paths; differing existing finals refuse
replacement. Matching successful preview/final reports and output hashes permit reuse.
Reports include input/output hashes, voice duration, dimensions/fps, range, caption
files, Unity version, approval evidence and decode result. Technical PASS is not
creative acceptance. Media, credentials, frames and receipts stay out of Git.

Focused checks: `node --test qtx/produce.test.mjs qtx/production.test.mjs qtx/unity/render.test.mjs qtx/unity/animation.test.mjs`.
Mocked fixtures and local synthetic smoke renders are implementation tests only;
the real English acceptance episode and two human gates are required for P05 closure.

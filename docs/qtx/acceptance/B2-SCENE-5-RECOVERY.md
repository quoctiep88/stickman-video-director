# Native upstream B2 Scene 5 recovery

Technical sample ready for human review. Full Everyday AI episode production remains stopped.

## Git and scope

Scoped runtime port commit 54d0355 from upstream ac1838dc4552baa135211379d3259bf450ad4d39. See B2-UPSTREAM-PARITY.md for exact imported surfaces and exclusions. Original full reviewed baseline remains 105b134f80fa11abe7a012f713712d39f20936f3.

Final combined regression run passed 104/104 with no skips. Tests cover native B runtime, B1-B3 quality/reference/local-motion checks, B3 runtime, existing B4 runtime/opening, QTx Series ownership and P05. Initial three Windows symlink setup errors were corrected using junction fixtures. Final log is productions/b2-parity-tests-final.txt.

Baseline native smoke used the existing smallest runtime fixture via the normal validate and preview CLI before episode authoring. H.264/AAC, captions, local bulb motion, decode and reference evidence passed. The fixture uses synthetic tone audio and represents runtime verification.

## Native project and output

Project at productions/everyday-ai/videos/001-ai-internet-habits/preview/upstream-b2/project.json.
CLI skills/directing-stickman-videos/scripts/autopilot.mjs.
Picture renderer skills/directing-stickman-videos/scripts/autopilot-render.mjs.
Command preview PROJECT --seconds 24.8.

Preview at productions/everyday-ai/videos/001-ai-internet-habits/preview/upstream-b2/scene-5.mp4.
This is a byte-identical delivery copy of output/preview.mp4.
1280x720, 30fps, 744 frames, 24.800 seconds, H.264/AAC with faststart.
SHA256 e642e43cc4bfc54312bc25840db7c3c3e283fc69f59360f50a835698d0bb288b.
Project fingerprint 3473d5d992eb986f3cac71d3dbc0ab21aec0317993b5d71279663565e74271f0.
Full A/V decode passed. Probe retained in probe.json.
Decoded peak -7.81 dBFS, RMS -25.99 dBFS. Narration/mix sample correlation 0.999527, with paper accents and air bed added. This is a technical audio comparison, not a listening judgment.

## Shot ledger

| Shot | Seconds | Picture and local action |
| --- | --- | --- |
| 1 | 0–2.44 | Kitchen reading. Source head layer makes a small anchored gaze change. Body, hands and timetable retain authored contact. |
| 2 | 2.44–5.36 | Close view of integrated hands and timetable. Paper tilts and settles on warm paper. |
| 3 | 5.36–7.24 | Platform establishing view. Brief deliberate static composition. |
| 4 | 7.24–9.12 | Carriage enters and eases to a settle, exposing the bicycle door. |
| 5 | 9.12–12.60 | Handwritten entrance cue. Pencil pointer develops toward the arch. |
| 6 | 12.60–16.56 | Maya returns with phone. Head movement and map settling support the better question. |
| 7 | 16.56–21.92 | Map detail. Pencil route progressively develops. |
| 8 | 21.92–24.80 | Return to Maya and question. Local gaze and route connector finish the sequence. |

The motion uses upstream smoothstep keys, image layers and line progress. Head/body alpha masks and the integrated hands/paper crop derive only from supplied reading/phone artwork. No new character renderer or Unity code was introduced. This remains restrained local animation. The sampled frames do not establish naturalness or artistic parity.

## Sound and captions

Upstream paper accents at 0.48, 2.60 and 13.20 seconds accompany paper actions. A quiet procedural pink-noise air bed was synthesized locally with a fixed seed and filtered to 100–1100 Hz, then mixed at gain 0.12. It is a designed texture, not recorded station ambience or train Foley. First review mix mistakenly used audio_cuts, which muted its SFX. The final preview replaces that interval with the air bed and preserves the accents.

The existing 14 caption cues and spoken excerpt are reused exactly. Upstream B2 paints Noto Sans 500/40 on rounded ivory labels. SRT and VTT accompany the preview.

## Reference evidence and comparison

output/preview-reference/evidence.json binds this exact MP4, project, both B2 references, 24 extracted frames and eight complete audible shot clips. review-template.json remains unknown and independent review remains pending. No approve, accept-visual or episode render command was executed.

Frame-based comparison against the full samples was inspected using chronological extracted frames. Reference listening and independent continuous-playback review remain pending.

| Dimension | Sleep example | Phone/weather example | Scene 5 observation |
| --- | --- | --- | --- |
| Editing rhythm | Bedside, clock detail, concept shots, river and return over 20s | Room, phone closeups, rug, route diagram, instructions and return over 61.9s | Eight meaningful views across 24.8s. The 5.36s map shot develops a visible route. |
| Local motion | Clock/phone/pillow/boat provide focal subjects across sampled states | Phone, cleaning, pressure and route provide action-specific subjects | Anchored gaze, held-paper tilt, carriage arrival and progressive pencil lines. Temporal effect parity remains for playback review. |
| Composition | Establishing room alternates with isolated props and diagrams | Everyday room alternates with countertop objects and route diagrams | Kitchen, isolated timetable, platform, carriage detail, entrance, map and return. |
| Character and props | Sparse character staging | Sparse character staging with changing focal props | Existing detailed Maya artwork retained. Movement is small and contacts reuse integrated source ink. |
| Art direction | Flat muted hand-drawn shapes and warm neutral concept backgrounds | Warm paper, colored rooms and economical line art | Accepted watercolor/pencil artwork is denser than both reference examples. Warm paper/ink identity is retained. |
| Captions | Narrower handwritten-looking subtitle treatment in sampled frames | Dark single-line captions on paper labels | Current upstream B2 Noto Sans/40 contract followed directly. |
| Sound | Full sample includes an audio stream | Full sample includes an audio stream | Preserved narration, quiet procedural air and three native paper accents. Listening comparison pending. |
| Overall effect | Story returns to the bedside | Story returns to the initial everyday task | Returns to Maya and the better question. Technical and sampled-frame evidence is available; artistic parity is unapproved. |

## Preservation

Hash checks passed for script, full narration WAV, all five narration MP3s, three boards, original crops, captions, rejected Unity preview and exact 91.04–115.84s excerpt. Existing 168.4 WPM is an observation. Both Computing Clearly final MP4 hashes match their accepted records. All tracked qtx files and Natural Narration skill bytes match starting HEAD. Unity was never launched.

ElevenLabs calls 0. Image-generation calls 0. Other paid-provider calls 0. No asset promotion or full episode render.

Await human review of native-upstream B2 Scene 5.

# N02 — Natural Delivery v1

## N01 listening decision

The listener preferred B. The forecast raises a question and the app answers it before the term arrives. That progression felt conversational, less like a textbook and generally more natural aloud. At 72 words in 27.12 seconds (about 159 wpm), B felt a little brisk. “For asking another for information or for asking it to do something” still catches the ear twice on “for asking.”

A was cut from the original full P05 narration. B was synthesized alone. Neighboring text can strongly affect pauses, especially the last line. The listening preference stands, but the recordings cannot isolate the effect of wording.

## B2 read-aloud audit

The [prepared input](n02-b2.json) contains the exact 72-word reading. The tap, the appearance of the forecast and the question each have a breath. Let “forecast” land in the answer before naming the request. The short action sentence keeps B's second use case without repeating its “for asking” construction. At the counter, “where to go and what details to give” is an intentional pair. The longest line turns back to the app, with a breath after “rules” and the stress on “answer.” The following location and day supply concrete request details. No recap or hesitation is needed.

Shorter opening units give the question room. The longer closing sentence should keep the delivery connected. At the Series preference of 145–155 wpm, allow about 28–30 seconds. Actual pace and pauses await audio.

## Listening sequence

1. **Text and context.** After approval, generate only the prepared B2 text with the existing B voice, Multilingual v2, MP3 44.1 kHz/128 kbps, normalization off and voice settings omitted. The excerpt opens P05, so omit `previous_text`. Supply the exact next P05 paragraph as `next_text` for prosody only. Compare with the existing B and decide whether the combined change improves the read. Listen particularly to the pause after the question and the handoff into the forecast details. A future wording-only comparison needs equivalent neighbors on both takes.
2. **Model.** Only if Test 1 is accepted, compare `eleven_multilingual_v2` with `eleven_v4` using the exact accepted B2 text, equivalent context and the same voice where supported. Check compatibility before running the comparison. Use no audio tags.
3. **Direction.** Only if v4 is preferred, try one sparse cue, such as “curious” on the question or “relaxed” on the answer. Compare with the undirected v4 take.

N02 prepares Test 1 for approval. No generation took place.

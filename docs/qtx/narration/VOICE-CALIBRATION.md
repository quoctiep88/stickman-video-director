# Qualifying a new narration voice

Before committing a new voice to an episode, choose the intended Series and read its guidance. Use a neutral passage of roughly 45–60 seconds. Agree on the exact text, voice, model and context and obtain fingerprinted approval before paid synthesis. Listen once through, then revisit the question, term and longer line.

## Neutral listening passage

> Let’s try something you can do wherever you are. Close your eyes for a moment and listen. Which sound did you notice first? For me, it was the quiet hum in the room. Now it’s gone.
>
> A microphone turns changes in air pressure into an electrical signal. On a meter, you might see the level marked in decibels, often written as dB. If you stay still and watch the meter while someone walks slowly past the door, you can follow the sound for a little longer than you might expect.
>
> Now open your eyes. With the room back in view, listen again and see what catches your attention this time.

## Decision and optional receipt

Save a short Markdown note in the Series narration metadata. Record the provider, voice ID, calibration model, language/accent, intended use, SHA-256 of the exact spoken script bytes, measured duration and observed WPM. Note question delivery, pauses, technical terms, pronunciation and any explicit provider settings. Record the human decision: **APPROVED** for the intended use, **LIMITED** with the specific suitable uses, or **REJECTED** with the audible reason.

Judge suitability by listening. If robotic cadence, flat questions, unstable pacing, poor pronunciation, inappropriate emotion or unnatural long sentences recur, choose another voice or model. Keep the script faithful and natural. An observed pace alone cannot disqualify a voice.

## Future comparisons (await a decision)

For cross-voice validation, use at least two suitable voices, including one beyond the N02 benchmark voice. Apply the same Natural Narration pass to the neutral passage once, approve it and freeze the exact text and blocks. Hold the model and context strategy equivalent. Listen to both for naturalness, question and answer, pace, pauses, technical pronunciation, sentence endings and long-sentence stability. Record judgments per voice and any shared wording issue. Generalization requires credible delivery across suitable voices.

For a separate model comparison, check compatibility first. Compare Multilingual v2 and Eleven v4 with the same compatible voice, approved script, blocks and equivalent context. Begin without special tags. Choose by listening, then evaluate targeted delivery controls only on the selected model. Each paid comparison requires its own applicable approval.

# ElevenLabs delivery

In QTx, `script.md` contains the exact approved spoken text. Keep optional direction in the plan, for example “curious on the question, relaxed on the answer.” A direction describes delivery only. Keep alternate wording, stage cues and hidden rewrites out of the request. The adapter sends the approved UTF-8 text including whitespace.

For `eleven_multilingual_v2`, start with periods, commas and paragraph breaks. Use a dash for a real interruption or an ellipsis for a genuine trailing thought. Repeated pauses can make a connected idea sound hesitant. Consider an explicit break only for a specific need when the production call and exact-text alignment support it. Use plain text for P05. Consider pronunciation markup only for a demonstrated need with compatible alignment and explicit approval.

For a future 5-10 minute episode, split at coherent thought or beat boundaries. Keep enough sentences together for natural flow and each block small enough to regenerate. Avoid sentence-by-sentence synthesis or arbitrary character cuts. Supply neighboring approved prose through `previous_text` and `next_text` where supported, or use request-ID continuity when adjacent takes already exist. Only the block's exact words belong in `text`. Evaluate a 20-30 second production excerpt with its real neighbors and match context across wording comparisons. After synthesis, use the actual narration timeline for scenes and captions.

Voice settings depend on the Series and passage. For the A/B comparison keep the P05 voice, model and settings fixed. Obtain explicit approval for the exact comparison scripts before any paid call.

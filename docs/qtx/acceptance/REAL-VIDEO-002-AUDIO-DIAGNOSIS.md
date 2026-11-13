# Real Video 002 — endpoint diagnosis, repair stopped

2026-11-13. Human Gate 2 **visual review accepted**. Audio remains unresolved. No new phase. No repair, corrected narration, R1 mux, Unity render or provider call performed.

Compared original block-05 MP3, original provider alignment, original assembled 44.1kHz PCM and current preview AAC decoded at 48kHz. All audio decodes succeeded. Local evidence: `productions/computing-clearly/videos/002-url-to-page/reports/block-05-endpoint/diagnosis.json`, `waveform-evidence.png`, and unchanged-audio excerpts `provider-ending.wav`, `assembled-join.wav`, `preview-join.wav`.

## Decision: possible speech overlap — STOP

Final word: **display**. Final lexical character **y** is aligned to block 74.88–75.04s; its end is global **263.52s**, block sample **3,309,264** at 44,100 Hz. This distinguishes the lexical end from the later punctuation/whitespace alignment overhang previously reported.

Detected terminal activity is block **[3,307,972, 3,309,264)**, or **75.010702948–75.040000000s**. On the assembled timeline it is **[11,619,940, 11,621,232)**, or **263.490702948–263.520000000s**: **1,292 samples / 29.297052ms**. Indices are zero-based and half-open. Detection threshold is absolute PCM16 amplitude >32 (−60.206 dBFS); these are signal boundaries, not certified phoneme boundaries.

Before the burst, **29,942 samples / 678.956916ms** are below that threshold (block 74.331746032–75.010702948s), RMS **−81.59 dBFS**. The burst persists to the end of the provider file, with final source sample 3193. There is no provider-file quiet tail after it. Block 06 then has **3,606 samples / 81.768707ms** below threshold before detected activity at global **263.601768707s**; RMS **−82.84 dBFS**. This is a threshold-based activity onset, not a claimed phonetic onset.

| Same transient interval | Peak dBFS | RMS dBFS |
| --- | ---: | ---: |
| Original provider | −7.70 | −22.12 |
| Assembled PCM | −7.70 | −23.20 |
| Preview AAC, decoded | −7.78 | −23.22 |

The source waveform confirms a separated burst, but silence alone cannot establish the preceding word's semantic completeness. The burst overlaps the provider-assigned final lexical-character interval. Independent listening/phonetic verification was not available; meaningful-speech overlap cannot be ruled out. This does **not** prove that the burst is speech. It means condition A (clearly non-speech) is unproven, so the user's conservative condition B applies.

Existing assembled seam samples are 0,0 because of the earlier 3ms edge ramps; those ramps did not remove the burst. No further fades, silence replacement, spectral repair, time stretching or onset changes were applied. There is no before/after repair comparison because no repair was authorized under this diagnosis.

## Preservation and next step

Original assembled WAV SHA256: `fe34e59b3ce7f8b2ecc47812132728fc865df5492e403a45c7417743200423b5`.
Original block-05 MP3 SHA256: `e227ed3be9aa82f7e17e365f34138d653ed955812f978f5b8b03764af99baf00`.
Current preview SHA256: `0b49bd2a197bd70151db2bf87b75b3474f920e9860d19f791f25b6a8b9340665`.
Corrected hash: none; no corrected artifact exists.

Original sources, scenes, local assets, captions, timings, engine and shared assets remain unchanged. Existing preview remains 1280×720, 12fps, 4,879 frames, 406.583333s. No visual stream was rerendered or remuxed. No final 24fps render or narration experiment. Provider calls this task: **0**.

Next: human resolution of the ambiguous endpoint. One additional block-05 synthesis would require **explicit human authorization**; none is currently authorized. Do not describe Gate 2 R1 as ready.

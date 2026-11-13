# Scoped upstream B2 parity update

Source ac1838dc4552baa135211379d3259bf450ad4d39. Previous reviewed baseline 105b134f80fa11abe7a012f713712d39f20936f3. QTx starting commit 7b99ca2cf896c5072f306e7c6643b92d2ad28889.

## Imported scope

B1/B2/B3 reference inputs/fingerprints in autopilot-core.mjs, reference evidence and pending status in autopilot-render.mjs, reference approval binding and accept-visual in autopilot.mjs, and caption glyph fallback validation in b-style-quality.mjs. Shared files received selected hunks. b-style-reference-review.mjs and its b4-font-coverage.mjs dependency are imported from the pinned upstream source. Glyph validation applies to B1-B3.

Imported B2 approved-board metadata, public-showcase manifest and both full MP4s, B3 public-showcase manifest and both full MP4s, B2 guidance and the common reference acceptance protocol. Selected B1-B3 paragraphs in SKILL.md and Autopilot/runtime/production-QA guidance.

Matching upstream tests are runtime, b-style-quality, b-style-reference-cli, b-style-reference-review and helpers/reference-review. Two test files use Windows junctions for canonical-path protection checks because unprivileged Windows file symlinks fail EPERM. Unix symlink branches remain intact. These are fixture adaptations only.

## Excluded scope

B4 typography review/acceptance, B4 caption animation, Anton, B4 body typography, B5 changes, README translations and onboarding updates. Existing B4 runtime behavior remains in place.

## Verification

Native CLI validate and preview passed using the smallest two-shot B1 fixture extracted from upstream runtime.test.mjs. Synthetic 0.85s input, 11 encoded frames at 12fps, H.264/AAC, burned captions and SRT/VTT, local bulb motion, full decode pass, reference ledger/template generated. Synthetic tone represents plumbing only.

Initial focused run passed 101 of 104 checks. Three fixture setups encountered Windows symlink EPERM. After junction adaptation, all three reran successfully. The run includes B1/B2/B3 reference/quality/motion, B3 runtime, existing B4 runtime/opening and QTx Series/P05 tests. No checks skipped.

All tracked qtx files and Natural Narration skill bytes match starting HEAD. Unity was never launched. Computing Clearly outputs were not opened for rendering or modified. No provider calls.

## Production routing

B2 recovery uses the native upstream Autopilot CLI and Canvas/FFmpeg runtime. QTx retains episode ownership, approvals and provenance. The full upstream baseline remains the previous reviewed commit; this is a scoped port, not full-repository parity with ac1838d.

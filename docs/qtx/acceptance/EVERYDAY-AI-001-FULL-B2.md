# Everyday AI / 001 — native full-film approval-path blocker

Human decision received 2026-11-13: **REPRESENTATIVE B2 PASS**. Scene 5 R3 is accepted; no R4. Full native B2 production is authorized subject to canonical Scene 5 comparison and truthful approval binding. Preserve prior R3 evidence as historical evidence rather than rewriting its earlier review status.

Verified authorities:

- R3 MP4 SHA256: `d1c2fac2d87bc3c7ab35ba0acf4cbb242915cbdee3252d372c2a77f29124ea81`.
- Style lock SHA256: `1d4906c0503220a006389e68b2df41121efc4ef07be208e62350e623fba0abb1`.
- Existing 184.96s narration SHA256: `56e2cb184d56881aa85f6adf7952eac86a74f6282056fc47708eb58c4f458326`.
- Episode-local user request and decision: `reports/full-b2-user-request.txt` and `reports/full-b2-human-decision.json`.

## Observed blocker

The requested canonical Scene 5 interval is **91.04–115.84s**, from the existing audio assembly. The unchanged native CLI supports only prefix previews, at most 60s (`autopilot.mjs` lines 39–41; `autopilot-core.mjs` lines 76–81). There is no interval-start option. Native `approve` and `render` reload that prefix, require its exact preview fingerprint/video hash, and verify its independent visual-review evidence (`autopilot.mjs` lines 61–75, 88–94). A Scene 5 excerpt cannot truthfully be registered as that prefix.

The existing QTx preview binding is not a native B2 alternative: `productionInputs` in `qtx/produce.mjs` reads `unity-project.json` and fingerprints Unity scenes/engine. Writing a separate decision receipt does not make the native render command consume it. Calling renderer internals to sidestep the CLI approval checks would not fulfill the requested existing native approval path.

Stopped under the user's explicit real-blocker rule, before full authoring or provider spending. Canonical project, canonical interval, approval binding, full film and full-film QA have **not** been produced. No new image, ElevenLabs or other paid calls. No assets promoted; no historical media, runtime, Unity, Computing Clearly or Natural Narration changes.

The separate doctor run also found FFmpeg/FFprobe unavailable on the current shell PATH; Node, canvas, sharp and fonts passed. Executable discovery/configuration was not pursued after the approval-path blocker; this is not evidence the binaries are absent from the machine.

Continuation requires resolving the workflow mismatch: an authorized native interval-preview/approval implementation, or a changed approval workflow using a genuine canonical opening preview. Do not fabricate a review or bind R3 approval to an unrelated prefix. No implementation change is authorized by this report.

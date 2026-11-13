# Local human review bridge

This explicitly authorized QTx production helper packages existing native B1/B2/B3 evidence into a static local form. It does not change the upstream validator, renderer, quality thresholds, approval process, or media. No server, provider calls, or dependencies are added.

From the repository root (Node and the existing FFmpeg/FFprobe prerequisites):

```powershell
node qtx/human-review.mjs build productions/everyday-ai/videos/001-ai-internet-habits/project.json productions/everyday-ai/videos/001-ai-internet-habits/output/preview-reference
```

Open `productions/everyday-ai/videos/001-ai-internet-habits/output/preview-reference/human-review.html` in a normal local browser, for example by double-clicking it. All media uses local file URLs. No fetch/server is needed. The generated page embeds the native template, evidence, and current reference metadata; media stays in its existing location. Rebuild if the checkout moves. Browser policies can restrict local files: the Codex in-app browser rejects `file:` navigation, so it cannot preview this pack.

The builder uses native `loadProject` and `planBStyleReference`, checks full/scoped fingerprints and template/ledger binding, verifies all listed input/reference/manifest/artifact hashes, and refuses a filled template. It does not re-extract or modify evidence. The full-project fingerprint and preview-scoped fingerprint are distinct and displayed separately.

## Review and export

- Play the complete candidate with audio. Explicitly confirm continuous full playback and enter actual viewed ranges and timed observations. Shot playback never sets that confirmation.
- Inspect each required baseline and record its interval and timed observations separately. Mark reference start/end in the player; replay ranges as needed.
- Select each shot to play its original continuous clip and inspect start/mid/end stills. Criteria and valid evidence IDs come from the native template/ledger. Observation times are absolute candidate times; “Use current playback time” adds the shot start to the clip playhead.
- Enter your own status, concrete observations, and comparisons. All subjective fields begin blank/unknown; identity is blank and independence unchecked. Kind defaults to human. All criteria offer video comparisons; sound offers only audible references. Comparisons are required except for typography/captions and timing/pacing, matching the current native contract. The fields are shared across B1/B2/B3, not a duplicated B2 criteria catalog.
- A human-written comparison can be copied to explicitly selected criteria in the current shot only after confirmation. The helper never writes comparison prose.
- Download a draft frequently and use Resume draft to continue. There is no automatic browser storage. Resume checks target binding and shot/criterion identities; the native verifier remains authoritative for the content.
- Export downloads `independent-review.json`. Save/move that file into the evidence folder shown in the page. A static page cannot silently write an arbitrary local path. No final review is created by packaging the page.

The form flags missing entries and invalid time ranges, but these are completion hints, not acceptance or an alternate validator. Failures and blockers remain exportable when fully documented and will be rejected by native acceptance. A successful download does not certify the honesty, aesthetics, or validity of the review.

## Native verification only

The page displays the exact command for its project:

```powershell
node qtx/human-review.mjs verify productions/everyday-ai/videos/001-ai-internet-habits/project.json productions/everyday-ai/videos/001-ai-internet-habits/output/preview-reference productions/everyday-ai/videos/001-ai-internet-habits/output/preview-reference/independent-review.json
```

This calls `verifyBStyleReferenceReview` unchanged. Native verification re-extracts temporary evidence for provenance checks; it does not render the project or alter existing evidence. It may take time. A result/error report is saved as `human-review-validation.json`. Load it using the page's validation-report picker: the exact upstream error is displayed. Shot/criterion-specific errors navigate to that field; generic errors remain verbatim because upstream does not always identify the offending field. No artistic text is repaired. This command does not invoke `approve`, `accept-visual`, full rendering, or create an approval receipt.

## Verification and current pack

The focused state/export tests run with `node qtx/human-review.test.mjs`. Synthetic observations exist only in memory in tests; they are not production reviews. Tests cover blank defaults, missing sections, native-shaped serialization, interval errors, dynamic B3 criteria, and non-inference of full playback.

All three focused tests pass. The verification wrapper was also run against the untouched current template: upstream rechecked the media/evidence and rejected it with `B-style reference review: a declared independent reviewer distinct from the author is required`. This is an expected rejection, not a completed human review or acceptance.

Everyday AI 001 pack: 15 shots, 45 stills, 15 continuous clips, complete 43.5s candidate, and both required B2 public videos. Builder confirms full fingerprint `c5e6230700bae8a454b83e37aecbcd2c7494c29c3399e4863bc6c807390dc96e` and preview SHA256 `d0053254e5e419eedc64ca7e076d399f9d056ec4c32a46972c0d621a994ef3e3`. The preview-scoped fingerprint is `3e1fbcf564fd57a67a160476df851e97040da3dc0fde56439a5c8ec09ef17e89`.

The current human PASS and caveats in the conversation remain authoritative human statements, but are not expanded into fabricated per-shot observations. The generated form is blank. Human entry/export and successful native verification are still required before native approval resumes. Local browser rendering and interactive media playback were not verified in the restricted in-app browser; path/hash checks and form logic tests are technical evidence only.

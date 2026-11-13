# Everyday AI / 001 — human approved; native review gate blocked

On 2026-11-13 the user explicitly approved the canonical 0–43.5s opening and requested native approval, full render and full-film QA without creative changes or provider calls. R3 remains REPRESENTATIVE B2 PASS.

## Frozen inputs verified

- Native full-project fingerprint recomputed: `c5e6230700bae8a454b83e37aecbcd2c7494c29c3399e4863bc6c807390dc96e` (exact match).
- Project file SHA256: `50905fb16f562158d1257e16ec4762d1cac5471ddf0d66112376f04889597cab` (exact match).
- Opening SHA256: `d0053254e5e419eedc64ca7e076d399f9d056ec4c32a46972c0d621a994ef3e3` (exact match).
- All 39 entries in episode `reports/native-full/preserved-authorities.json` match, including script, narration, five provider blocks/responses, R3 and style lock.
- Native fingerprint binds the complete timeline/captions, input asset hashes and engine hashes. Working tree was clean before this documentation update; runtime, Unity, Computing Clearly and Natural Narration were not modified.

## Exact blocker

Invoked upstream `autopilot.mjs approve` on the canonical project with a note recording the user's explicit approval and hashes. Exit 1:

> B1/B2/B3 preview requires independent sample-effect review: approve --visual-review REVIEW_JSON

The existing `output/preview-reference/review-template.json` has an empty reviewer identity/method, `independent: false`, unknown full playback and unknown shot checks. No completed independent review was found in this episode's JSON records. Human opening approval is recorded here, but does not supply the missing detailed reference comparisons, continuous playback/listening observations and per-shot checks. Those cannot honestly be fabricated from the approval statement or technical diagnostics.

No native approval receipt was written. No full render was attempted and no full-film QA is claimed. Existing opening evidence remains intact. No new provider calls of any kind, no asset promotion and no episode closure.

Next: obtain a genuinely completed independent review using the existing preview evidence/template and both bundled B2 references, then pass that review to native `approve --visual-review`. Preserve this already-granted human opening approval; do not ask for it again. Resume full render and requested full-film QA only after the native gate accepts the review. Human full-film review remains required before closure/promotion.

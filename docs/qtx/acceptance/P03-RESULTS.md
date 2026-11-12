# P03 technical acceptance

Date: 2026-11-13 (Asia/Bangkok). Technical render acceptance, not creative approval.

## Environment and scope

- Starting SHA: 51bbf7893ecb58e1b66be6cd8934774503c8c1ef, main, clean.
- Unity 6000.6.7f1 (b22767f04f04), discovered at standard Unity Hub Editor location.
- FFmpeg/FFprobe 9.0.2-full_build.
- Initial batch returned 198: no active Editor license. User activated Unity;
  subsequent CLI-only runs compiled and rendered successfully. No Editor install.
- One Unity project; upstream runtime/project schema untouched.
- No P04 features, providers, audio, UI, services or database.

## Ignored production

Series: productions/p02-demo-series/
Episode: videos/003-unity-packet/
Manifest: unity-project.json; scenes/scene-001.json and scenes/scene-002.json.

Both scenes reference ../../../shared/symbols/packet.png directly. No sprite copy
exists in Unity Assets. Shared asset SHA256:
7d1870da67e604dea98ae7bc7ed6ad11479281ef5b85665c4721fd2fdca25c6e

Manifest SHA256:
d6ee8f96b3bbad2005d0e03afb2fb555eaf8ffdcae9502ffd34f10bb1ca2b8bb

Two 3-second scenes, 640x360 at 12 fps: 36 + 36 = **72 frames**, 6 seconds.
Scene 1 moves packet from (-4,0) to (0,0); scene 2 moves toward (4,0), scales
to 1.25, rotates to 30 degrees, fades toward 0.8. A stationary larger packet
underlay at (0,-0.4), alpha 0.25, order 0 tests transparency/layering beneath
the moving packet at order 10. Background #F5F1E8.
Endpoint keys at 3 seconds are approached; final sample is 35/12 seconds.

## Executed evidence

- doctor: PASS; actual Unity executable product version matches project.
- validate: PASS, exact shared path/hash and 72-frame total.
- Node tests: 7/7 PASS. Existing Series tests: 5/5 PASS.
- Series check: PASS across all three local episodes; promoted hash preserved.
- Standalone C# compilation against installed Unity references: PASS using bundled
  modern Roslyn. An initial legacy compiler attempt lacked Encoding.CodePages;
  actual Unity compilation subsequently passed.
- Node to Unity frames command: PASS, 72 contiguous nonempty PNGs.
- Unity interpolation self-test: PASS in actual batch execution.
- Three complete Unity + FFmpeg runs: PASS, each 72 frames, H.264, 640x360,
  12 fps; FFprobe counted frames and full FFmpeg decode passed.
- First/repeat all 72 PNG SHA256 hashes identical. MP4 bytes also identical:
  6cc7be3a312267488e1dd3e6d5cc5c82ade5cca0bd94675ec729e1fa2ac5fbc7
- Mutation: scene 2 underlay position changed to (2,2); all 36 scene-2 frames
  changed, all 36 scene-1 frames stayed identical. Original scene bytes restored
  in finally; restored scene SHA256 matched. Latest report points to original.
- Contact sheet frames 0,18,35,36,71 inspected by Codex: correct transparent
  sprite exterior, cream background, foreground layering, left/center/right
  positions, increased scale and rotation, no camera/editor artifacts.

Local evidence under episode output/unity/:

- frames-E98oA5/film.mp4: original accepted technical output.
- frames-2TZh1p/film.mp4: identical repeat.
- frames-ftW4cs/film.mp4: intentional mutation evidence.
- render-report.json, determinism-report.json, contact-sheet.png.
- Each run retains PNGs, normalized job, Unity result/version and unity.log.
- Initial licensing failure log: frames-IQWFg9/unity.log.

## Reproduction

After an activated matching Editor is available:

~~~sh
node --test qtx/unity/render.test.mjs qtx/production.test.mjs
node qtx/unity/render.mjs doctor
node qtx/unity/acceptance.mjs productions/p02-demo-series/videos/003-unity-packet/unity-project.json
~~~

Acceptance creates a fresh contact sheet; inspect it before recording visual PASS.
No cross-machine/GPU byte identity promise; acceptance establishes identical
frames under unchanged inputs/settings on this machine. JPEG loading is implemented
but acceptance uses PNG. No upstream runtime regression suite was needed because
no upstream runtime files changed. Git closure is recorded in STATUS.

# Unity renderer (P03)

One engine lives at qtx/unity/QTxVideoDirector/, pinned to Unity **6000.6.7f1**
in ProjectSettings. No third-party packages are required. Unity generates pictures;
FFmpeg encodes H.264/yuv420p, CRF 18, faststart. This is an additional route:
upstream project.json and its B renderer remain unchanged.

## Authoring contract

Codex authors semantic JSON, not per-scene C#. Production data stays in ignored
productions/; shared assets remain outside Unity Assets. unity-project.json:

~~~json
{"schema":"qtx-unity-v1","width":640,"height":360,"fps":12,
 "scenes":["scenes/scene-001.json","scenes/scene-002.json"]}
~~~

Width/height are positive even integers <=8192; fps is an integer 1..120.
Scene filenames resolve relative to the manifest. Each scene contains:

~~~json
{"duration":3,"background":"#F5F1E8","objects":[
  {"id":"packet","type":"sprite","asset":"../../../shared/symbols/packet.png",
   "position":[-4,0],"scale":[1,1],"rotation":0,"opacity":1,"order":10,
   "keyframes":[{"time":3,"position":[0,0],"rotation":30}]}
]}
~~~

**Asset paths resolve relative to the scene JSON**, hence three parent components
from videos/EPISODE/scenes/ to Series shared. PNG/JPEG bytes load at runtime with
Texture2D.LoadImage; PNG alpha is preserved. Nothing is copied into Unity Assets.
IDs must be unique within a scene. Background is opaque #RRGGBB.

Defaults: position [0,0], scale [1,1], rotation 0, opacity 1, order 0, keyframes [].
Position/scale are finite numeric pairs; rotation is degrees counterclockwise;
opacity is 0..1. Higher order draws in front. Order keys are integers -32767..32767;
interpolated order rounds to nearest integer, ties away from zero. Avoid equal
orders for overlapping objects.

Keys have strictly increasing times in [0,duration]. Each key can specify any
supported transform property, including order. Each property has an independent
linear track starting at its base value at time zero; a time-zero key overrides it.
Missing properties do not insert keys. Values hold after the last key. Rotation
interpolates authored numeric degrees, not shortest-angle wrapping.

## Coordinates and deterministic timing

Orthographic camera: center (0,0), X right, Y up. View height is 9 world units;
width is 9 * width / height (16 units at 16:9). Raster sprites use 100 pixels per
world unit at scale 1 and a centered pivot. No anchors or responsive layout.

Each scene produces ceil(duration * fps) frames; local time is exactly
localFrameIndex / fps. End time is excluded when duration*fps is integral.
Scene counts sum; global numbering starts at frame-000000.png.
No playback clock, physics or randomness drives rendering. Determinism is tested
on the same Unity version, project settings, machine and graphics environment;
cross-GPU byte identity is not promised.

## Commands

From repository root, Node 20+:

~~~sh
node qtx/unity/render.mjs doctor
node qtx/unity/render.mjs validate productions/SERIES/videos/EPISODE/unity-project.json
node qtx/unity/render.mjs frames productions/SERIES/videos/EPISODE/unity-project.json
node qtx/unity/render.mjs render productions/SERIES/videos/EPISODE/unity-project.json
node --test qtx/unity/render.test.mjs
node qtx/unity/acceptance.mjs productions/SERIES/videos/EPISODE/unity-project.json
~~~

- doctor: Unity path/version, FFmpeg/FFprobe versions, project path.
- validate: required fields, files, keys, shared path resolution and input hashes.
- frames: validate, invoke Unity, verify contiguous nonempty frame sequence.
- render: frames, encode, FFprobe dimensions/fps/codec/count, full decode, report.
- acceptance.mjs: two unchanged renders, all-frame hash comparison, scene-2
  transform mutation, affected/unaffected frame comparison, input restoration,
  and contact sheet. Requires the two-scene fixture; inspect its sheet separately.

Discovery uses QTX_UNITY_PATH first, then the pinned version under the standard
Windows Unity Hub Editor location. No executable path is tracked. An activated
Editor license and functioning graphics device are required. No automatic install.
Run serially; keep inputs unchanged during rendering.

Node prepares internal render-job.json with independent scalar tracks; it is not
another authoring format. Batch invocation:

~~~text
Unity.exe -batchmode -projectPath <qtx/unity/QTxVideoDirector>
  -executeMethod QTxVideoDirector.BatchRender.Run
  -qtxJob <generated-render-job.json> -logFile <unity.log> -quit
~~~

No -nographics, manual scene opening or GUI interaction. The entry point creates
an empty scene/camera, evaluates tracks, renders a RenderTexture and writes PNGs.
Its small interpolation self-test runs before rendering.

## Outputs and failures

Each invocation creates output/unity/frames-<unique>/ with numbered PNGs,
render-job.json, unity.log and Unity version evidence. Render adds film.mp4 and
render-report.json. Unique directories prevent stale frames from satisfying a
failed/new run and retain logs. output/unity/render-report.json points to the
latest successful encode; consult command exit status for new runs.

Reports include manifest/scene hashes, verified Unity version, dimensions, fps,
frame counts, external asset paths/hashes, output path/hash and decode result.
They are technical evidence, not creative approval. Acceptance writes
determinism-report.json and contact-sheet.png beside the latest report.
Generated output and production manifests are not committed.

Missing/malformed inputs, missing assets/scenes, invalid keys/IDs, Unity failures,
incomplete frames and encoding/probing/decoding failures return nonzero. Unity logs
are retained and their location is printed on failure. No automatic recovery.

## Deliberate limitations

The original P03 scope has raster sprites and linear transforms only. No character rigs, SpriteSkin,
limbs, interactions, walking, POINT/HOLD actions, authored action modules, lip sync,
captions, audio production, procedural camera, Unity Timeline authoring, physics,
providers, UI, backend, database, workers or cloud rendering.
P04 now adds deliberately scoped semantic actors/actions and authored contact modules
alongside this unchanged low-level object contract; see [animation engine](ANIMATION-ENGINE.md).
P05 production integration uses `qtx/produce.mjs`; see [production MVP](PRODUCTION-MVP.md).
The Node `frames(manifest, maxFrames)` optional prefix limit preserves original cue
durations/tracks and captures only the requested opening frames. Default full renders
are unchanged; no C# or character architecture changes were needed.

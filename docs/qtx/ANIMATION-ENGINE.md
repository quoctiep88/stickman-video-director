# QTx animation engine (P04)

Semantic scene JSON → Node asset/contract preflight → Unity character loader and
timeline compiler → pure frame-time poses → continuous limb skinning/contact
attachment → existing P03 frame loop → FFmpeg. One Unity project, one character
format, four actions and one interaction family. No scene-specific C#.

The [P03 renderer contract](UNITY-RENDERER.md) still defines manifests, coordinates,
object tracks, camera, frame numbering and output reports. `objects` remain valid
for diagrams, arrows, backgrounds, icons and props. They may coexist with actors;
omitting objects means an empty list. Upstream `project.json` is unchanged.

## Scene authoring

```json
{
  "duration": 10, "background": "#F5F1E8", "objects": [],
  "actors": [{"id":"host",
    "character":"../../../shared/characters/host/character.json",
    "position":[-5,-2], "scale":1, "facing":"right"}],
  "actions": [
    {"actor":"host","action":"WALK_TO","start":0,"end":2,"target":[-1.5,-2]},
    {"actor":"host","action":"LOOK_AT","start":2,"end":5,"target":[3,2]},
    {"actor":"host","action":"POINT_AT","start":3,"end":5,"target":[3,2]},
    {"actor":"host","action":"IDLE","start":8,"end":10}
  ],
  "interactions": [{"actor":"host","start":5,"end":8,
    "module":"../../../shared/interactions/hold-card/interaction.json"}]
}
```

Actor IDs and object IDs share a unique scene namespace. Position is required;
scale defaults to 1, facing to `right` (`left` also supported). Actor scale multiplies
character scale. Character and interaction paths resolve from the scene file.

`LOOK_AT` and `POINT_AT` targets are `[x,y]` or an object/actor ID. Object positions
use their current P03 tracks; actor targets use their current root position.
Self-targets fail validation. `WALK_TO` requires a position, avoiding recursive
moving-target constraints. Unity owns pose calculation; Node never bakes poses.

## Character package

Series source of truth: `shared/characters/<id>/character.json` plus PNG/JPEG files.
New artwork begins episode-local and is promoted explicitly, with provenance.
No source artwork is copied to Unity Assets. Reports hash package JSON and artwork.

Canonical names: **root, torso, head, arm_left, arm_right, leg_left, leg_right**.
`root` is implicit in the actor; exactly six rendered parts are required. The
character's `parts` array uses this shape (repeat for all six):

```json
{"schema":"qtx-character-v1","id":"host","scale":1,"parts":[
  {"name":"arm_right","kind":"limb","asset":"arm.png",
   "anchor":[0.43,2.48],"size":[0.32,1.65],"order":40}
]}
```

This one-part excerpt is not a complete package. Torso/head use `kind: "sprite"`;
all arms/legs must use `kind: "limb"`. Asset paths resolve from character.json.
Size is positive width/height in local world units; anchors are root-local pairs.
Torso/head anchors are centered pivots; limb anchors are proximal top-center
(shoulder/hip). Limbs are authored vertically downward. Each part has a unique
integer draw order; higher draws in front. The loader preserves semantic names
and builds sprites or connected textured meshes. No anatomical registry or
episode actions are stored in character metadata.

## Continuous limbs and deterministic execution

Selected implementation: **explicit CPU two-bone linear blend skinning**, not
SpriteSkin. Every limb is one textured connected strip: 24 rows, 50 vertices,
48 triangles, two internal bone transforms. Bind pose points down, with the second
bone at half length. Smooth weights transition between 30% and 70% of length.
Both transforms deform the same vertices across the joint; there are no separate
upper/lower sprites, seam patches, hands or elbow caps.

The [Unity 2D Animation 16 SpriteSkin API](https://docs.unity3d.com/Packages/com.unity.2d.animation@16.0/api/UnityEngine.U2D.Animation.SpriteSkin.html)
documents bone binding and access to already-deformed vertices, but no public
synchronous deformation entry point. P03 renders all frames within one execute
method without yielding to editor updates. This makes update-driven SpriteSkin
unsuitable for this loop without additional scheduling or internal API coupling.
The small explicit skinning path keeps that foundation intact and needs no package,
importer or cache. This is an architectural compatibility decision based on the
public API, not a claim that all runtime SpriteSkin workflows are impossible.

Time is exactly `frameIndex / fps`. Each evaluation starts from authored defaults,
folds earlier WALK_TO endpoints, and applies active cues. It does not depend on the
previous frame, delta-time, wall clock, physics, randomness or Animator state.
Seeking backward gives the same root, pose and mesh. Same-machine raster identity
is verified; cross-GPU identity is not promised.

## Actions and composition

| Action | Input and execution |
| --- | --- |
| IDLE | Actor/range; neutral stable pose at retained root. Also the default outside cues. |
| WALK_TO | Position target; linear root travel from previous root, facing follows horizontal travel. Authored 1.5Hz opposing leg/arm cycle, bending knees, eased cycle amplitude at endpoints. |
| LOOK_AT | Position/ID; head faces target side and tilts up/down, clamped to 25 degrees. No facial system. |
| POINT_AT | Position/ID; right shoulder-to-target direction controls one continuous arm with a fixed gentle elbow bend. No authored scene arm angles or IK solver. |

Ranges are `[start,end)`, finite, nonempty and inside scene duration. One body cue
(IDLE/WALK_TO/POINT_AT/HOLD_CARD) may run at a time per actor. One LOOK_AT may coexist
with it on the head channel. Overlapping cues on the same channel fail, including
duplicate LOOK_AT. Adjacent ranges are valid. There is no blending graph; pose and
contact switches occur at range boundaries. WALK_TO endpoints persist; other poses
return to neutral outside their ranges.

## Authored interaction modules

An action computes a generic pose. A contact-critical interaction owns its visual
contact geometry. The only P04 family is `HOLD_CARD`, packaged as
`shared/interactions/<id>/interaction.json` plus one raster:

```json
{"schema":"qtx-interaction-v1","action":"HOLD_CARD","character":"host",
 "anchor":"arm_right","replace":"arm_right","asset":"hold-card.png",
 "size":[2.6,1.8],"pivot":[0.1153846154,0.8333333333]}
```

`character` must match the package ID. P04 supports only the right-arm anchor and
replacement. Size is world units; pivot is normalized from bottom-left, identifying
the shoulder attachment pixel in the authored image. Draw order inherits the
replaced part. The module contains the **whole bent arm, hand and card together**;
the runtime attaches it to the shoulder and hides the ordinary right arm. At end,
the module disappears and the ordinary limb returns. This is the sole required
connection and state: no persistent state machine or generic attachment graph.

The fixture paints palm/arm behind the card and a thumb over its edge in one image.
There is no independent grip-hand overlay or arbitrary prop-grasp synthesis.
No content-overlay contract was needed. Approved modules remain Series-owned and
must not be regenerated/replaced without explicit approval and production reason.

## Boundaries, checks and reproduction

Codex authors JSON and references approved packages for ordinary supported scenes.
New reusable engine actions require deliberate C# engine work. Prefer supported
semantic actions over raw character keyframes; preserve raw objects for graphics.
Do not regress to rigid multipart/seam-patched limbs or generic grip overlays.

Node validates files, required parts/kinds, IDs, targets, time ranges, conflicts and
interaction compatibility before launching Unity. Unity compiles cue lists and
checks semantic consistency again; it is authoritative for animation. The internal
render-job is bridge output, not an independent supported authoring interface.

```sh
node --test qtx/unity/animation.test.mjs qtx/unity/render.test.mjs qtx/production.test.mjs
node qtx/unity/animation-acceptance.mjs productions/p04-animation-demo/videos/001-semantic-actions/unity-project.json productions/p02-demo-series/videos/003-unity-packet/unity-project.json
```

To reproduce artwork in a NEW initialized episode, run
`python qtx/unity/animation-fixture.py <episode>` (Pillow required only here), then
explicitly promote `assets/generated/technical-host` and `assets/generated/hold-card`
to that Series's corresponding shared directories. Inspect shared assets first;
the generator refuses existing outputs. It creates local synthetic fixtures, never
calls providers. Acceptance expects the documented ten-second timeline and a retained
P03 render report/baseline, restores scene bytes after mutations, and writes a
contact sheet for separate visual inspection. See [P04 evidence](acceptance/P04-RESULTS.md).

Limits: simple side-view humanoid proportions; fixed half-length limb joints;
stretch/compression at strong bends; authored gait without foot locking, speed
adaptation or ground constraints; right-arm-only pointing/contact; abrupt pose
switches; no arbitrary rigs, generic hands/IK/grasp, facial/lip-sync system or audio.
No older QTx2D source was inspected or reused. No providers, UI, services, database
or P05 orchestration were added.

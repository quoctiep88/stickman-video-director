import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validate, frameCount, track } from "./render.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qtx-unity-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const episode = path.join(root, "videos", "001"),
    shared = path.join(root, "shared", "symbols");
  fs.mkdirSync(path.join(episode, "scenes"), { recursive: true });
  fs.mkdirSync(shared, { recursive: true });
  fs.writeFileSync(path.join(shared, "packet.png"), "validation-only fixture");
  const manifest = path.join(episode, "unity-project.json"),
    scene = path.join(episode, "scenes", "one.json");
  const m = {
    schema: "qtx-unity-v1",
    width: 640,
    height: 360,
    fps: 12,
    scenes: ["scenes/one.json"],
  };
  const s = {
    duration: 3,
    background: "#F5F1E8",
    objects: [
      {
        id: "packet",
        type: "sprite",
        asset: "../../../shared/symbols/packet.png",
        position: [-4, 0],
        keyframes: [{ time: 3, position: [0, 0] }],
      },
    ],
  };
  const save = () => {
    fs.writeFileSync(manifest, JSON.stringify(m));
    fs.writeFileSync(scene, JSON.stringify(s));
  };
  save();
  return { root, manifest, scene, m, s, save };
}
test("frame count ceiling and scene concatenation", () => {
  assert.equal(frameCount(3, 12), 36);
  assert.equal(frameCount(0.11, 12), 2);
  assert.equal(frameCount(0.11, 12) * 2, 4);
});
test("sparse independent tracks, time-zero override and defaults", () => {
  const keys = [
    { time: 0, position: [-3, 2] },
    { time: 1, rotation: 30 },
    { time: 3, position: [4, 0] },
  ];
  assert.deepEqual(track([-4, 0], keys, "position", 0), [
    { time: 0, value: -3 },
    { time: 3, value: 4 },
  ]);
  assert.deepEqual(track(0, keys, "rotation"), [
    { time: 0, value: 0 },
    { time: 1, value: 30 },
  ]);
  assert.deepEqual(track(1, keys, "opacity"), [{ time: 0, value: 1 }]);
});
test("manifest and shared path resolution", (t) => {
  const f = fixture(t),
    v = validate(f.manifest);
  assert.equal(v.totalFrames, 36);
  assert.equal(
    v.assets[0].path,
    path.join(f.root, "shared", "symbols", "packet.png"),
  );
  assert.match(v.assets[0].sha256, /^[a-f0-9]{64}$/);
  assert.equal(v.scenes[0].objects[0].sx[0].value, 1);
});
test("missing manifest, malformed JSON and missing scene", (t) => {
  const f = fixture(t);
  assert.throws(() => validate(f.manifest + "missing"), /ENOENT/);
  fs.writeFileSync(f.manifest, "{");
  assert.throws(() => validate(f.manifest), /JSON/);
  f.save();
  fs.unlinkSync(f.scene);
  assert.throws(() => validate(f.manifest), /ENOENT/);
});
test("invalid dimensions, fps and schema refused", (t) => {
  const f = fixture(t);
  for (const [key, value] of [
    ["width", 641],
    ["height", 0],
    ["fps", 0],
    ["schema", "upstream"],
  ]) {
    const old = f.m[key];
    f.m[key] = value;
    f.save();
    assert.throws(() => validate(f.manifest));
    f.m[key] = old;
  }
});
test("missing assets refused", (t) => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.root, "shared/symbols/packet.png"));
  assert.throws(() => validate(f.manifest), /missing or unsupported asset/);
});
test("duplicate IDs and invalid keyframes refused", (t) => {
  const f = fixture(t),
    obj = f.s.objects[0];
  f.s.objects.push(obj);
  f.save();
  assert.throws(() => validate(f.manifest), /duplicate/);
  f.s.objects.pop();
  for (const keys of [
    [{ time: 4, opacity: 1 }],
    [{ time: -1, opacity: 1 }],
    [
      { time: 1, opacity: 1 },
      { time: 1, opacity: 0 },
    ],
    [{ time: 1, opacity: 2 }],
    [{ time: 1, position: [0] }],
  ]) {
    obj.keyframes = keys;
    f.save();
    assert.throws(() => validate(f.manifest));
  }
});

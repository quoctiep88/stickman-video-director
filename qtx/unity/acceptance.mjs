// Explicit integration acceptance: runs Unity three times; restores scene bytes.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { render, hash, validate } from "./render.mjs";
const manifest = process.argv[2];
if (!manifest)
  throw Error("usage: node qtx/unity/acceptance.mjs <unity-project.json>");
const job = validate(manifest);
assert.equal(job.scenes.length, 2, "acceptance requires two scenes");
const first = render(manifest),
  second = render(manifest);
const frameHashes = (r) =>
  Array.from({ length: r.totalFrames }, (_, i) =>
    hash(
      path.join(
        r.frameDirectory,
        "frame-" + String(i).padStart(6, "0") + ".png",
      ),
    ),
  );
const a = frameHashes(first),
  b = frameHashes(second);
assert.deepEqual(a, b, "unchanged inputs must produce identical frame hashes");
const scene = job.scenes[1].path,
  original = fs.readFileSync(scene);
let changed;
try {
  const data = JSON.parse(original);
  data.objects[0].position = [2, 2];
  fs.writeFileSync(scene, JSON.stringify(data, null, 2));
  changed = render(manifest);
} finally {
  fs.writeFileSync(scene, original);
}
const c = frameHashes(changed),
  boundary = job.scenes[0].frames;
assert.deepEqual(
  a.slice(0, boundary),
  c.slice(0, boundary),
  "first scene must remain unchanged",
);
assert.ok(
  a.slice(boundary).some((h, i) => h !== c[boundary + i]),
  "mutation must change scene 2",
);
const output = path.dirname(path.dirname(first.output));
fs.copyFileSync(
  path.join(first.frameDirectory, "render-report.json"),
  path.join(output, "render-report.json"),
);
const selected = [
  0,
  Math.floor(boundary / 2),
  boundary - 1,
  boundary,
  first.totalFrames - 1,
];
const args = ["-v", "error", "-y"];
for (const i of selected)
  args.push(
    "-i",
    path.join(
      first.frameDirectory,
      "frame-" + String(i).padStart(6, "0") + ".png",
    ),
  );
args.push(
  "-filter_complex",
  "hstack=inputs=" + selected.length,
  "-frames:v",
  "1",
  path.join(output, "contact-sheet.png"),
);
const result = spawnSync("ffmpeg", args, {
  encoding: "utf8",
  windowsHide: true,
});
assert.equal(result.status, 0, result.stderr);
const evidence = {
  result: "PASS",
  framesCompared: a.length,
  identicalFrames: true,
  identicalMp4: first.outputSha256 === second.outputSha256,
  mutationChangedFrames: c.filter((h, i) => h !== a[i]).length,
  originalRestored: hash(scene) === job.scenes[1].sha256,
  original: first.output,
  repeat: second.output,
  mutation: changed.output,
  selectedFrames: selected,
  visualInspection: "PENDING",
};
fs.writeFileSync(
  path.join(output, "determinism-report.json"),
  JSON.stringify(evidence, null, 2) + "\n",
);
console.log(JSON.stringify(evidence, null, 2));

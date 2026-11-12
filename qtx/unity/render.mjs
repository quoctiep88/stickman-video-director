import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
export const project = fileURLToPath(
  new URL("./QTxVideoDirector", import.meta.url),
);
export const hash = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const check = (ok, msg) => {
  if (!ok) throw Error(msg);
};
const read = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    throw Error(p + ": " + e.message);
  }
};
const finite = (n) => typeof n === "number" && Number.isFinite(n);
export const frameCount = (duration, fps) => Math.ceil(duration * fps);
function values(o, label) {
  for (const k of ["position", "scale"])
    if (k in o)
      check(
        Array.isArray(o[k]) && o[k].length === 2 && o[k].every(finite),
        label + ": invalid " + k,
      );
  for (const k of ["rotation", "opacity", "order"])
    if (k in o) check(finite(o[k]), label + ": invalid " + k);
  if ("opacity" in o)
    check(o.opacity >= 0 && o.opacity <= 1, label + ": opacity must be 0..1");
  if ("order" in o)
    check(
      Number.isInteger(o.order) && Math.abs(o.order) <= 32767,
      label + ": invalid order",
    );
}
export function track(base, keys, prop, component) {
  const result = [
    { time: 0, value: component === undefined ? base : base[component] },
  ];
  for (const k of keys)
    if (prop in k) {
      const item = {
        time: k.time,
        value: component === undefined ? k[prop] : k[prop][component],
      };
      if (k.time === 0) result[0] = item;
      else result.push(item);
    }
  return result;
}
export function validate(manifest) {
  manifest = path.resolve(manifest);
  const m = read(manifest);
  check(m.schema === "qtx-unity-v1", "schema must be qtx-unity-v1");
  for (const k of ["width", "height"])
    check(
      Number.isInteger(m[k]) && m[k] > 0 && m[k] % 2 === 0 && m[k] <= 8192,
      "invalid " + k,
    );
  check(
    Number.isInteger(m.fps) && m.fps > 0 && m.fps <= 120,
    "fps must be integer 1..120",
  );
  check(
    Array.isArray(m.scenes) && m.scenes.length > 0,
    "scenes must be nonempty array",
  );
  const assets = new Set();
  const scenes = m.scenes.map((relative) => {
    check(
      typeof relative === "string" && relative.length,
      "invalid scene path",
    );
    const scenePath = path.resolve(path.dirname(manifest), relative),
      s = read(scenePath);
    check(
      finite(s.duration) && s.duration > 0,
      relative + ": invalid duration",
    );
    check(
      /^#[0-9a-f]{6}$/i.test(s.background),
      relative + ": background must be #RRGGBB",
    );
    check(Array.isArray(s.objects), relative + ": objects must be array");
    const ids = new Set();
    const objects = s.objects.map((o) => {
      check(
        o && typeof o.id === "string" && o.id && !ids.has(o.id),
        relative + ": missing/duplicate id",
      );
      ids.add(o.id);
      check(o.type === "sprite", o.id + ": only sprite supported");
      check(
        typeof o.asset === "string" && o.asset.length,
        o.id + ": asset required",
      );
      const asset = path.resolve(path.dirname(scenePath), o.asset);
      check(
        /\.(png|jpe?g)$/i.test(asset) &&
          fs.existsSync(asset) &&
          fs.statSync(asset).isFile(),
        o.id + ": missing or unsupported asset " + asset,
      );
      assets.add(asset);
      values(o, o.id);
      const keys = o.keyframes ?? [];
      check(Array.isArray(keys), o.id + ": invalid keyframes");
      let previous = -1;
      for (const k of keys) {
        check(
          k &&
            finite(k.time) &&
            k.time >= 0 &&
            k.time <= s.duration &&
            k.time > previous,
          o.id + ": keyframes must increase within duration",
        );
        previous = k.time;
        values(k, o.id);
        check(
          ["position", "scale", "rotation", "opacity", "order"].some(
            (p) => p in k,
          ),
          o.id + ": empty keyframe",
        );
      }
      const p = o.position ?? [0, 0],
        sc = o.scale ?? [1, 1];
      return {
        id: o.id,
        asset,
        x: track(p, keys, "position", 0),
        y: track(p, keys, "position", 1),
        sx: track(sc, keys, "scale", 0),
        sy: track(sc, keys, "scale", 1),
        rotation: track(o.rotation ?? 0, keys, "rotation"),
        opacity: track(o.opacity ?? 1, keys, "opacity"),
        order: track(o.order ?? 0, keys, "order"),
      };
    });
    return {
      path: scenePath,
      sha256: hash(scenePath),
      duration: s.duration,
      frames: frameCount(s.duration, m.fps),
      background: s.background,
      objects,
    };
  });
  const totalFrames = scenes.reduce((n, s) => n + s.frames, 0);
  check(
    Number.isSafeInteger(totalFrames) && totalFrames <= 1000000,
    "invalid total frames",
  );
  return {
    schema: m.schema,
    manifest,
    manifestSha256: hash(manifest),
    width: m.width,
    height: m.height,
    fps: m.fps,
    scenes,
    totalFrames,
    assets: [...assets].map((p) => ({ path: p, sha256: hash(p) })),
  };
}
function run(exe, args) {
  const r = spawnSync(exe, args, {
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (r.error || r.status !== 0)
    throw Error(
      exe +
        " failed (" +
        r.status +
        "): " +
        (r.error?.message ?? r.stderr ?? r.stdout),
    );
  return r.stdout;
}
export function unity() {
  const version = fs
    .readFileSync(
      path.join(project, "ProjectSettings/ProjectVersion.txt"),
      "utf8",
    )
    .match(/m_EditorVersion: (.+)/)[1]
    .trim();
  const executable =
    process.env.QTX_UNITY_PATH ??
    path.join(
      process.env.ProgramFiles ?? "C:/Program Files",
      "Unity/Hub/Editor",
      version,
      "Editor/Unity.exe",
    );
  check(
    fs.existsSync(executable),
    "Unity " + version + " missing; set QTX_UNITY_PATH",
  );
  const detected = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "(Get-Item -LiteralPath $env:QTX_DOCTOR_EXECUTABLE).VersionInfo.ProductVersion",
    ],
    {
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env, QTX_DOCTOR_EXECUTABLE: executable },
    },
  );
  check(
    !detected.error && detected.status === 0,
    "Cannot read Unity executable version",
  );
  const actualVersion = detected.stdout.trim().split("_")[0];
  check(
    actualVersion === version,
    "Unity version mismatch: project requires " +
      version +
      ", executable is " +
      actualVersion,
  );
  return {
    executable,
    version: actualVersion,
    discovery: process.env.QTX_UNITY_PATH
      ? "QTX_UNITY_PATH"
      : "Unity Hub standard location",
  };
}
export function doctor() {
  return {
    ...unity(),
    project,
    ffmpeg: run("ffmpeg", ["-version"]).split("\n")[0],
    ffprobe: run("ffprobe", ["-version"]).split("\n")[0],
  };
}
export function frames(manifest) {
  const job = validate(manifest),
    editor = unity(),
    output = path.join(path.dirname(job.manifest), "output/unity");
  fs.mkdirSync(output, { recursive: true });
  const frameDirectory = fs.mkdtempSync(path.join(output, "frames-")),
    log = path.join(frameDirectory, "unity.log"),
    jobFile = path.join(frameDirectory, "render-job.json");
  fs.writeFileSync(
    jobFile,
    JSON.stringify({ ...job, output: frameDirectory }, null, 2),
  );
  try {
    run(editor.executable, [
      "-batchmode",
      "-projectPath",
      project,
      "-executeMethod",
      "QTxVideoDirector.BatchRender.Run",
      "-qtxJob",
      jobFile,
      "-logFile",
      log,
      "-quit",
    ]);
    const actual = fs
      .readdirSync(frameDirectory)
      .filter((n) => /^frame-\d{6}\.png$/.test(n));
    check(
      actual.length === job.totalFrames,
      "incomplete frame sequence: " + actual.length + "/" + job.totalFrames,
    );
    for (let i = 0; i < job.totalFrames; i++)
      check(
        fs.statSync(
          path.join(
            frameDirectory,
            "frame-" + String(i).padStart(6, "0") + ".png",
          ),
        ).size > 0,
        "empty frame " + i,
      );
    const evidence = read(path.join(frameDirectory, "unity-result.json"));
    check(
      evidence.version === editor.version,
      "Unity version mismatch: " + evidence.version,
    );
    return { job, editor, output, frameDirectory, log };
  } catch (e) {
    throw Error(e.message + "\nUnity log: " + log);
  }
}
export function render(manifest) {
  const { job, editor, output, frameDirectory } = frames(manifest),
    film = path.join(frameDirectory, "film.mp4");
  run("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-framerate",
    String(job.fps),
    "-i",
    path.join(frameDirectory, "frame-%06d.png"),
    "-frames:v",
    String(job.totalFrames),
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    film,
  ]);
  const stream = JSON.parse(
    run("ffprobe", [
      "-v",
      "error",
      "-count_frames",
      "-show_streams",
      "-of",
      "json",
      film,
    ]),
  ).streams[0];
  check(
    stream.codec_name === "h264" &&
      stream.width === job.width &&
      stream.height === job.height &&
      Number(stream.nb_read_frames) === job.totalFrames &&
      stream.avg_frame_rate === job.fps + "/1",
    "FFprobe mismatch",
  );
  run("ffmpeg", ["-v", "error", "-xerror", "-i", film, "-f", "null", "-"]);
  const report = {
    schema: "qtx-unity-render-report-v1",
    unityVersion: editor.version,
    manifest: job.manifest,
    manifestSha256: job.manifestSha256,
    width: job.width,
    height: job.height,
    fps: job.fps,
    scenes: job.scenes.map(({ path, sha256, duration, frames }) => ({
      path,
      sha256,
      duration,
      frames,
    })),
    totalFrames: job.totalFrames,
    assets: job.assets,
    frameDirectory,
    output: film,
    outputSha256: hash(film),
    result: "PASS",
    decode: "PASS",
  };
  for (const dir of [output, frameDirectory])
    fs.writeFileSync(
      path.join(dir, "render-report.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
  return report;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const [command, manifest] = process.argv.slice(2);
    check(
      ["doctor", "validate", "frames", "render"].includes(command),
      "usage: doctor|validate|frames|render [unity-project.json]",
    );
    check(command === "doctor" || manifest, "manifest required");
    console.log(
      JSON.stringify(
        command === "doctor"
          ? doctor()
          : command === "validate"
            ? validate(manifest)
            : command === "frames"
              ? frames(manifest)
              : render(manifest),
        null,
        2,
      ),
    );
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}

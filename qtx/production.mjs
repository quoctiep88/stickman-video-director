#!/usr/bin/env node
// Filesystem-only wrapper. Upstream owns style semantics and rendering approvals.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const categories = ['characters', 'props', 'backgrounds', 'symbols', 'interactions'];
const videoDirs = ['assets/generated', 'audio', 'scenes', 'preview', 'output', 'reports'];
const fail = message => { throw new Error(message); };
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
const text = (value, label) => typeof value === 'string' && value.trim() ? value : fail(`${label} must be nonempty text`);
const positive = (value, label) => Number.isFinite(value) && value > 0 ? value : fail(`${label} must be positive`);
const slug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(value) ? value : fail('Use a lowercase alphanumeric hyphenated id');
const style = value => /^[AB][1-9][0-9]*$/.test(value) ? value : fail('Style must be an upstream ID, such as A1 or B1');

// Reject links/junctions along existing path components, including dangling links.
function safe(file) {
  const absolute = path.resolve(file);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) fail(`Links/junctions are not supported: ${current}`);
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return absolute;
}
function inside(root, relative) {
  text(relative, 'Relative path');
  if (path.isAbsolute(relative) || relative.includes(':')) fail('Expected a relative path');
  const target = path.resolve(root, relative), rel = path.relative(root, target);
  if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) fail('Path must stay inside its owner directory');
  return safe(target);
}
function requireKind(file, directory = false) {
  safe(file);
  const stat = fs.lstatSync(file);
  if (!(directory ? stat.isDirectory() : stat.isFile())) fail(`Expected ${directory ? 'directory' : 'file'}: ${file}`);
}
function seriesAt(input) {
  const root = safe(input);
  for (const dir of ['videos', ...categories.map(c => `shared/${c}`)]) requireKind(path.join(root, dir), true);
  requireKind(path.join(root, 'SERIES.md'));
  requireKind(path.join(root, 'series.json'));
  const data = json(path.join(root, 'series.json'));
  if (data.version !== 1 || data.id !== path.basename(root) || data.shared_path !== 'shared') fail('Invalid Series version/id/shared_path');
  slug(data.id); text(data.title, 'Title'); text(data.language, 'Language'); style(data.default_style_id);
  const ratio = /^(\d+):(\d+)$/.exec(data.aspect_ratio);
  if (!ratio || !Number(ratio[1]) || !Number(ratio[2])) fail('Invalid aspect_ratio');
  const {width, height} = data.resolution ?? {};
  if (![width, height].every(n => Number.isInteger(n) && n > 0) || Math.abs(width / height - Number(ratio[1]) / Number(ratio[2])) > 0.01) fail('Invalid resolution/aspect_ratio');
  positive(data.fps, 'fps');
  const {min, max} = data.target_duration_seconds ?? {};
  positive(min, 'Minimum duration'); positive(max, 'Maximum duration');
  if (min > max) fail('Minimum duration exceeds maximum');
  return {root, data};
}
function videoAt(series, id) {
  slug(id);
  const root = inside(series.root, `videos/${id}`);
  for (const dir of videoDirs) requireKind(path.join(root, dir), true);
  for (const file of ['brief.md', 'plan.md', 'script.md', 'video.json']) requireKind(path.join(root, file));
  const data = json(path.join(root, 'video.json'));
  if (data.version !== 1 || data.id !== id || data.shared_path !== '../../shared') fail('Invalid Video version/id/shared_path');
  text(data.title, 'Title'); text(data.topic, 'Topic'); text(data.language, 'Language');
  style(data.style_id); positive(data.duration_seconds, 'Duration');
  return {root, data};
}
function newDirectory(dir) {
  safe(dir);
  if (fs.existsSync(dir)) fail(`Already exists; refusing overwrite: ${dir}`);
  fs.mkdirSync(path.dirname(dir), {recursive: true});
  fs.mkdirSync(dir); // Exclusive creation: never merge with an existing workspace.
}
export function initSeries(input, options = {}) {
  const root = safe(input), id = slug(path.basename(root));
  const data = {version: 1, id, title: text(options.title ?? id, 'Title'), language: text(options.language ?? 'en', 'Language'), default_style_id: style(options.style ?? 'B1'), aspect_ratio: '16:9', resolution: {width: 1280, height: 720}, fps: 30, target_duration_seconds: {min: 60, max: 480}, shared_path: 'shared'};
  newDirectory(root);
  for (const dir of ['videos', ...categories.map(c => `shared/${c}`)]) fs.mkdirSync(path.join(root, dir), {recursive: true});
  const template = fs.readFileSync(new URL('./templates/SERIES.md', import.meta.url), 'utf8');
  fs.writeFileSync(path.join(root, 'SERIES.md'), template.replace(/\{\{(title|language|style)\}\}/g, (_, key) => ({title: data.title, language: data.language, style: data.default_style_id})[key]), {flag: 'wx'});
  writeJSON(path.join(root, 'series.json'), data);
  return {series: root};
}
export function initVideo(input, id, options = {}) {
  const series = seriesAt(input); slug(id);
  const root = inside(series.root, `videos/${id}`);
  const data = {version: 1, id, title: text(options.title ?? id, 'Title'), topic: text(options.topic ?? options.title ?? id, 'Topic'), language: series.data.language, duration_seconds: positive(Number(options.duration ?? series.data.target_duration_seconds.min), 'Duration'), style_id: style(options.style ?? series.data.default_style_id), shared_path: '../../shared'};
  newDirectory(root);
  for (const dir of videoDirs) fs.mkdirSync(path.join(root, dir), {recursive: true});
  writeJSON(path.join(root, 'video.json'), data);
  fs.writeFileSync(path.join(root, 'brief.md'), `# ${data.title}\n\nTopic: ${data.topic}\nLanguage: ${data.language}\nRequested duration: ${data.duration_seconds}s\nUpstream style: ${data.style_id}\n\nRead SERIES.md and inspect relevant ../../shared/ assets before planning.\nRefine the intended audience, takeaway and scope here.\n`);
  fs.writeFileSync(path.join(root, 'plan.md'), '# Plan\n\n## Story beats\n\nTo author from the brief.\n\n## Visual / asset plan\n\nInspect Series shared assets first; list exact reusable paths and any new assets needed.\nNew assets belong in assets/generated/. Obtain user plan/script approval before production.\n');
  fs.writeFileSync(path.join(root, 'script.md'), '# Script\n\nAuthor exact narration after reading the Series bible and brief.\n');
  return {video: root};
}

// File digest is SHA256(bytes); directories hash a sorted JSON tree of names,
// entry types and file digests (including empty directories). No metadata/mtime.
export function contentHash(file) {
  safe(file);
  const stat = fs.lstatSync(file);
  if (stat.isFile()) return {kind: 'file', sha256: hash(fs.readFileSync(file))};
  if (!stat.isDirectory()) fail(`Only regular files/directories are supported: ${file}`);
  const entries = fs.readdirSync(file).sort().map(name => [name, contentHash(path.join(file, name))]);
  return {kind: 'directory', sha256: hash(JSON.stringify(entries))};
}
export function promoteAsset(input, id, sourceRelative, destinationRelative) {
  const series = seriesAt(input), video = videoAt(series, id);
  const source = inside(video.root, sourceRelative);
  const destination = inside(series.root, destinationRelative);
  const relative = path.relative(path.join(series.root, 'shared'), destination).split(path.sep);
  if (!categories.includes(relative[0]) || relative.length < 2) fail('Destination must be an asset inside a Series shared category');
  const digest = contentHash(source);
  const recordPath = path.join(series.root, 'promotions.json'); safe(recordPath);
  const records = fs.existsSync(recordPath) ? json(recordPath) : [];
  if (!Array.isArray(records)) fail('Invalid promotions.json');
  const promotedPath = path.relative(series.root, destination).split(path.sep).join('/');
  const previous = records.find(r => r.promoted_path === promotedPath);
  if (previous && (previous.sha256 !== digest.sha256 || previous.kind !== digest.kind)) fail('Promotion provenance differs; explicit replacement decision required');
  const exists = fs.existsSync(destination);
  if (exists && JSON.stringify(contentHash(destination)) !== JSON.stringify(digest)) fail('Destination differs; refusing to overwrite approved content');
  if (!exists) {
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.cpSync(source, destination, {recursive: true, force: false, errorOnExist: true});
    if (JSON.stringify(contentHash(destination)) !== JSON.stringify(digest)) fail('Copy verification failed; inspect source and destination before retrying');
  }
  if (!previous) {
    records.push({episode: id, original_path: path.relative(video.root, source).split(path.sep).join('/'), promoted_path: promotedPath, ...digest, promoted_at: new Date().toISOString()});
    const temporary = `${recordPath}.${crypto.randomUUID()}.tmp`;
    writeJSON(temporary, records);
    fs.renameSync(temporary, recordPath);
  }
  return {source, destination, ...digest, reused: exists, provenance: recordPath};
}
export function check(input, id) {
  const series = seriesAt(input);
  const ids = id ? [id] : fs.readdirSync(path.join(series.root, 'videos'));
  for (const video of ids) videoAt(series, video);
  const recordsPath = path.join(series.root, 'promotions.json'); safe(recordsPath);
  if (fs.existsSync(recordsPath)) {
    const records = json(recordsPath);
    if (!Array.isArray(records)) fail('Invalid promotions.json');
    for (const record of records) {
      slug(record.episode); text(record.original_path, 'Original path');
      inside(path.join(series.root, 'videos', record.episode), record.original_path);
      const target = inside(series.root, record.promoted_path);
      const relative = path.relative(path.join(series.root, 'shared'), target).split(path.sep);
      if (!categories.includes(relative[0]) || relative.length < 2 || !Number.isFinite(Date.parse(record.promoted_at))) fail('Invalid promotion record');
      const actual = contentHash(target);
      if (actual.sha256 !== record.sha256 || actual.kind !== record.kind) fail(`Approved asset differs from provenance: ${target}`);
    }
  }
  return {valid: true, series: series.root, videos: ids};
}
const usage = `node qtx/production.mjs
  init-series SERIES [--title TEXT] [--language en] [--style B1]
  init-video SERIES EPISODE [--title TEXT] [--topic TEXT] [--style B1] [--duration 480]
  promote-asset SERIES EPISODE EPISODE_RELATIVE_SOURCE shared/CATEGORY/ASSET
  check SERIES [EPISODE]
Style IDs are syntax-checked only; upstream remains authoritative.`;
function main(args) {
  const command = args.shift();
  if (command === '--help' || !command) return console.log(usage);
  const allowed = {'init-series': ['title', 'language', 'style'], 'init-video': ['title', 'topic', 'style', 'duration'], 'promote-asset': [], check: []}[command];
  if (!allowed) fail(usage);
  const positional = [], options = {};
  while (args.length) {
    const arg = args.shift();
    if (!arg.startsWith('--')) { positional.push(arg); continue; }
    const key = arg.slice(2);
    if (!allowed.includes(key) || key in options || !args.length || args[0].startsWith('--')) fail(`Invalid option: ${arg}`);
    options[key] = args.shift();
  }
  const counts = {'init-series': [1], 'init-video': [2], 'promote-asset': [4], check: [1, 2]};
  if (!counts[command].includes(positional.length)) fail(usage);
  const result = command === 'init-series' ? initSeries(positional[0], options)
    : command === 'init-video' ? initVideo(...positional, options)
      : command === 'promote-asset' ? promoteAsset(...positional) : check(...positional);
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; }
}

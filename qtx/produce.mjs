#!/usr/bin/env node
// Filesystem production commands. Codex directs; humans approve; Unity executes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {check, contentHash} from './production.mjs';
import {synthesize, MODEL, FORMAT} from './integrations/elevenlabs.mjs';
import {alignedWords, captionsFromWords, subtitles} from './timing.mjs';
import {validate, frames, project as engineProject} from './unity/render.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = file => contentHash(file).sha256;
const requireTrue = (ok, message) => { if (!ok) throw Error(message); };
function save(file, data, exclusive = false) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  if (exclusive) fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
  else {
    const temp = file + '.' + crypto.randomUUID() + '.tmp';
    fs.writeFileSync(temp, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
    fs.renameSync(temp, file);
  }
}
function run(exe, args, cwd) {
  const r = spawnSync(exe, args, {cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024});
  if (r.error || r.status !== 0) throw Error(`${exe} failed: ${r.error?.message ?? r.stderr?.slice(-3000)}`);
  return r.stdout;
}
const probe = file => JSON.parse(run('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', file]));
function ownerFile(root, file) {
  const rel = path.relative(root, file);
  requireTrue(rel && rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel), 'Input escapes its owning directory: ' + file);
  digest(file); // P02 rejects links/junctions as well.
  return file;
}
export function workspace(series, id) {
  check(series, id);
  return {series: path.resolve(series), episode: path.resolve(series, 'videos', id)};
}
export function planInputs(w) {
  const names = ['plan.md', 'script.md', 'visual-plan.md', 'brief.md', 'video.json'];
  const inputs = {};
  for (const name of names) {
    const file = path.join(w.episode, name);
    requireTrue(fs.readFileSync(file, 'utf8').trim().length > 0, 'Empty planning file: ' + name);
    inputs['episode/' + name] = digest(file);
  }
  for (const name of ['SERIES.md', 'series.json']) inputs['series/' + name] = digest(path.join(w.series, name));
  inputs['series/shared'] = digest(path.join(w.series, 'shared'));
  requireTrue(!/Author exact narration after reading|To author from the brief/.test(fs.readFileSync(path.join(w.episode, 'script.md'), 'utf8') + fs.readFileSync(path.join(w.episode, 'plan.md'), 'utf8')), 'Replace planning placeholders');
  return {inputs, fingerprint: sha(JSON.stringify(inputs))};
}
export function approvePlan(w, note) {
  requireTrue(typeof note === 'string' && note.trim(), 'Explicit human approval note required');
  const record = {schema: 'qtx-plan-approval-v1', ...planInputs(w), note, approved_at: new Date().toISOString()};
  save(path.join(w.episode, 'plan-approval.json'), record);
  return record;
}
export function checkPlan(w) {
  const approval = read(path.join(w.episode, 'plan-approval.json'));
  requireTrue(approval.schema === 'qtx-plan-approval-v1' && approval.note?.trim() && Number.isFinite(Date.parse(approval.approved_at)), 'Invalid plan approval record');
  requireTrue(approval.fingerprint === planInputs(w).fingerprint, 'Plan approval invalidated: inputs changed; explicit reapproval required');
  return approval;
}
export function plan(w) {
  const context = {schema: 'qtx-production-context-v1', series: w.series, episode: w.episode,
    files: ['SERIES.md', 'series.json'].map(f => path.join(w.series, f)).concat(['brief.md', 'video.json', 'plan.md', 'script.md', 'visual-plan.md'].map(f => path.join(w.episode, f))),
    shared: fs.readdirSync(path.join(w.series, 'shared')).sort().map(category => ({category, assets: fs.readdirSync(path.join(w.series, 'shared', category)).sort()})),
    ...planInputs(w)};
  save(path.join(w.episode, 'reports/production-context.json'), context);
  return context;
}
function voiceConfig(w) {
  const episode = read(path.join(w.episode, 'video.json')), series = read(path.join(w.series, 'series.json'));
  const voiceId = process.env.ELEVENLABS_VOICE_ID || episode.voice_id || series.voice_id;
  const modelId = process.env.ELEVENLABS_MODEL_ID || episode.voice_model_id || series.voice_model_id || MODEL;
  requireTrue(voiceId, 'Set ELEVENLABS_VOICE_ID locally; no default or alternate voice is selected');
  return {voiceId, modelId};
}
export function verifiedVoice(w) {
  const record = read(path.join(w.episode, 'audio/narration.json'));
  requireTrue(record.provider === 'ElevenLabs' && record.script_sha256 === digest(path.join(w.episode, 'script.md')), 'Narration script/provider mismatch');
  requireTrue(record.audio_sha256 === digest(path.join(w.episode, 'audio/narration.mp3')), 'Narration bytes changed');
  requireTrue(record.response_sha256 === digest(path.join(w.episode, 'audio/elevenlabs-response.json')), 'Provider alignment response changed');
  requireTrue(Number.isFinite(record.duration) && record.duration > 0, 'Invalid narration duration');
  return record;
}
export async function voice(w) {
  const approval = checkPlan(w), config = voiceConfig(w);
  const script = fs.readFileSync(path.join(w.episode, 'script.md'), 'utf8');
  const request = {script_sha256: sha(script), voice_id: config.voiceId, model_id: config.modelId, output_format: FORMAT, apply_text_normalization: 'off'};
  const requestFingerprint = sha(JSON.stringify(request));
  const receiptPath = path.join(w.episode, 'audio/narration.json');
  if (fs.existsSync(receiptPath)) {
    const receipt = verifiedVoice(w);
    requireTrue(receipt.request_fingerprint === requestFingerprint, 'Existing narration differs; preserve it and make an explicit recovery/revoice decision');
    return {...receipt, reused: true};
  }
  requireTrue(process.env.ELEVENLABS_API_KEY, 'Set ELEVENLABS_API_KEY locally');
  for (const name of ['narration.mp3', 'elevenlabs-response.json', 'voice-attempt.json'])
    requireTrue(!fs.existsSync(path.join(w.episode, 'audio', name)), 'Existing voice artifact/attempt; inspect before explicit recovery. No automatic paid retry.');
  const attemptPath = path.join(w.episode, 'audio/voice-attempt.json');
  const attempt = {request, request_fingerprint: requestFingerprint, plan_fingerprint: approval.fingerprint, requested_at: new Date().toISOString(), status: 'requested'};
  save(attemptPath, attempt, true);
  try {
    const result = await synthesize({text: script, ...config, apiKey: process.env.ELEVENLABS_API_KEY});
    fs.writeFileSync(path.join(w.episode, 'audio/narration.mp3'), result.audio, {flag: 'wx'});
    save(path.join(w.episode, 'audio/elevenlabs-response.json'), result.metadata, true);
    const info = probe(path.join(w.episode, 'audio/narration.mp3'));
    requireTrue(info.streams.some(s => s.codec_type === 'audio'), 'Provider audio has no audio stream');
    const duration = Number(info.format.duration);
    requireTrue(Number.isFinite(duration) && duration > 0, 'Provider audio duration invalid');
    const receipt = {schema: 'qtx-narration-v1', provider: 'ElevenLabs', ...request,
      request_fingerprint: requestFingerprint, plan_fingerprint: approval.fingerprint,
      audio_sha256: digest(path.join(w.episode, 'audio/narration.mp3')),
      response_sha256: digest(path.join(w.episode, 'audio/elevenlabs-response.json')),
      duration, timing_source: 'ElevenLabs original character alignment', created_at: new Date().toISOString()};
    save(receiptPath, receipt, true);
    save(attemptPath, {...attempt, status: 'saved'});
    return {...receipt, reused: false};
  } catch (error) {
    save(attemptPath, {...attempt, status: 'failed-or-incomplete', error: error.message});
    throw error;
  }
}
export function timing(w) {
  checkPlan(w);
  const narration = verifiedVoice(w), raw = read(path.join(w.episode, 'audio/elevenlabs-response.json'));
  const script = fs.readFileSync(path.join(w.episode, 'script.md'), 'utf8');
  const words = alignedWords(raw.alignment, script, narration.duration);
  const receipt = {schema: 'qtx-word-timings-v1', source: narration.timing_source, script_sha256: narration.script_sha256, audio_sha256: narration.audio_sha256, words};
  const file = path.join(w.episode, 'audio/word-timings.json');
  if (fs.existsSync(file)) {
    requireTrue(JSON.stringify(read(file)) === JSON.stringify(receipt), 'Existing word timings differ; inspect before replacing');
    for (const name of ['captions.json', 'narration.srt', 'narration.vtt']) requireTrue(fs.existsSync(path.join(w.episode, 'audio', name)), 'Incomplete caption artifacts');
    return {words: words.length, reused: true};
  }
  const cues = captionsFromWords(words);
  save(file, receipt, true);
  save(path.join(w.episode, 'audio/captions.json'), cues, true);
  for (const ext of ['srt', 'vtt']) fs.writeFileSync(path.join(w.episode, 'audio/narration.' + ext), subtitles(cues, ext), {flag: 'wx'});
  return {words: words.length, captions: cues.length, reused: false};
}

const font = path.join(repo, 'skills/directing-stickman-videos/assets/fonts/NotoSans.ttf');
function engineInputs() {
  const files = ['qtx/produce.mjs', 'qtx/timing.mjs', 'qtx/unity/render.mjs', 'qtx/unity/animation.mjs',
    'skills/directing-stickman-videos/scripts/autopilot-core.mjs'];
  const inputs = Object.fromEntries(files.map(file => [file, digest(path.join(repo, file))]));
  for (const dir of ['Assets', 'Packages']) inputs['unity/' + dir] = digest(path.join(engineProject, dir));
  // Editor diagnostics are not visual execution inputs and Unity rewrites them.
  for (const name of fs.readdirSync(path.join(engineProject, 'ProjectSettings')).sort())
    if (name !== 'ProjectAuditorSettings.asset') inputs['unity/ProjectSettings/' + name] = digest(path.join(engineProject, 'ProjectSettings', name));
  inputs.caption_font = digest(font);
  return inputs;
}
function cuesAt(w, duration) {
  const cues = read(path.join(w.episode, 'audio/captions.json'));
  requireTrue(Array.isArray(cues) && cues.length > 0, 'Caption groups required');
  let previous = 0;
  for (const cue of cues) {
    requireTrue(Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.start >= previous && cue.end > cue.start && cue.end <= duration + 0.1 && typeof cue.text === 'string' && cue.text.trim() && !/[\r\n{}\\<>]/.test(cue.text), 'Invalid caption group');
    previous = cue.end;
  }
  return cues;
}
function soundEffects(w) {
  const file = path.join(w.episode, 'production.json');
  const data = fs.existsSync(file) ? read(file) : {sfx: []};
  requireTrue(Array.isArray(data.sfx) && data.sfx.length <= 8, 'production.json requires sfx array (maximum eight cues)');
  return data.sfx.map(cue => {
    requireTrue(typeof cue.path === 'string' && Number.isFinite(cue.start) && cue.start >= 0 && Number.isFinite(cue.gain) && cue.gain >= 0 && cue.gain <= 1, 'Invalid SFX cue');
    const file = ownerFile(w.episode, path.resolve(w.episode, cue.path));
    return {...cue, path: file, sha256: digest(file)};
  });
}
export function productionInputs(w) {
  const approval = checkPlan(w), narration = verifiedVoice(w);
  const manifest = path.join(w.episode, 'unity-project.json'), job = validate(manifest);
  const roots = [w.episode, path.join(w.series, 'shared')];
  for (const scene of job.scenes) ownerFile(w.episode, scene.path);
  for (const asset of job.assets) {
    requireTrue(roots.some(root => { const rel = path.relative(root, asset.path); return rel && rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel); }), 'Cross-Series/outside asset reference refused: ' + asset.path);
    digest(asset.path);
  }
  const duration = job.totalFrames / job.fps;
  requireTrue(duration >= narration.duration && duration - narration.duration <= 0.5, 'Scene duration must follow measured narration (0–0.5s frame padding only)');
  const timings = read(path.join(w.episode, 'audio/word-timings.json'));
  requireTrue(timings.audio_sha256 === narration.audio_sha256 && timings.script_sha256 === narration.script_sha256, 'Word timings do not match narration');
  cuesAt(w, narration.duration);
  const inputs = {plan_fingerprint: approval.fingerprint,
    narration: digest(path.join(w.episode, 'audio/narration.json')),
    audio: narration.audio_sha256, alignment: narration.response_sha256,
    words: digest(path.join(w.episode, 'audio/word-timings.json')),
    captions: digest(path.join(w.episode, 'audio/captions.json')),
    manifest: job.manifestSha256,
    scenes: job.scenes.map(s => ({path: path.relative(w.episode, s.path), sha256: s.sha256})),
    assets: job.assets.map(a => ({path: path.relative(w.series, a.path), sha256: a.sha256})),
    sfx: soundEffects(w), engine: engineInputs(),
    tools: {ffmpeg: run('ffmpeg', ['-version']).split('\n')[0].trim(), ffprobe: run('ffprobe', ['-version']).split('\n')[0].trim()}};
  return {inputs, fingerprint: sha(JSON.stringify(inputs)), job, narration};
}
export function checkPreview(w) {
  const approval = read(path.join(w.episode, 'preview/preview-approval.json'));
  const report = read(path.join(w.episode, 'reports/preview-report.json'));
  const current = productionInputs(w);
  requireTrue(approval.schema === 'qtx-preview-approval-v1' && approval.note?.trim() && Number.isFinite(Date.parse(approval.approved_at)), 'Invalid preview approval record');
  requireTrue(report.input_fingerprint === current.fingerprint && approval.input_fingerprint === current.fingerprint, 'Preview approval invalidated: production inputs changed');
  const output = ownerFile(path.join(w.episode, 'preview'), path.resolve(w.episode, report.output));
  requireTrue(report.output_sha256 === digest(output) && approval.preview_sha256 === report.output_sha256 && approval.report_sha256 === digest(path.join(w.episode, 'reports/preview-report.json')), 'Preview approval invalidated: preview bytes/report changed');
  return approval;
}
export function approvePreview(w, note) {
  requireTrue(typeof note === 'string' && note.trim(), 'Explicit human technical/creative preview approval note required');
  const report = read(path.join(w.episode, 'reports/preview-report.json'));
  const current = productionInputs(w);
  requireTrue(report.input_fingerprint === current.fingerprint && report.decode === 'PASS', 'Preview is stale or unverified');
  const output = ownerFile(path.join(w.episode, 'preview'), path.resolve(w.episode, report.output));
  requireTrue(digest(output) === report.output_sha256, 'Preview bytes changed');
  const approval = {schema: 'qtx-preview-approval-v1', input_fingerprint: current.fingerprint,
    preview_sha256: report.output_sha256, report_sha256: digest(path.join(w.episode, 'reports/preview-report.json')),
    note, approved_at: new Date().toISOString()};
  save(path.join(w.episode, 'preview/preview-approval.json'), approval);
  return approval;
}
function assCaptions(cues, width, height) {
  const stamp = s => { const n = Math.round(s * 100); return `${Math.floor(n/360000)}:${String(Math.floor(n/6000)%60).padStart(2,'0')}:${String(Math.floor(n/100)%60).padStart(2,'0')}.${String(n%100).padStart(2,'0')}`; };
  return `[Script Info]\nScriptType: v4.00+\nPlayResX: ${width}\nPlayResY: ${height}\nWrapStyle: 2\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Noto Sans,${Math.round(height*34/720)},&H00FFFFFF,&H00FFFFFF,&H00222222,&H00222222,0,0,0,0,100,100,0,0,3,10,0,2,50,50,34,1\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n` + cues.map(c => `Dialogue: 0,${stamp(c.start)},${stamp(c.end)},Default,,0,0,0,,${c.text}`).join('\n') + '\n';
}
export function produceVideo(w, full = false, seconds = 25) {
  const approval = full ? checkPreview(w) : null;
  const before = productionInputs(w);
  requireTrue(full || (Number.isFinite(seconds) && seconds >= 20 && seconds <= 30 && seconds < before.narration.duration), 'Preview must be 20–30 seconds and shorter than narration');
  const reportPath = path.join(w.episode, 'reports', full ? 'final-report.json' : 'preview-report.json');
  if (fs.existsSync(reportPath)) {
    const previous = read(reportPath), output = path.resolve(w.episode, previous.output);
    if (previous.input_fingerprint === before.fingerprint && (full || previous.requested_seconds === seconds) && fs.existsSync(output) && digest(output) === previous.output_sha256 && previous.captions.every(c => fs.existsSync(path.join(w.episode,c.path)) && digest(path.join(w.episode,c.path)) === c.sha256)) return {...previous, reused: true};
    requireTrue(!full, 'Existing final differs; preserve output and explicitly resolve before replacement');
  }
  const parent = path.join(w.episode, full ? 'output' : 'preview');
  fs.mkdirSync(parent, {recursive: true});
  const directory = fs.mkdtempSync(path.join(parent, 'run-'));
  const manifest = path.join(w.episode, 'unity-project.json');
  const rendered = frames(manifest, full ? undefined : Math.round(seconds * before.job.fps)), duration = rendered.job.totalFrames / rendered.job.fps;
  const cues = cuesAt(w, before.narration.duration).filter(c => c.start < duration).map(c => ({...c, end: Math.min(c.end, duration)}));
  fs.copyFileSync(font, path.join(directory, 'NotoSans.ttf'));
  fs.writeFileSync(path.join(directory, 'captions.ass'), assCaptions(cues, before.job.width, before.job.height));
  const output = path.join(directory, full ? 'final.mp4' : 'preview.mp4');
  const args = ['-v', 'error', '-n', '-framerate', String(rendered.job.fps), '-i', path.join(rendered.frameDirectory, 'frame-%06d.png'), '-i', path.join(w.episode, 'audio/narration.mp3')];
  const sfx = soundEffects(w).filter(c => c.start < duration);
  for (const cue of sfx) args.push('-i', cue.path);
  const filters = ['[0:v]subtitles=captions.ass:fontsdir=.[v]', '[1:a]aresample=48000,apad[voice]'];
  sfx.forEach((cue,i) => filters.push(`[${i+2}:a]aresample=48000,volume=${cue.gain},adelay=${Math.round(cue.start*1000)}:all=1[s${i}]`));
  filters.push(`[voice]${sfx.map((_,i)=>`[s${i}]`).join('')}amix=inputs=${sfx.length+1}:duration=first:normalize=0,alimiter=limit=0.95:level=false:latency=true[a]`);
  args.push('-filter_complex', filters.join(';'), '-map', '[v]', '-map', '[a]', '-t', String(duration), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', output);
  run('ffmpeg', args, directory);
  const info = probe(output), video = info.streams.find(s => s.codec_type === 'video'), audio = info.streams.find(s => s.codec_type === 'audio');
  requireTrue(video?.width === before.job.width && video?.height === before.job.height && video?.avg_frame_rate === before.job.fps + '/1' && video?.codec_name === 'h264' && audio?.codec_name === 'aac' && Math.abs(Number(info.format.duration) - duration) < 0.15, 'Final media probe mismatch');
  run('ffmpeg', ['-v', 'error', '-xerror', '-i', output, '-f', 'null', '-']);
  requireTrue(productionInputs(w).fingerprint === before.fingerprint, 'Production inputs changed during render; output is not approved');
  const captions = [];
  for (const ext of ['srt','vtt']) {
    const file = path.join(directory, full ? 'final.'+ext : 'preview.'+ext);
    fs.writeFileSync(file, subtitles(cues, ext), {flag: 'wx'});
    captions.push({path: path.relative(w.episode,file), sha256: digest(file)});
  }
  if (full) {
    for (const name of ['final.mp4', 'final.srt', 'final.vtt']) requireTrue(!fs.existsSync(path.join(parent,name)), 'Refusing to overwrite existing final artifact');
    for (const name of ['final.mp4', 'final.srt', 'final.vtt']) fs.copyFileSync(path.join(directory,name),path.join(parent,name),fs.constants.COPYFILE_EXCL);
  }
  const finalOutput = full ? path.join(parent, 'final.mp4') : output;
  const report = {schema: 'qtx-production-render-v1', input_fingerprint: before.fingerprint,
    inputs: before.inputs, script_sha256: before.narration.script_sha256, voice_sha256: before.narration.audio_sha256,
    output: path.relative(w.episode,finalOutput), output_sha256: digest(finalOutput),
    duration: Number(info.format.duration), narration_duration: before.narration.duration,
    width: video.width, height: video.height, fps: before.job.fps, frames: rendered.job.totalFrames,
    unity_version: rendered.editor.version, range: [0,duration], requested_seconds: full ? null : seconds,
    captions: full ? captions.map(c => ({...c, path: path.join('output',path.basename(c.path))})) : captions,
    audio: 'Original-speed ElevenLabs narration; limiter and optional quiet local SFX',
    decode: 'PASS', approval_fingerprint: approval ? sha(JSON.stringify(approval)) : null,
    human_review: full ? 'Explicit preview approval recorded' : 'Required; technical checks are not creative approval',
    created_at: new Date().toISOString()};
  save(reportPath, report);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, series, id, ...args] = process.argv.slice(2);
    requireTrue(series && id, 'Usage: node qtx/produce.mjs plan|approve-plan|check-plan|voice|timing|preview|approve-preview|render SERIES EPISODE [--note TEXT | --seconds N]');
    const w = workspace(series, id);
    const note = args[0] === '--note' && args.length === 2 ? args[1] : undefined;
    const seconds = args[0] === '--seconds' && args.length === 2 ? Number(args[1]) : 25;
    requireTrue(args.length === 0 || note || (args[0] === '--seconds' && args.length === 2 && command === 'preview'), 'Unexpected arguments');
    let result;
    switch (command) {
      case 'plan': result = plan(w); break;
      case 'approve-plan': result = approvePlan(w, note); break;
      case 'check-plan': result = checkPlan(w); break;
      case 'voice': result = await voice(w); break;
      case 'timing': result = timing(w); break;
      case 'preview': result = produceVideo(w, false, seconds); break;
      case 'approve-preview': result = approvePreview(w, note); break;
      case 'render': result = produceVideo(w, true); break;
      default: throw Error('Unknown production command: ' + command);
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

// Static form packaging and a thin call to the unchanged upstream verifier.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {loadProject, hashFile, json} from '../skills/directing-stickman-videos/scripts/autopilot-core.mjs';
import {planBStyleReference, verifyBStyleReferenceReview} from '../skills/directing-stickman-videos/scripts/b-style-reference-review.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export function pack(projectFile, evidenceDir) {
  evidenceDir = fs.realpathSync(evidenceDir);
  const ledgerFile = path.join(evidenceDir, 'evidence.json');
  const evidence = json(ledgerFile);
  const template = json(path.join(evidenceDir, 'review-template.json'));
  const full = loadProject(projectFile);
  const project = loadProject(projectFile, {seconds: evidence.scope.end});
  const requireMatch = (yes, message) => { if (!yes) throw Error(message); };
  requireMatch(project.file === evidence.project_inputs.file, 'Different canonical project');
  requireMatch(project.fingerprint === evidence.project_fingerprint, 'Stale scoped project fingerprint');
  requireMatch(JSON.stringify(planBStyleReference(project)) === JSON.stringify(evidence.plan), 'Stale native plan');
  requireMatch(hashFile(evidence.output) === evidence.output_sha256, 'Changed candidate video');
  requireMatch(template.evidence_sha256 === hashFile(ledgerFile) && template.video_sha256 === evidence.output_sha256, 'Stale template binding');
  requireMatch(!template.reviewer.id && template.full_playback.status === 'unknown' && !template.full_playback.viewed_ranges.length && !template.full_playback.observations.length && template.baseline_comparisons.every(b => b.start === null && b.end === null && !b.observations.length) && !template.blocking_issues.length, 'Use the untouched unknown native template');
  requireMatch(JSON.stringify(template.shots.map(s => s.id)) === JSON.stringify(evidence.plan.shots.map(s => s.id)), 'Template shot mismatch');
  for (const shot of template.shots) {
    requireMatch(JSON.stringify(Object.keys(shot.checks)) === JSON.stringify(evidence.plan.checks), 'Template criteria mismatch');
    requireMatch(Object.values(shot.checks).every(c => c.status === 'unknown' && !c.observations.length && !c.comparisons.length), 'Use the untouched unknown native template');
  }
  for (const item of [...evidence.project_inputs.inputs, ...evidence.reference_manifests, ...evidence.references]) {
    requireMatch(hashFile(item.path) === item.sha256, 'Changed bound file: ' + item.path);
  }
  // Read current manifests as well as verifying their native evidence hashes.
  const manifests = evidence.reference_manifests.map(m => ({path: m.path, data: json(m.path)}));
  const artifacts = evidence.artifacts.map(a => {
    const file = path.resolve(evidenceDir, a.file);
    requireMatch(file.startsWith(evidenceDir + path.sep), 'Artifact escapes evidence directory');
    requireMatch(hashFile(file) === a.sha256, 'Changed evidence: ' + a.id);
    return {...a, url: pathToFileURL(file).href};
  });
  return {template, evidence, artifacts, manifests, fullFingerprint: full.fingerprint,
    candidateUrl: pathToFileURL(evidence.output).href,
    references: evidence.references.map(r => ({...r, url: pathToFileURL(r.path).href})),
    verifyCommand: `node "${path.join(here, 'human-review.mjs')}" verify "${project.file}" "${evidenceDir}" "${path.join(evidenceDir, 'independent-review.json')}"`};
}

export function renderPage(data) {
  return fs.readFileSync(path.join(here, 'human-review.html'), 'utf8')
    .replace('/* PACK_DATA */', () => `const PACK = ${JSON.stringify(data).replaceAll('<', '\\u003c')};`)
    .replace('/* UI_SCRIPT */', () => fs.readFileSync(path.join(here, 'human-review-ui.js'), 'utf8'));
}

// Exact opaque routes only: request paths are never converted to filesystem paths.
export async function serve(data, port = 4177) {
  const bound = structuredClone(data), routes = new Map();
  const bind = url => {
    const file = fs.realpathSync(fileURLToPath(url));
    const route = `/media/${routes.size}${path.extname(file).toLowerCase()}`;
    routes.set(route, file); return route;
  };
  bound.candidateUrl = bind(bound.candidateUrl);
  for (const item of [...bound.artifacts, ...bound.references]) item.url = bind(item.url);
  const page = Buffer.from(renderPage(bound));
  const mime = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.mp4':'video/mp4'};
  const server = http.createServer((req, res) => {
    const finish = (status, message) => { res.writeHead(status); res.end(message); };
    if (!['GET', 'HEAD'].includes(req.method)) return finish(405, 'Read only');
    if (req.url === '/' || req.url === '/human-review.html') {
      res.writeHead(200, {'Content-Type':mime['.html'], 'Content-Length':page.length, 'Cache-Control':'no-store'});
      return res.end(req.method === 'HEAD' ? undefined : page);
    }
    if (req.url === '/favicon.ico') return finish(204);
    const file = routes.get(req.url);
    if (!file) return finish(404, 'Not in review pack');
    const size = fs.statSync(file).size;
    let start = 0, end = size - 1, status = 200;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.setHeader('Content-Range', `bytes */${size}`); return finish(416); }
      if (!match[1]) start = Math.max(0, size - Number(match[2]));
      else { start = Number(match[1]); if (match[2]) end = Math.min(end, Number(match[2])); }
      if (start > end || start >= size) { res.setHeader('Content-Range', `bytes */${size}`); return finish(416); }
      status = 206; res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
    }
    res.writeHead(status, {'Content-Type':mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length':end-start+1, 'Accept-Ranges':'bytes', 'X-Content-Type-Options':'nosniff'});
    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(file, {start, end});
    stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); stream.pipe(res);
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return {server, data:bound, routes, url:`http://127.0.0.1:${server.address().port}/human-review.html`};
}

async function main() {
  const [command, projectArg, dirArg, reviewArg] = process.argv.slice(2);
  if (!['build', 'serve', 'verify'].includes(command) || !projectArg || !dirArg) throw Error('Usage: node qtx/human-review.mjs build|serve|verify PROJECT EVIDENCE_DIR [REVIEW_JSON]');
  const projectFile = fs.realpathSync(projectArg), evidenceDir = fs.realpathSync(dirArg);
  if (command === 'serve') {
    console.log((await serve(pack(projectFile, evidenceDir))).url);
  } else if (command === 'build') {
    const data = pack(projectFile, evidenceDir);
    const output = path.join(evidenceDir, 'human-review.html');
    fs.writeFileSync(output, renderPage(data));
    console.log(JSON.stringify({output, shots: data.template.shots.length, references: data.references.filter(r => r.required_comparison).map(r => r.id), fullFingerprint: data.fullFingerprint, previewSha256: data.template.video_sha256}, null, 2));
  } else {
    const evidence = json(path.join(evidenceDir, 'evidence.json'));
    const p = loadProject(projectFile, {seconds: evidence.scope.end});
    const reviewFile = fs.realpathSync(reviewArg || path.join(evidenceDir, 'independent-review.json'));
    // No approval, acceptance receipt, rendering or artistic repair here.
    const reportFile = path.join(evidenceDir, 'human-review-validation.json');
    try {
      const result = await verifyBStyleReferenceReview(p, {file: evidence.output, evidenceDir, reviewFile, projectFingerprint: p.fingerprint});
      fs.writeFileSync(reportFile, JSON.stringify({ok: true, review_sha256: hashFile(reviewFile), result}, null, 2) + '\n');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      fs.writeFileSync(reportFile, JSON.stringify({ok: false, review_sha256: hashFile(reviewFile), error: error.message}, null, 2) + '\n');
      throw error;
    }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });

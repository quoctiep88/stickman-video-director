// Static form packaging and a thin call to the unchanged upstream verifier.
import fs from 'node:fs';
import path from 'node:path';
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

async function main() {
  const [command, projectArg, dirArg, reviewArg] = process.argv.slice(2);
  if (!['build', 'verify'].includes(command) || !projectArg || !dirArg) throw Error('Usage: node qtx/human-review.mjs build|verify PROJECT EVIDENCE_DIR [REVIEW_JSON]');
  const projectFile = fs.realpathSync(projectArg), evidenceDir = fs.realpathSync(dirArg);
  if (command === 'build') {
    const data = pack(projectFile, evidenceDir);
    const html = fs.readFileSync(path.join(here, 'human-review.html'), 'utf8');
    const script = fs.readFileSync(path.join(here, 'human-review-ui.js'), 'utf8');
    const safeData = JSON.stringify(data).replaceAll('<', '\\u003c');
    const output = path.join(evidenceDir, 'human-review.html');
    fs.writeFileSync(output, html.replace('/* PACK_DATA */', () => `const PACK = ${safeData};`).replace('/* UI_SCRIPT */', () => script));
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

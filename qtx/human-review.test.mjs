import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// A small DOM stand-in tests form state/export without pretending to play media.
class Element {
  constructor(tag) { this.tagName = tag; this.children = []; this.value = ''; this.currentTime = 0; }
  append(e) { this.children.push(e); }
  replaceChildren() { this.children = []; }
  addEventListener() {}
  scrollIntoView() {}
  pause() {}
  play() { return Promise.resolve(); }
  click() { this.onclick?.(); }
  remove() {}
}
function harness(style = 'B2') {
  const checks = style === 'B3' ? ['silhouette_design', 'semantic_action', 'contact_occlusion', 'composition_editing', 'television_finish', 'typography_captions', 'timing_pacing', 'sound'] : ['color_handdrawn_design', 'semantic_motion_states', 'contact_continuity', 'composition_progression', 'typography_captions', 'timing_pacing', 'sound'];
  const template = {schema: 1, style, author_id: 'fixture-author', capability: {mode: 'sample_target', environment: 'synthetic test only', limitations: []}, reviewer: {}, video_sha256: 'video', evidence_sha256: 'evidence', full_playback: {status: 'unknown', viewed_ranges: [], observations: []}, baseline_comparisons: [{reference_id: 'fixture-ref', start: null, end: null, observations: []}], shots: [{id: 'shot-0', checks: Object.fromEntries(checks.map(k => [k, {status: 'unknown', observations: [], comparisons: []}]))}], blocking_issues: [], limits: []};
  const elements = new Map();
  const document = {getElementById: id => { if (!elements.has(id)) elements.set(id, new Element('div')); return elements.get(id); }, createElement: tag => new Element(tag), createTextNode: text => text, querySelectorAll: () => [], body: new Element('body')};
  const PACK = {template, evidence: {scope: {end: 2}, plan: {shots: [{id: 'shot-0', start: 0, end: 2}]}}, artifacts: [{id: 'shot-0-continuous', shot: 'shot-0', type: 'clip', url: 'file:///fixture.mp4'}], references: [{id: 'fixture-ref', kind: 'video', has_audio: true, required_comparison: true, duration: 10, url: 'file:///reference.mp4'}]};
  const context = vm.createContext({PACK, document, structuredClone, console, alert: () => {}, confirm: () => true, Blob, URL, setTimeout});
  vm.runInContext(fs.readFileSync(new URL('./human-review-ui.js', import.meta.url), 'utf8'), context);
  return {run: code => vm.runInContext(code, context), elements};
}
test('blank form never manufactures passes and reports all missing sections', () => {
  const h = harness();
  assert.equal(h.run('review.full_playback.status'), 'unknown');
  assert.equal(h.run('review.reviewer.independent'), false);
  assert.equal(h.run('Object.values(review.shots[0].checks).every(c => c.status === "unknown" && c.observations.length === 0 && c.comparisons.length === 0)'), true);
  const missing = h.run('missingFields()').join('\n');
  for (const name of ['reviewer', 'full', 'baseline-fixture-ref', 'shot-0 sound', 'shot-0 contact_continuity']) assert.ok(missing.includes(name));
});
test('explicit synthetic input serializes native shape; missing comparison and sound errors remain visible', () => {
  const h = harness();
  h.run(`review.reviewer = {id:'fixture-reviewer',kind:'human',independent:true,method:'Synthetic unit test; no production review'};
    review.full_playback = {status:'pass',viewed_ranges:[{start:0,end:2}],observations:[{time:1,detail:'Synthetic test observation',evidence_ids:['source-video']}]};
    review.baseline_comparisons[0] = {reference_id:'fixture-ref',start:0,end:10,observations:[{time:1,detail:'Synthetic test reference',evidence_ids:['fixture-ref']}]};
    for(const c of Object.values(review.shots[0].checks)) {c.status='pass';c.observations=[{time:1,detail:'Synthetic fixture only',evidence_ids:['shot-0-continuous']}];c.comparisons=[{reference_id:'fixture-ref',start:0,end:2,detail:'Synthetic correspondence'}];}`);
  assert.equal(h.run('missingFields().length'), 0);
  const result = JSON.parse(h.run('JSON.stringify(review)'));
  assert.deepEqual(Object.keys(result).sort(), ['schema','style','author_id','capability','reviewer','video_sha256','evidence_sha256','full_playback','baseline_comparisons','shots','blocking_issues','limits'].sort());
  h.run('review.shots[0].checks.sound.comparisons[0].end = 11');
  assert.ok(h.run('missingFields().join("\\n")').includes('sound: reference interval'));
  h.run('review.shots[0].checks.contact_continuity.comparisons = []');
  assert.ok(h.run('missingFields().join("\\n")').includes('contact_continuity: reference comparison'));
});
test('criteria come from template including B3, and playback cannot be inferred from shot selection', () => {
  const h = harness('B3'); h.run('selectShot(0)');
  assert.equal(h.run('Object.keys(review.shots[0].checks).length'), 8);
  assert.ok(h.run('missingFields().join("\\n")').includes('television_finish'));
  assert.equal(h.run('review.full_playback.status'), 'unknown');
});

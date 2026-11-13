/* Embedded by human-review.mjs; no network, libraries, or generated prose. */
let review = structuredClone(PACK.template);
review.reviewer = {id: '', kind: 'human', method: '', independent: false};
const $ = id => document.getElementById(id);
const videos = PACK.references.filter(r => r.kind === 'video');
const shots = PACK.evidence.plan.shots;
let shotIndex = 0, replayEnd = null;
const blankObservation = ids => ({time: null, detail: '', evidence_ids: ids});
const node = (tag, text, parent) => { const e = document.createElement(tag); if (text) e.textContent = text; if (parent) parent.append(e); return e; };
const button = (parent, text, action) => { const e = node('button', text, parent); e.type = 'button'; e.onclick = action; return e; };
function field(parent, title, obj, key, type = 'text', options) {
  const label = node('label', title + ' ', parent);
  const e = node(options ? 'select' : type === 'textarea' ? 'textarea' : 'input', '', label);
  if (options) for (const value of options) { const o = node('option', value, e); o.value = value; }
  else if (type !== 'textarea') { e.type = type; if (type === 'number') e.step = 'any'; }
  if (type === 'checkbox') e.checked = !!obj[key]; else e.value = obj[key] ?? '';
  e.oninput = () => { obj[key] = type === 'checkbox' ? e.checked : type === 'number' ? e.value === '' ? null : Number(e.value) : e.value; };
  return e;
}
function observations(parent, items, ids, timeSource) {
  const list = node('div', '', parent);
  function draw() {
    list.replaceChildren();
    items.forEach((o, i) => {
      const box = node('fieldset', '', list); node('legend', 'Observation ' + (i + 1), box);
      const t = field(box, 'Candidate/reference time (seconds)', o, 'time', 'number');
      button(box, 'Use current playback time', () => { o.time = timeSource(); t.value = o.time; });
      field(box, 'Observed detail — your own words', o, 'detail', 'textarea');
      node('span', 'Evidence IDs (include the continuous clip/source)', box);
      for (const id of ids) {
        const l = node('label', '', box), c = node('input', '', l); c.type = 'checkbox'; c.checked = o.evidence_ids.includes(id); l.append(document.createTextNode(id));
        c.onchange = () => { o.evidence_ids = ids.filter(x => x === id ? c.checked : o.evidence_ids.includes(x)); };
      }
      button(box, 'Remove observation', () => { items.splice(i, 1); draw(); });
    });
  }
  button(parent, 'Add observation', () => { items.push(blankObservation([ids[0]])); draw(); }); draw();
}
function comparisons(parent, items, sound) {
  const list = node('div', '', parent);
  const refs = videos.filter(r => !sound || r.has_audio);
  function draw() {
    list.replaceChildren();
    items.forEach((c, i) => {
      const box = node('fieldset', '', list); node('legend', 'Reference comparison ' + (i + 1), box);
      field(box, 'Reference', c, 'reference_id', 'text', ['', ...refs.map(r => r.id)]);
      field(box, 'Start', c, 'start', 'number'); field(box, 'End', c, 'end', 'number');
      field(box, 'Observed correspondence or difference', c, 'detail', 'textarea');
      button(box, 'Use current reference range', () => {
        if (!refs.some(r => r.id === $('referenceSelect').value)) return alert('Choose an audible reference for sound.');
        Object.assign(c, {reference_id: $('referenceSelect').value, start: numberValue('refStart'), end: numberValue('refEnd')}); draw();
      });
      button(box, 'Replay comparison', () => playReference(c.reference_id, c.start, c.end));
      const targets = node('details', '', box); node('summary', 'Copy this confirmed comparison to selected criteria in this shot', targets);
      const selected = [];
      for (const key of Object.keys(review.shots[shotIndex].checks)) {
        const label = node('label', '', targets), checkbox = node('input', '', label); checkbox.type = 'checkbox'; label.append(document.createTextNode(key)); selected.push([key, checkbox]);
      }
      button(targets, 'Confirm and copy my comparison', () => {
        if (!c.detail.trim() || !validInterval(c.start, c.end, refs.find(r => r.id === c.reference_id)?.duration)) return alert('Write your comparison and select a valid interval first.');
        const keys = selected.filter(([, checkbox]) => checkbox.checked).map(([key]) => key);
        if (!keys.length || !confirm('I confirm this comparison truthfully applies to each selected criterion.')) return;
        if (!applyToCriteria('comparison', c, keys, true)) return alert('Sound requires an audible reference.');
        drawChecks();
      });
      button(box, 'Remove comparison', () => { items.splice(i, 1); draw(); });
    });
  }
  button(parent, 'Add reference comparison', () => { items.push({reference_id: '', start: null, end: null, detail: ''}); draw(); }); draw();
}
function numberValue(id) { return $(id).value === '' ? null : Number($(id).value); }
function validInterval(start, end, maximum) { return Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start && end <= maximum + 1e-7; }
function selectReference(id) {
  const r = videos.find(x => x.id === id); if (!r) return;
  $('referenceSelect').value = id; $('referenceVideo').src = r.url;
  $('referenceInfo').textContent = `${r.id} · ${r.duration}s · ${r.has_audio ? 'source audio' : 'silent supporting reference'}`;
  replayEnd = null;
}
function playReference(id, start, end) {
  const ref = videos.find(r => r.id === id);
  if (!ref || !validInterval(start, end, ref.duration)) return alert('Enter a valid reference interval.');
  const player = $('referenceVideo');
  const play = () => { player.currentTime = start; replayEnd = end; player.play().catch(e => alert(e.message)); };
  if ($('referenceSelect').value !== id) { selectReference(id); player.addEventListener('loadedmetadata', play, {once: true}); } else play();
}
function drawChecks() {
  const parent = $('checks'); parent.replaceChildren(); const shot = shots[shotIndex];
  node('h3', `${shot.id} · ${shot.start}–${shot.end}s`, parent);
  drawComposers(parent, shot);
  for (const [key, c] of Object.entries(review.shots[shotIndex].checks)) {
    const box = node('details', '', parent); box.id = `check-${shot.id}-${key}`; node('summary', `${key} · ${c.status}`, box);
    const status = field(box, 'Status', c, 'status', 'text', ['unknown', 'pass', 'fail', ...(review.capability.mode === 'limited' && !['typography_captions', 'timing_pacing', 'sound'].includes(key) ? ['unmet'] : [])]);
    status.oninput = () => { c.status = status.value; box.children[0].textContent = `${key} · ${c.status}`; };
    const clip = shot.id + '-continuous';
    const ids = [clip, ...PACK.artifacts.filter(a => a.shot === shot.id && a.id !== clip).map(a => a.id), 'source-video'];
    observations(box, c.observations, ids, () => shot.start + $('shotVideo').currentTime);
    node('p', ['typography_captions', 'timing_pacing'].includes(key) ? 'Reference comparison optional.' : 'Reference comparison required (sound requires an audible reference).', box);
    comparisons(box, c.comparisons, key === 'sound');
  }
}
function applyToCriteria(kind, value, keys, confirmed, still = '') {
  const shot = shots[shotIndex], checks = review.shots[shotIndex].checks;
  if (!confirmed || !keys.length || keys.some(k => !checks[k])) return false;
  let entry;
  if (kind === 'observation') {
    if (!value.detail.trim() || !Number.isFinite(value.time) || value.time < shot.start || value.time > shot.end) return false;
    if (still && !PACK.artifacts.some(a => a.shot === shot.id && a.type === 'png' && a.id === still)) return false;
    entry = {time:value.time, detail:value.detail, evidence_ids:[shot.id + '-continuous', ...(still ? [still] : [])]};
  } else if (kind === 'comparison') {
    const ref = videos.find(r => r.id === value.reference_id);
    if (!value.detail.trim() || !validInterval(value.start, value.end, ref?.duration) || (keys.includes('sound') && !ref?.has_audio)) return false;
    entry = {reference_id:value.reference_id, start:value.start, end:value.end, detail:value.detail};
  } else if (kind !== 'status' || !['pass', 'fail'].includes(value.status)) return false;
  for (const key of keys) {
    if (kind === 'status') checks[key].status = value.status;
    else checks[key][kind === 'observation' ? 'observations' : 'comparisons'].push(structuredClone(entry));
  }
  return true;
}
function drawComposers(parent, shot) {
  const box = node('fieldset', '', parent); node('legend', 'Fast review — selected shot', box);
  const chosen = {};
  for (const key of Object.keys(review.shots[shotIndex].checks)) field(box, key, chosen, key, 'checkbox');
  const keys = () => Object.keys(chosen).filter(k => chosen[k]);
  node('h3', 'Candidate observation composer', box);
  const observation = {time:null, detail:'', still:''};
  const time = field(box, 'Timestamp (candidate seconds)', observation, 'time', 'number');
  button(box, 'Use current shot playback time', () => { observation.time = shot.start + $('shotVideo').currentTime; time.value = observation.time; });
  field(box, 'Human-written detail', observation, 'detail', 'textarea');
  field(box, 'Optional still (continuous clip always cited)', observation, 'still', 'text', ['', ...PACK.artifacts.filter(a => a.shot === shot.id && a.type === 'png').map(a => a.id)]);
  const apply = (kind, value, message, still) => {
    if (!keys().length) return alert('Select applicable criteria first.');
    if (!confirm(message)) return;
    if (!applyToCriteria(kind, value, keys(), true, still)) return alert('Supply your own detail and valid timestamps/reference/evidence, or an explicit PASS/FAIL. Sound requires an audible video.');
    drawChecks(); updateProgress();
  };
  button(box, 'Apply my observation to selected criteria', () => apply('observation', observation, 'I confirm this observation truthfully applies to all selected criteria.', observation.still));
  node('h3', 'Reference comparison composer', box);
  const comparison = {reference_id:'', start:null, end:null, detail:''};
  const refSelect = field(box, 'Reference', comparison, 'reference_id', 'text', ['', ...videos.map(r => r.id)]);
  box.addEventListener('change', () => {
    for (const option of refSelect.children) option.disabled = !!chosen.sound && option.value && !videos.find(r => r.id === option.value)?.has_audio;
    if (chosen.sound && comparison.reference_id && !videos.find(r => r.id === comparison.reference_id)?.has_audio) { comparison.reference_id = ''; refSelect.value = ''; }
  });
  const start = field(box, 'Start', comparison, 'start', 'number'), end = field(box, 'End', comparison, 'end', 'number');
  button(box, 'Use current reference range', () => {
    const ref = videos.find(r => r.id === $('referenceSelect').value);
    if (chosen.sound && !ref?.has_audio) return alert('Sound requires an audible video.');
    comparison.reference_id = ref.id; comparison.start = numberValue('refStart'); comparison.end = numberValue('refEnd');
    refSelect.value = ref.id; start.value = comparison.start ?? ''; end.value = comparison.end ?? '';
  });
  field(box, 'Human-written comparison', comparison, 'detail', 'textarea');
  button(box, 'Apply my comparison to selected criteria', () => apply('comparison', comparison, 'I confirm this comparison truthfully applies to all selected criteria.'));
  node('h3', 'Status for selected criteria', box);
  const status = {status:'unknown'}; field(box, 'Status', status, 'status', 'text', ['unknown', 'pass', 'fail']);
  button(box, 'Apply selected status', () => apply('status', status, 'I confirm this status is my review decision for all selected criteria.'));
}
function updateProgress() {
  const missing = missingFields();
  let complete = 0;
  review.shots.forEach((s, i) => {
    const keys = Object.keys(s.checks), count = keys.filter(k => !missing.some(m => m.startsWith(s.id + ' ' + k + ':'))).length;
    if (count === keys.length) complete++;
    $('shotSelect').children[i].textContent = `${s.id} · ${count}/${keys.length} complete`;
  });
  const state = prefix => missing.some(m => m.startsWith(prefix + ':')) ? 'incomplete' : 'complete';
  $('progress').textContent = `Candidate full playback: ${state('full')} · ${review.baseline_comparisons.map(b => b.reference_id + ': ' + state('baseline-' + b.reference_id)).join(' · ')} · Shots completed ${complete}/${shots.length} · Blockers ${review.blocking_issues.length}. Completeness guidance only; native verifier is authoritative.`;
}
function selectShot(index) {
  shotIndex = index; const shot = shots[index]; $('shotSelect').value = index;
  $('shotVideo').src = PACK.artifacts.find(a => a.id === shot.id + '-continuous').url;
  $('stills').replaceChildren();
  PACK.artifacts.filter(a => a.shot === shot.id && a.type === 'png').forEach(a => { const img = node('img', '', $('stills')); img.src = a.url; img.alt = a.id; });
  drawChecks();
}
function drawForm() {
  $('reviewer').replaceChildren();
  field($('reviewer'), 'Reviewer ID', review.reviewer, 'id');
  field($('reviewer'), 'Kind', review.reviewer, 'kind', 'text', ['human', 'agent']);
  field($('reviewer'), 'Actual review method', review.reviewer, 'method', 'textarea');
  field($('reviewer'), 'I am independent of the project authoring process', review.reviewer, 'independent', 'checkbox');
  const full = $('full'); full.replaceChildren();
  const confirmation = {confirmed: review.full_playback.status === 'pass'};
  const check = field(full, 'I confirm complete continuous candidate playback with audio', confirmation, 'confirmed', 'checkbox');
  check.onchange = () => { review.full_playback.status = check.checked ? 'pass' : 'unknown'; };
  const ranges = node('div', '', full);
  const drawRanges = () => { ranges.replaceChildren(); review.full_playback.viewed_ranges.forEach((r, i) => { const row = node('div', '', ranges); field(row, 'Viewed start', r, 'start', 'number'); field(row, 'Viewed end', r, 'end', 'number'); button(row, 'Remove range', () => { review.full_playback.viewed_ranges.splice(i, 1); drawRanges(); }); }); };
  button(full, 'Add viewed range', () => { review.full_playback.viewed_ranges.push({start: null, end: null}); drawRanges(); }); drawRanges();
  observations(full, review.full_playback.observations, ['source-video'], () => $('candidate').currentTime);
  $('baselines').replaceChildren();
  for (const b of review.baseline_comparisons) {
    const box = node('fieldset', '', $('baselines')); box.id = 'baseline-' + b.reference_id; node('legend', b.reference_id, box);
    field(box, 'Reviewed start', b, 'start', 'number'); field(box, 'Reviewed end', b, 'end', 'number');
    button(box, 'Use current reference range', () => { if ($('referenceSelect').value !== b.reference_id) return alert('Select this reference in the player first.'); b.start = numberValue('refStart'); b.end = numberValue('refEnd'); drawForm(); });
    observations(box, b.observations, [b.reference_id], () => { if ($('referenceSelect').value !== b.reference_id) { alert('Select this reference first.'); return null; } return $('referenceVideo').currentTime; });
  }
  $('blockers').value = review.blocking_issues.join('\n'); drawChecks();
}
// Form completeness only. Never claims to duplicate or replace native verification.
function missingFields() {
  const missing = [], add = (test, label) => { if (!test) missing.push(label); };
  const obs = (items, start, end, required, label, allowed = [required]) => {
    add(items.length > 0, label + ': add an observation');
    items.forEach(o => { add(Number.isFinite(o.time) && o.time >= start && o.time <= end, label + ': observation timestamp'); add(concreteDetail(o.detail), label + ': observation detail'); add(o.evidence_ids.length && o.evidence_ids.every(id => allowed.includes(id)), label + ': evidence IDs'); });
    add(items.some(o => o.evidence_ids.includes(required)), label + ': cite ' + required);
  };
  add(review.reviewer.id.trim() && review.reviewer.id !== review.author_id, 'reviewer: distinct reviewer ID'); add(review.reviewer.method.trim(), 'reviewer: actual method'); add(review.reviewer.independent, 'reviewer: independence declaration');
  add(review.full_playback.status === 'pass', 'full: continuous playback confirmation');
  let covered = 0;
  for (const r of [...review.full_playback.viewed_ranges].sort((a, b) => a.start - b.start)) { add(validInterval(r.start, r.end, PACK.evidence.scope.end) && r.start <= covered + 1e-7, 'full: valid continuous coverage'); if (Number.isFinite(r.end)) covered = Math.max(covered, r.end); }
  add(covered >= PACK.evidence.scope.end, 'full: viewed ranges must cover the entire candidate');
  obs(review.full_playback.observations, 0, PACK.evidence.scope.end, 'source-video', 'full');
  for (const b of review.baseline_comparisons) { add(validInterval(b.start, b.end, videos.find(r => r.id === b.reference_id)?.duration), 'baseline-' + b.reference_id + ': reviewed interval'); obs(b.observations, b.start, b.end, b.reference_id, 'baseline-' + b.reference_id); }
  review.shots.forEach((s, i) => Object.entries(s.checks).forEach(([key, c]) => {
    const label = s.id + ' ' + key; add(['pass', 'fail', ...(review.capability.mode === 'limited' && !['typography_captions','timing_pacing','sound'].includes(key) ? ['unmet'] : [])].includes(c.status), label + ': status'); obs(c.observations, shots[i].start, shots[i].end, s.id + '-continuous', label, ['source-video', ...PACK.artifacts.filter(a => a.shot === s.id).map(a => a.id)]);
    if (!['typography_captions', 'timing_pacing'].includes(key)) add(c.comparisons.length, label + ': reference comparison');
    c.comparisons.forEach(cc => { const ref = videos.find(r => r.id === cc.reference_id); add(ref && validInterval(cc.start, cc.end, ref.duration), label + ': reference interval'); add(concreteDetail(cc.detail), label + ': comparison detail'); if (key === 'sound') add(ref?.has_audio, label + ': audible reference'); });
  })); return missing;
}
function navigateError(message) {
  const shot = shots.findIndex(s => new RegExp('\\b' + s.id + '\\b').test(message));
  if (shot >= 0) { selectShot(shot); const key = Object.keys(review.shots[shot].checks).find(k => message.includes(k)); const target = key ? $('check-' + shots[shot].id + '-' + key) : $('checks'); if (key) target.open = true; target.scrollIntoView(); }
  else { const id = message.startsWith('baseline-') ? message.split(':')[0] : /playback|full/.test(message) ? 'full' : /reviewer/.test(message) ? 'reviewer' : null; if (id && $(id)) $(id).scrollIntoView(); }
}
function showErrors(errors) { $('messages').replaceChildren(); for (const message of errors) button($('messages'), message, () => navigateError(message)); }
function download(name, value) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2) + '\n'], {type: 'application/json'})); const a = node('a', '', document.body); a.href = url; a.download = name; a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
$('metadata').textContent = `Full project: ${PACK.fullFingerprint}\nScoped project: ${PACK.evidence.project_fingerprint}\nPreview SHA256: ${review.video_sha256}\nEvidence SHA256: ${review.evidence_sha256}`;
$('command').textContent = PACK.verifyCommand;
$('candidate').src = PACK.candidateUrl; $('scope').textContent = `Complete candidate: 0–${PACK.evidence.scope.end}s · ${shots.length} shots`;
shots.forEach((s, i) => { const o = node('option', `${s.id} · ${s.start}–${s.end}s`, $('shotSelect')); o.value = i; });
videos.forEach(r => { const o = node('option', r.id, $('referenceSelect')); o.value = r.id; });
$('shotSelect').onchange = () => selectShot(Number($('shotSelect').value)); $('next').onclick = () => selectShot((shotIndex + 1) % shots.length);
$('replayShot').onclick = () => { $('shotVideo').currentTime = 0; $('shotVideo').play(); };
$('referenceSelect').onchange = () => { selectReference($('referenceSelect').value); $('refStart').value = ''; $('refEnd').value = ''; };
$('markStart').onclick = () => { $('refStart').value = $('referenceVideo').currentTime; }; $('markEnd').onclick = () => { $('refEnd').value = $('referenceVideo').currentTime; };
$('replayReference').onclick = () => playReference($('referenceSelect').value, numberValue('refStart'), numberValue('refEnd'));
$('referenceVideo').ontimeupdate = () => { if (replayEnd !== null && $('referenceVideo').currentTime >= replayEnd) { $('referenceVideo').pause(); replayEnd = null; } };
for (const v of document.querySelectorAll('video')) v.addEventListener('play', () => { for (const other of document.querySelectorAll('video')) if (other !== v) other.pause(); });
$('blockers').oninput = () => { review.blocking_issues = $('blockers').value.split('\n').filter(x => x.trim()); };
$('saveDraft').onclick = () => download('human-review-draft.json', review);
$('export').onclick = () => { const missing = missingFields(); showErrors(missing); if (!missing.length) { download('independent-review.json', review); $('messages').textContent = 'Exported. Save in the evidence directory and run the native verification command above. No approval has been granted by this page.'; } };
$('loadDraft').onchange = async event => {
  try {
    const candidate = JSON.parse(await event.target.files[0].text());
    for (const k of ['schema', 'style', 'author_id', 'capability', 'video_sha256', 'evidence_sha256', 'limits']) if (JSON.stringify(candidate[k]) !== JSON.stringify(PACK.template[k])) throw Error('Draft binding mismatch: ' + k);
    if (JSON.stringify(candidate.shots.map(s => [s.id, Object.keys(s.checks)])) !== JSON.stringify(PACK.template.shots.map(s => [s.id, Object.keys(s.checks)]))) throw Error('Draft shot/criteria mismatch');
    review = candidate; drawForm(); updateProgress(); showErrors([]);
  } catch (error) { showErrors([error.message]); }
};
$('validation').onchange = async event => { try { const report = JSON.parse(await event.target.files[0].text()); showErrors([report.ok ? 'Native validation passed for review SHA256 ' + report.review_sha256 + '. This is not native approval.' : report.error]); if (!report.ok) navigateError(report.error); } catch (error) { showErrors([error.message]); } };
selectReference(videos.find(r => r.required_comparison)?.id || videos[0].id); selectShot(0); drawForm();
for (const ref of PACK.references.filter(r => r.kind === 'image')) {
  const box = node('details', '', $('referenceBoards')); node('summary', ref.id + ' — still reference only', box);
  const img = node('img', '', box); img.src = ref.url; img.alt = ref.id; img.style = 'max-width:100%';
}

function concreteDetail(value) { return typeof value === 'string' && !!value.trim() && !/^(?:pass|passed|ok|okay|good|fine|checked|done|n\/?a|unknown|none|通过|正常|已检查|合格|无|没有)[.!。！\s]*$/iu.test(value.trim()); }
document.body.addEventListener('input', updateProgress);
document.body.addEventListener('change', updateProgress);
document.body.addEventListener('click', () => queueMicrotask(updateProgress));
updateProgress();

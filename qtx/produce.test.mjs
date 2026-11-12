import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initSeries, initVideo} from './production.mjs';
import {workspace, approvePlan, checkPlan, voice, productionInputs, approvePreview, checkPreview, produceVideo} from './produce.mjs';
import {contentHash} from './production.mjs';
import {prefixJob} from './unity/render.mjs';
import {synthesize} from './integrations/elevenlabs.mjs';
import {alignedWords, captionsFromWords, subtitles} from './timing.mjs';

function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qtx-p05-'));
  t.after(() => fs.rmSync(temp, {recursive: true, force: true}));
  const series = path.join(temp, 'series'); initSeries(series); initVideo(series, '001');
  const w = workspace(series, '001');
  for (const [name, text] of Object.entries({'plan.md': 'Explain weather requests.', 'script.md': 'Hello world.\n', 'visual-plan.md': 'Use local approved diagrams.'})) fs.writeFileSync(path.join(w.episode, name), text);
  return w;
}
test('human approval binds planning, script, Series config and shared assets before any paid call', async t => {
  const w = fixture(t);
  assert.throws(() => checkPlan(w));
  assert.throws(() => approvePlan(w, ''));
  const first = approvePlan(w, 'User approved this test plan');
  assert.equal(checkPlan(w).fingerprint, first.fingerprint);
  for (const file of [path.join(w.episode, 'script.md'), path.join(w.episode, 'visual-plan.md'), path.join(w.series, 'SERIES.md')]) {
    const old = fs.readFileSync(file); fs.appendFileSync(file, ' changed');
    assert.throws(() => checkPlan(w), /invalidated/);
    await assert.rejects(voice(w), /invalidated/);
    fs.writeFileSync(file, old);
  }
  fs.writeFileSync(path.join(w.series, 'shared/props/a.txt'), 'new shared asset');
  assert.throws(() => checkPlan(w), /invalidated/);
});
test('ElevenLabs sends exact text once, preserves audio/alignment, never logs credentials or retries', async () => {
  let calls = 0;
  const text = 'Exact text.\n\nNo rewriting.\n';
  const result = await synthesize({text, voiceId: 'chosenVoice', apiKey: 'secret-fixture', fetchImpl: async (url, options) => {
    calls++; assert.match(url, /chosenVoice\/with-timestamps/);
    assert.equal(JSON.parse(options.body).text, text);
    assert.equal(JSON.parse(options.body).apply_text_normalization, 'off');
    return {ok: true, headers: new Headers({'request-id': 'fixture'}), json: async () => ({audio_base64: Buffer.from('audio fixture').toString('base64'), alignment: {characters: ['x']}})};
  }});
  assert.equal(calls, 1); assert.equal(result.audio.toString(), 'audio fixture');
  assert.deepEqual(result.metadata.alignment, {characters: ['x']});
  assert(!JSON.stringify(result).includes('secret-fixture'));
  await assert.rejects(synthesize({text, voiceId: 'chosenVoice', apiKey: 'secret-fixture', fetchImpl: async () => {calls++; return {ok: false, status: 429};}}), /HTTP 429/);
  assert.equal(calls, 2);
});
test('original character alignment becomes canonical words and upstream caption groups with SRT/VTT', () => {
  const text = 'Hi there.\n';
  const alignment = {characters: [...text], character_start_times_seconds: [...text].map((_,i) => i / 10), character_end_times_seconds: [...text].map((_,i) => (i + 1) / 10)};
  const words = alignedWords(alignment, text, 1.1);
  assert.deepEqual(words, [{word: 'Hi', start: 0, end: 0.2}, {word: 'there.', start: 0.3, end: 0.9}]);
  const cues = captionsFromWords(words);
  assert.equal(cues[0].text, 'Hi there.');
  assert.match(subtitles(cues, 'srt'), /00:00:00,000 --> 00:00:00,900/);
  assert.match(subtitles(cues, 'vtt'), /^WEBVTT/);
  assert.throws(() => alignedWords(alignment, 'Different', 1.1), /exact approved/);
  assert.throws(() => alignedWords({...alignment, character_end_times_seconds: [1]}, text, 1.1), /inconsistent/);
});

test('preview gate binds movie bytes, scenes, captions, assets and audio; final refuses before approval', t => {
  const w = fixture(t), write = (name, value) => fs.writeFileSync(path.join(w.episode,name), JSON.stringify(value));
  const hash = name => contentHash(path.join(w.episode,name)).sha256;
  fs.writeFileSync(path.join(w.episode,'audio/narration.mp3'), 'local hash fixture, not provider audio');
  write('audio/elevenlabs-response.json', {alignment: {}});
  write('audio/narration.json', {provider:'ElevenLabs', script_sha256:hash('script.md'), audio_sha256:hash('audio/narration.mp3'), response_sha256:hash('audio/elevenlabs-response.json'), duration:30});
  write('audio/word-timings.json', {audio_sha256:hash('audio/narration.mp3'),script_sha256:hash('script.md'),words:[]});
  write('audio/captions.json',[{start:0,end:1,text:'Hello world.'}]);
  fs.writeFileSync(path.join(w.episode,'assets/generated/diagram.png'), 'hash fixture');
  write('scenes/one.json',{duration:30,background:'#FFFFFF',objects:[{id:'diagram',type:'sprite',asset:'../assets/generated/diagram.png'}]});
  write('unity-project.json',{schema:'qtx-unity-v1',width:1280,height:720,fps:24,scenes:['scenes/one.json']});
  approvePlan(w,'Test only');
  assert.throws(() => produceVideo(w,true), /ENOENT/);
  fs.writeFileSync(path.join(w.episode,'preview/fixture.mp4'),'not a real preview; gate unit fixture');
  write('reports/preview-report.json',{input_fingerprint:productionInputs(w).fingerprint, output:'preview/fixture.mp4',output_sha256:hash('preview/fixture.mp4'),decode:'PASS'});
  approvePreview(w,'Unit fixture approval only');
  assert(checkPreview(w));
  for (const name of ['preview/fixture.mp4','scenes/one.json','audio/captions.json','assets/generated/diagram.png','audio/narration.mp3']) {
    const file=path.join(w.episode,name), original=fs.readFileSync(file);
    if(name.endsWith('.json')) { const data=JSON.parse(original); if(name.startsWith('scenes'))data.background='#000000'; else data[0].text='Changed'; fs.writeFileSync(file,JSON.stringify(data)); }
    else fs.appendFileSync(file,'changed');
    assert.throws(() => checkPreview(w));
    assert.throws(() => produceVideo(w,true));
    fs.writeFileSync(file,original);
  }
  const scene=JSON.parse(fs.readFileSync(path.join(w.episode,'scenes/one.json')));
  scene.objects[0].asset=path.join(path.dirname(w.series),'outside.png');
  fs.writeFileSync(scene.objects[0].asset,'outside');write('scenes/one.json',scene);
  assert.throws(() => productionInputs(w), /Cross-Series/);
});

test('preview frame prefix preserves original semantic cue and sprite track timing', () => {
  const scene={frames:240,duration:10,actions:[{action:'WALK_TO',start:0,end:10,target:[4,0]}],objects:[{x:[{time:0,value:0},{time:10,value:4}]}]};
  const job={totalFrames:480,scenes:[scene,{...scene}]};
  const prefix=prefixJob(job,300);
  assert.equal(prefix.totalFrames,300);assert.equal(prefix.scenes[1].frames,60);
  assert.deepEqual(prefix.scenes[1].actions,scene.actions);assert.deepEqual(prefix.scenes[1].objects,scene.objects);
  assert.equal(job.scenes[1].frames,240);
  assert.throws(() => prefixJob(job,481));
});

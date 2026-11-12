import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {initSeries, initVideo, promoteAsset, check, contentHash} from './production.mjs';

function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qtx-p02-test-'));
  t.after(() => fs.rmSync(temp, {recursive: true, force: true}));
  const series = path.join(temp, 'series');
  initSeries(series); initVideo(series, '001');
  const episode = path.join(series, 'videos/001');
  fs.writeFileSync(path.join(episode, 'assets/generated/prop.txt'), 'approved');
  return {series, episode};
}
test('CLI smoke, inherited metadata, optional project and no workspace overwrite', t => {
  const {series, episode} = fixture(t);
  const cli = fileURLToPath(new URL('./production.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], {encoding: 'utf8'});
  const other = path.join(path.dirname(series), 'other');
  assert.equal(run('init-series', other, '--title', 'Other', '--language', 'vi', '--style', 'A1').status, 0);
  assert.equal(run('init-video', other, '002', '--duration', '480').status, 0);
  const metadata = JSON.parse(fs.readFileSync(path.join(other, 'videos/002/video.json')));
  assert.equal(metadata.language, 'vi'); assert.equal(metadata.style_id, 'A1');
  assert.equal(metadata.duration_seconds, 480);
  assert.equal(run('check', other).status, 0);
  assert.equal(run('init-series', other).status, 1);
  assert.equal(run('init-video', other, '002').status, 1);
  assert.equal(run('init-video', other, '003', '--duration', 'NaN').status, 1);
  assert.equal(run('init-video', other, '003', '--unknown', 'value').status, 1);
  assert.equal(fs.existsSync(path.join(other, 'videos/003')), false);
  assert.equal(fs.existsSync(path.join(episode, 'project.json')), false);
  assert.equal(check(series).valid, true);
});
test('straightforward source, destination and episode path boundaries', t => {
  const {series} = fixture(t);
  assert.throws(() => initVideo(series, '../escape'));
  assert.throws(() => initVideo(path.join(series, 'missing'), '002'));
  for (const source of ['../../series.json', path.resolve(series, 'series.json')]) {
    assert.throws(() => promoteAsset(series, '001', source, 'shared/props/a'));
  }
  for (const destination of ['../escape', 'videos/001/copied', 'shared/props', 'shared/props/../../../escape']) {
    assert.throws(() => promoteAsset(series, '001', 'assets/generated/prop.txt', destination));
  }
});
test('file promotion preserves source, records provenance and refuses different bytes', t => {
  const {series, episode} = fixture(t);
  const promote = () => promoteAsset(series, '001', 'assets/generated/prop.txt', 'shared/props/prop.txt');
  const first = promote();
  assert.equal(first.reused, false);
  assert.deepEqual(contentHash(first.source), contentHash(first.destination));
  const before = fs.readFileSync(first.provenance, 'utf8');
  assert.equal(promote().reused, true);
  assert.equal(fs.readFileSync(first.provenance, 'utf8'), before);
  const [record] = JSON.parse(before);
  assert.equal(record.episode, '001'); assert.equal(record.original_path, 'assets/generated/prop.txt');
  assert.equal(record.promoted_path, 'shared/props/prop.txt'); assert.ok(Date.parse(record.promoted_at));
  fs.writeFileSync(path.join(episode, 'assets/generated/prop.txt'), 'different');
  assert.throws(promote, /differs/);
  assert.equal(fs.readFileSync(first.destination, 'utf8'), 'approved');
  assert.equal(fs.readFileSync(first.provenance, 'utf8'), before);
  fs.writeFileSync(first.destination, 'tampered');
  assert.throws(() => check(series), /differs from provenance/);
});
test('directory promotion includes nested files and empty directories without merging', t => {
  const {series, episode} = fixture(t);
  const source = path.join(episode, 'assets/generated/host');
  fs.mkdirSync(path.join(source, 'empty'), {recursive: true});
  fs.writeFileSync(path.join(source, 'pose.txt'), 'pose');
  const promote = () => promoteAsset(series, '001', 'assets/generated/host', 'shared/characters/host');
  const first = promote(); assert.equal(promote().reused, true);
  assert.deepEqual(contentHash(source), contentHash(first.destination));
  fs.writeFileSync(path.join(first.destination, 'extra.txt'), 'extra');
  assert.throws(promote, /refusing to overwrite/);
  assert.equal(fs.readFileSync(path.join(source, 'pose.txt'), 'utf8'), 'pose');
});
test('junction escape rejected where local link creation is available', t => {
  const {series, episode} = fixture(t);
  const link = path.join(episode, 'assets/generated/link');
  try { fs.symlinkSync(series, link, process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (e) { if (e.code === 'EPERM') return t.skip('Local symlink privilege unavailable'); throw e; }
  assert.throws(() => promoteAsset(series, '001', 'assets/generated/link/series.json', 'shared/props/escape'), /Links\/junctions/);
});

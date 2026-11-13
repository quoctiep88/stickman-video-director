import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {serve, renderPage} from './human-review.mjs';
test('localhost exact allowlist, MIME, HEAD, ranges and traversal rejection', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qtx-http-'));
  const file = path.join(dir, 'clip.mp4'); fs.writeFileSync(file, '0123456789');
  const url = pathToFileURL(file).href;
  const result = await serve({candidateUrl:url, artifacts:[{url}], references:[{url}], template:{video_sha256:'frozen', evidence_sha256:'bound'}}, 0);
  const base = new URL(result.url).origin;
  try {
    assert.equal(result.server.address().address, '127.0.0.1');
    assert.equal((await fetch(result.url)).status, 200);
    for (const route of result.routes.keys()) {
      const head = await fetch(base + route, {method:'HEAD'}); assert.equal(head.status, 200); assert.equal(head.headers.get('content-type'), 'video/mp4');
      const range = await fetch(base + route, {headers:{Range:'bytes=3-6'}}); assert.equal(range.status, 206); assert.equal(await range.text(), '3456');
      assert.equal((await fetch(base + route, {headers:{Range:'bytes=99-'}})).status, 416);
    }
    for (const route of ['/../secret', '/%2e%2e/secret', '/media/%2e%2e%2fsecret', '/media/0.mp4?path=secret', '/C:/Windows/win.ini']) assert.equal((await fetch(base + route)).status, 404);
    const rebuilt = renderPage(result.data);
    const embedded = JSON.parse(rebuilt.match(/const PACK = (.*);<\/script>/)[1]);
    assert.deepEqual(embedded.template, result.data.template);
    assert.equal(renderPage(result.data), rebuilt);
    assert.equal(result.data.template.video_sha256, 'frozen'); assert.equal(result.data.template.evidence_sha256, 'bound');
  } finally { await new Promise(resolve => result.server.close(resolve)); fs.rmSync(dir, {recursive:true}); }
});

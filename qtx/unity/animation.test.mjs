import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { semanticScene, parts } from './animation.mjs';

function fixture(t) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qtx-animation-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const write=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data));
  fs.writeFileSync(path.join(dir,'module.png'),'preflight fixture');
  const character={schema:'qtx-character-v1',id:'host',scale:1,parts:parts.map((name,i)=>({name,kind:i<2?'sprite':'limb',asset:'module.png',anchor:[0,0],size:[1,2],order:i}))};
  const interaction={schema:'qtx-interaction-v1',action:'HOLD_CARD',character:'host',anchor:'arm_right',replace:'arm_right',size:[2,2],pivot:[0,1],asset:'module.png'};
  const scene={duration:10,actors:[{id:'host',character:'character.json',position:[0,0]}],actions:[{actor:'host',action:'POINT_AT',target:'cpu',start:1,end:3}],interactions:[{actor:'host',module:'interaction.json',start:3,end:5}]};
  const run=()=>{write('character.json',character);write('interaction.json',interaction);return semanticScene(scene,path.join(dir,'scene.json'),new Set(['cpu']),new Set());};
  return {dir,scene,character,interaction,run};
}
test('external character/contact resolution and typed targets',t=>{
  const f=fixture(t),s=f.run();
  assert.equal(s.actors[0].character.parts.length,6);
  assert.equal(s.actions[0].targetId,'cpu');
  assert.equal(s.interactions[0].module.asset,path.join(f.dir,'module.png'));
  f.scene.actions[0].target=[2,3];assert.deepEqual(f.run().actions[0].target,[2,3]);
  f.scene.actors.push({id:'other',character:'character.json',position:[2,0]});
  f.scene.actions[0].target='other';assert.equal(f.run().actions[0].targetId,'other');
});
test('unknown action/target, duplicate actor and missing character fail',t=>{
  const f=fixture(t),a=f.scene.actions[0];
  a.action='DANCE';assert.throws(f.run,/unknown action/);a.action='POINT_AT';
  a.target='absent';assert.throws(f.run,/unknown target/);a.target='cpu';
  f.scene.actors.push(f.scene.actors[0]);assert.throws(f.run,/duplicate actor/);f.scene.actors.pop();
  f.scene.actors[0].character='absent.json';assert.throws(f.run,/character: missing/);
});
test('required continuous parts and interaction compatibility fail clearly',t=>{
  const f=fixture(t),part=f.character.parts.pop();assert.throws(f.run,/required semantic part/);f.character.parts.push(part);
  part.kind='sprite';assert.throws(f.run,/invalid module kind/);part.kind='limb';
  f.scene.interactions[0].module='absent.json';assert.throws(f.run,/interaction: missing/);f.scene.interactions[0].module='interaction.json';
  f.interaction.anchor='hand';assert.throws(f.run,/incompatible/);f.interaction.anchor='arm_right';
  f.interaction.character='other';assert.throws(f.run,/incompatible/);
});
test('time bounds, body conflicts, head composition and touching boundaries',t=>{
  const f=fixture(t),a=f.scene.actions[0];
  for(const [start,end] of [[-1,2],[2,2],[3,2],[9,11],[0,NaN]]){a.start=start;a.end=end;assert.throws(f.run,/time range/);}
  a.start=1;a.end=4;assert.throws(f.run,/conflicting/);a.end=3;
  f.scene.actions.push({...a,action:'LOOK_AT',end:6});assert.doesNotThrow(f.run);
  f.scene.actions.push({...a,action:'LOOK_AT'});assert.throws(f.run,/conflicting/);
});

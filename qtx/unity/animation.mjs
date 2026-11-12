// Asset/contract preflight only. Unity compiles and evaluates the action timeline.
import fs from 'node:fs';
import path from 'node:path';
export const parts = ['torso', 'head', 'arm_left', 'arm_right', 'leg_left', 'leg_right'];
const need = (ok, message) => { if (!ok) throw Error(message); };
const finite = n => typeof n === 'number' && Number.isFinite(n);
const pair = p => Array.isArray(p) && p.length === 2 && p.every(finite);
const overlap = (a, b) => a.start < b.end && b.start < a.end;
export function semanticScene(scene, scenePath, ids, assets) {
  const file = (base, relative, label, raster = false) => {
    need(typeof relative === 'string' && relative.length, label + ': path required');
    const p = path.resolve(path.dirname(base), relative);
    need(fs.existsSync(p) && fs.statSync(p).isFile(), label + ': missing file ' + p);
    if (raster) need(/\.(png|jpe?g)$/i.test(p), label + ': raster required');
    assets.add(p);
    return p;
  };
  const packageData = (base, relative, label) => {
    const p = file(base, relative, label);
    return [p, JSON.parse(fs.readFileSync(p, 'utf8'))];
  };
  const actors = scene.actors ?? [], actions = scene.actions ?? [], interactions = scene.interactions ?? [];
  need([actors, actions, interactions].every(Array.isArray), 'semantic timelines must be arrays');
  const compiledActors = actors.map(a => {
    need(a && typeof a.id === 'string' && a.id && !ids.has(a.id), 'missing/duplicate actor id');
    ids.add(a.id);
    need(pair(a.position), a.id + ': root position required');
    need(finite(a.scale ?? 1) && (a.scale ?? 1) > 0, a.id + ': invalid scale');
    need(['left', 'right'].includes(a.facing ?? 'right'), a.id + ': invalid facing');
    const [p, c] = packageData(scenePath, a.character, 'character');
    need(c.schema === 'qtx-character-v1' && typeof c.id === 'string' && c.id, 'invalid character schema/id');
    need(finite(c.scale) && c.scale > 0, 'character scale required');
    need(Array.isArray(c.parts) && c.parts.length === parts.length, 'missing required semantic part');
    need(parts.every(name => c.parts.filter(v => v.name === name).length === 1), 'missing/duplicate required semantic part');
    const orders = new Set();
    const modules = c.parts.map(v => {
      const limb = v.name.startsWith('arm_') || v.name.startsWith('leg_');
      need(v.kind === (limb ? 'limb' : 'sprite'), v.name + ': invalid module kind');
      need(pair(v.anchor) && pair(v.size) && v.size.every(n => n > 0), v.name + ': invalid anchor/size');
      need(Number.isInteger(v.order) && Math.abs(v.order) < 32767 && !orders.has(v.order), 'invalid/duplicate part draw order');
      orders.add(v.order);
      return { ...v, asset: file(p, v.asset, v.name, true) };
    });
    return { id: a.id, position: a.position, scale: (a.scale ?? 1) * c.scale, facing: a.facing === 'left' ? -1 : 1, character: { id: c.id, parts: modules } };
  });
  const actor = id => {
    const a = compiledActors.find(a => a.id === id);
    need(a, 'unknown actor ' + id); return a;
  };
  const range = x => {
    actor(x.actor);
    need(finite(x.start) && finite(x.end) && x.start >= 0 && x.end > x.start && x.end <= scene.duration, 'invalid action/interaction time range or outside scene duration');
  };
  const compiledActions = actions.map(a => {
    need(a && ['IDLE', 'WALK_TO', 'LOOK_AT', 'POINT_AT'].includes(a.action), 'unknown action ' + a?.action);
    range(a);
    if (a.action !== 'IDLE') {
      need(pair(a.target) || (a.action !== 'WALK_TO' && typeof a.target === 'string' && ids.has(a.target)), 'unknown target id or invalid target');
      need(a.target !== a.actor, 'self target unsupported');
    }
    return { actor: a.actor, action: a.action, start: a.start, end: a.end, targetId: typeof a.target === 'string' ? a.target : '', target: Array.isArray(a.target) ? a.target : [0, 0] };
  });
  const compiledInteractions = interactions.map(i => {
    range(i);
    const [p, m] = packageData(scenePath, i.module, 'interaction');
    const a = actor(i.actor);
    need(m.schema === 'qtx-interaction-v1' && m.action === 'HOLD_CARD', 'unsupported interaction');
    need(m.character === a.character.id && m.anchor === 'arm_right' && m.replace === 'arm_right', 'incompatible interaction character/anchor/replacement');
    need(pair(m.size) && m.size.every(n => n > 0) && pair(m.pivot) && m.pivot.every(n => n >= 0 && n <= 1), 'invalid interaction size/pivot');
    const part = a.character.parts.find(p => p.name === m.anchor);
    return { actor: i.actor, start: i.start, end: i.end, module: { ...m, order: part.order, asset: file(p, m.asset, 'interaction artwork', true) } };
  });
  // A single body action/interaction; LOOK_AT is an independent head channel.
  const timeline = [...compiledActions, ...compiledInteractions];
  for (let i = 0; i < timeline.length; i++) for (let j = i + 1; j < timeline.length; j++) {
    const a = timeline[i], b = timeline[j];
    if (a.actor !== b.actor || !overlap(a, b)) continue;
    need((a.action === 'LOOK_AT') !== (b.action === 'LOOK_AT'), 'conflicting unsupported actor actions');
  }
  return { actors: compiledActors, actions: compiledActions, interactions: compiledInteractions };
}

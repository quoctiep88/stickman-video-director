import {groupWords} from '../skills/directing-stickman-videos/scripts/autopilot-core.mjs';

export function alignedWords(alignment, exactText, duration) {
  const {characters: chars, character_start_times_seconds: starts, character_end_times_seconds: ends} = alignment ?? {};
  if (!Array.isArray(chars) || !chars.length || !Array.isArray(starts) || !Array.isArray(ends) ||
      chars.length !== starts.length || chars.length !== ends.length) throw Error('Missing or inconsistent character alignment');
  if (chars.some(c => typeof c !== 'string') || chars.join('') !== exactText) throw Error('Original alignment does not match exact approved script');
  const words = []; let word = null, previous = 0;
  for (let i = 0; i < chars.length; i++) {
    const start = starts[i], end = ends[i];
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < previous - 1e-6 || end < start || end > duration + 0.1)
      throw Error('Invalid or non-monotonic provider timing');
    previous = end;
    if (/^\s+$/.test(chars[i])) { if (word) words.push(word); word = null; }
    else if (word) { word.word += chars[i]; word.end = end; }
    else word = {word: chars[i], start, end};
  }
  if (word) words.push(word);
  if (!words.length || words.some(w => w.end - w.start < 0.001)) throw Error('Empty or zero-duration aligned word');
  return words;
}
export function captionsFromWords(words) { return groupWords({words}); }
const stamp = (seconds, separator) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}${separator}${String(ms % 1000).padStart(3, '0')}`;
};
export function subtitles(cues, format) {
  const sep = format === 'vtt' ? '.' : ',';
  return (format === 'vtt' ? 'WEBVTT\n\n' : '') + cues.map((c, i) =>
    `${i + 1}\n${stamp(c.start, sep)} --> ${stamp(c.end, sep)}\n${c.text}\n`).join('\n');
}

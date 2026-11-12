// One provider, one HTTP request. No retries and no credential-bearing diagnostics.
export const MODEL = 'eleven_multilingual_v2';
export const FORMAT = 'mp3_44100_128';
export async function synthesize({text, voiceId, modelId = MODEL, apiKey, fetchImpl = fetch}) {
  if (!apiKey || !voiceId) throw Error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID locally');
  if (typeof text !== 'string' || !text.trim()) throw Error('Exact narration text is required');
  if (!/^[a-zA-Z0-9_-]+$/.test(voiceId)) throw Error('Invalid ElevenLabs voice ID');
  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=${FORMAT}`;
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(180000),
      headers: {'xi-api-key': apiKey, 'Content-Type': 'application/json'},
      body: JSON.stringify({text, model_id: modelId, apply_text_normalization: 'off'}),
    });
  } catch {
    throw Error('ElevenLabs transport failed; request may have been billed. No automatic retry.');
  }
  if (!response.ok) throw Error(`ElevenLabs HTTP ${response.status}; no automatic retry.`);
  let raw;
  try { raw = await response.json(); } catch { throw Error('ElevenLabs returned invalid JSON; no automatic retry.'); }
  if (typeof raw.audio_base64 !== 'string' || !raw.audio_base64.length) throw Error('ElevenLabs response has no audio; no automatic retry.');
  const audio = Buffer.from(raw.audio_base64, 'base64');
  if (!audio.length) throw Error('ElevenLabs returned empty audio; no automatic retry.');
  // Store only useful response fields, never request headers or arbitrary echoed errors.
  return {audio, metadata: {provider: 'ElevenLabs', endpoint, voice_id: voiceId, model_id: modelId,
    output_format: FORMAT, request_id: response.headers?.get('request-id') ?? null,
    alignment: raw.alignment ?? null, normalized_alignment: raw.normalized_alignment ?? null}};
}

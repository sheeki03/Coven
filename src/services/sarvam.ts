/**
 * Sarvam AI TTS service — calls /api/tts (proxied to Sarvam).
 * Caches base64 audio in-memory with LRU eviction.
 */

const DEFAULT_SPEAKER = 'amit';

// LRU cache: hash(text+speaker) → base64 string
const MAX_CACHE = 30;
const cache = new Map<string, { base64: string; blobUrl: string | null }>();
const cacheOrder: string[] = [];

function cacheKey(text: string, speaker: string): string {
  let hash = 0;
  const combined = text + '|' + speaker;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
  }
  return String(hash);
}

function evictOldest() {
  while (cacheOrder.length > MAX_CACHE) {
    const oldest = cacheOrder.shift()!;
    const entry = cache.get(oldest);
    if (entry?.blobUrl) {
      URL.revokeObjectURL(entry.blobUrl);
    }
    cache.delete(oldest);
  }
}

export function getSpeaker(suspectName: string, speakerMap?: Record<string, string>): string {
  if (speakerMap) return speakerMap[suspectName] ?? DEFAULT_SPEAKER;
  return DEFAULT_SPEAKER;
}

export function clearTtsCache() {
  for (const entry of cache.values()) {
    if (entry.blobUrl) URL.revokeObjectURL(entry.blobUrl);
  }
  cache.clear();
  cacheOrder.length = 0;
}

interface TtsOptions {
  text: string;
  speaker: string;
  pace?: number;
  signal?: AbortSignal;
}

export async function textToSpeech({ text, speaker, pace = 1.0, signal }: TtsOptions): Promise<string | null> {
  // Hard clamp to 2300 chars to avoid Sarvam 2500-char limit
  const clampedText = text.length > 2300 ? text.slice(0, 2300) : text;

  const key = cacheKey(clampedText, speaker);
  const cached = cache.get(key);
  if (cached) {
    // Promote in LRU
    const idx = cacheOrder.indexOf(key);
    if (idx > -1) cacheOrder.splice(idx, 1);
    cacheOrder.push(key);
    if (!cached.blobUrl) {
      cached.blobUrl = base64ToUrl(cached.base64);
    }
    return cached.blobUrl;
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: clampedText,
        target_language_code: 'en-IN',
        speaker,
        model: 'bulbul:v3',
        pace,
        speech_sample_rate: 16000,
      }),
      signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    const base64 = data.audios?.[0];
    if (!base64) return null;

    const blobUrl = base64ToUrl(base64);
    cache.set(key, { base64, blobUrl });
    cacheOrder.push(key);
    evictOldest();

    return blobUrl;
  } catch {
    return null;
  }
}

function base64ToUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// --- STT ---

const MAX_STT_CALLS = 6;

interface SttOptions {
  audioBlob: Blob;
  signal?: AbortSignal;
}

/** Convert any audio blob to 16-bit mono WAV using Web Audio API */
async function convertToWav(audioBlob: Blob): Promise<Blob> {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioCtx = new AudioContext({ sampleRate: 16000 });

  try {
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    // Take first channel, resample to 16kHz
    const channelData = decoded.getChannelData(0);
    const sampleRate = 16000;

    // If decoded sample rate differs, resample
    let samples: Float32Array;
    if (decoded.sampleRate !== sampleRate) {
      const ratio = decoded.sampleRate / sampleRate;
      const newLength = Math.floor(channelData.length / ratio);
      samples = new Float32Array(newLength);
      for (let i = 0; i < newLength; i++) {
        samples[i] = channelData[Math.floor(i * ratio)];
      }
    } else {
      samples = channelData;
    }

    // Encode as 16-bit PCM WAV
    const numSamples = samples.length;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);          // chunk size
    view.setUint16(20, 1, true);           // PCM
    view.setUint16(22, 1, true);           // mono
    view.setUint32(24, sampleRate, true);   // sample rate
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true);           // block align
    view.setUint16(34, 16, true);          // bits per sample
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // PCM samples
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  } finally {
    await audioCtx.close();
  }
}

export async function speechToText({ audioBlob, signal }: SttOptions): Promise<string | null> {
  // Convert webm to WAV — Sarvam only accepts WAV
  let wavBlob: Blob;
  try {
    console.log(`[COVEN STT] Converting ${audioBlob.size}b webm to WAV...`);
    wavBlob = await convertToWav(audioBlob);
    console.log(`[COVEN STT] WAV conversion done: ${wavBlob.size}b`);
  } catch (err) {
    console.warn('[COVEN STT] WAV conversion failed:', err);
    return null;
  }

  try {
    const form = new FormData();
    form.append('file', wavBlob, 'recording.wav');
    form.append('model', 'saarika:v2.5');
    form.append('language_code', 'en-IN');

    const res = await fetch('/api/stt', {
      method: 'POST',
      body: form,
      signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[COVEN STT] failed: ${res.status} ${errText}`);
      return null;
    }

    const data = await res.json();
    const transcript = data.transcript ?? '';
    console.log(`[COVEN STT] transcript="${transcript}"`);

    return transcript.trim().length > 0 ? transcript : null;
  } catch (err) {
    console.warn('[COVEN STT] error:', err);
    return null;
  }
}

export { MAX_STT_CALLS };

/** Get TTS pace from temperament + pressure. NEVER guilt-coded. */
export function getTtsPace(temperament: string, pressure: number): number {
  const baseMap: Record<string, number> = {
    timid: 1.1,
    arrogant: 0.9,
    annoyed: 1.05,
    talkative: 1.15,
    clipped: 0.95,
    poetic: 0.85,
  };
  const base = baseMap[temperament] ?? 1.0;
  // Pressure shifts: higher pressure = slightly faster (nervous) up to P2, then slower (breaking) at P3
  const pressureShift = pressure <= 2 ? pressure * 0.03 : -0.05;
  return Math.max(0.5, Math.min(2.0, base + pressureShift));
}

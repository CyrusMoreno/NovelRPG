/**
 * Utility to generate standard PCM WAV Audio Data URLs on the fly
 * without external audio assets or network downloads.
 */

export function generateWavDataUrl(
  generateSample: (t: number, sampleRate: number) => number,
  durationSec: number = 0.25,
  sampleRate: number = 22050
): string {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF Chunk Descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');

  // fmt Sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data Sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Write Audio PCM Samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let s = generateSample(t, sampleRate);
    s = Math.max(-1, Math.min(1, s)); // Clamp between -1 and 1
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  // Convert ArrayBuffer to Base64 Data URL
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Standard preset sound effects synthesized into real WAV Data URLs
 */
export const SYNTH_SOUND_EFFECTS = {
  // Crisp UI Click / Tap
  click: () =>
    generateWavDataUrl((t) => {
      const decay = Math.exp(-t * 40);
      const freq = 520 - t * 1200;
      return Math.sin(2 * Math.PI * Math.max(100, freq) * t) * decay;
    }, 0.08),

  // Gold Coin Clink & Jingle (Light novel purchasing)
  coinPurchase: () =>
    generateWavDataUrl((t) => {
      const decay1 = Math.exp(-t * 12);
      const decay2 = Math.exp(-Math.max(0, t - 0.06) * 16);
      const tone1 = Math.sin(2 * Math.PI * 987.77 * t) * decay1; // B5
      const tone2 = t > 0.06 ? Math.sin(2 * Math.PI * 1318.51 * (t - 0.06)) * decay2 : 0; // E6
      return (tone1 * 0.6 + tone2 * 0.7) * 0.7;
    }, 0.28),

  // Cipher Solved / Victory Arpeggio Chime
  successFanfare: () =>
    generateWavDataUrl((t) => {
      let val = 0;
      // Arpeggio notes: C5 (523), E5 (659), G5 (784), C6 (1046)
      const notes = [
        { start: 0.0, freq: 523.25 },
        { start: 0.07, freq: 659.25 },
        { start: 0.14, freq: 783.99 },
        { start: 0.21, freq: 1046.5 }
      ];
      notes.forEach(({ start, freq }) => {
        if (t >= start) {
          const dt = t - start;
          const decay = Math.exp(-dt * 9);
          val += Math.sin(2 * Math.PI * freq * dt) * decay * 0.4;
        }
      });
      return val;
    }, 0.45),

  // Item Secured / Vault Lock Latch Click
  vaultStash: () =>
    generateWavDataUrl((t) => {
      const pulse1 = Math.exp(-t * 30) * Math.sin(2 * Math.PI * 300 * t);
      const pulse2 = t > 0.08 ? Math.exp(-(t - 0.08) * 35) * Math.sin(2 * Math.PI * 180 * (t - 0.08)) : 0;
      return pulse1 * 0.6 + pulse2 * 0.8;
    }, 0.22),

  // Error / Warning Buzzer
  errorBuzzer: () =>
    generateWavDataUrl((t) => {
      const decay = Math.exp(-t * 7);
      // Low square-like saw tone
      const phase = (t * 140) % 1;
      const saw = (phase > 0.5 ? 0.7 : -0.7) * decay;
      return saw * 0.6;
    }, 0.24),

  // Dialogue Blip (Visual novel letter sound)
  dialogueBlip: () =>
    generateWavDataUrl((t) => {
      const decay = Math.exp(-t * 60);
      return Math.sin(2 * Math.PI * 440 * t) * decay * 0.4;
    }, 0.05)
};

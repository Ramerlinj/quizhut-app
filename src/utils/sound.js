let audioCtx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq, startOffset, duration, type = 'sine', volume = 0.08) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playSound(kind, enabled = true) {
  if (!enabled) return;
  try {
    if (kind === 'correct') {
      playTone(523.25, 0, 0.16, 'triangle', 0.09); // C5
      playTone(659.25, 0.08, 0.2, 'triangle', 0.09); // E5
      playTone(783.99, 0.16, 0.28, 'triangle', 0.08); // G5
    } else if (kind === 'wrong') {
      playTone(311.13, 0, 0.16, 'sine', 0.07); // D#4
      playTone(261.63, 0.11, 0.24, 'sine', 0.07); // C4
    } else if (kind === 'click') {
      playTone(587.33, 0, 0.07, 'sine', 0.04);
    } else if (kind === 'finish') {
      playTone(523.25, 0, 0.18, 'triangle', 0.08);
      playTone(659.25, 0.1, 0.18, 'triangle', 0.08);
      playTone(783.99, 0.2, 0.18, 'triangle', 0.08);
      playTone(1046.5, 0.3, 0.4, 'triangle', 0.09);
    }
  } catch {
    // Ignore audio errors
  }
}

/**
 * Procedural Web Audio API Guqin (古琴) pentatonic pluck synthesizer.
 * Zero external audio assets required; works deterministically in any modern browser.
 */

const PENTATONIC_FREQS = [
  130.81, // C3 (宫)
  146.83, // D3 (商)
  164.81, // E3 (角)
  196.00, // G3 (徵)
  220.00, // A3 (羽)
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
];

class GuqinSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted = true;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean): void {
    this.isMuted = !enabled;
    if (enabled) {
      this.ensureContext();
      this.playChord(0);
    }
  }

  public getEnabled(): boolean {
    return !this.isMuted;
  }

  public playPluck(noteIndex: number, delaySec = 0, volume = 0.12): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const freq = PENTATONIC_FREQS[Math.abs(noteIndex) % PENTATONIC_FREQS.length];

    // Fundamental + soft 2nd and 3rd harmonics (Guqin silk string timbre)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);
    // Subtle pitch glide characteristic of Guqin Yin/Rao (吟猱)
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.004, now + 0.45);
    osc1.frequency.exponentialRampToValueAtTime(freq, now + 1.2);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(920, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + 2.4);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.9);
    osc2.stop(now + 2.9);
  }

  public playChord(seedIndex: number): void {
    if (this.isMuted) return;
    this.playPluck(seedIndex, 0, 0.11);
    this.playPluck(seedIndex + 2, 0.22, 0.08);
    this.playPluck(seedIndex + 4, 0.52, 0.07);
  }
}

export const guqinAudio = new GuqinSoundEngine();

class SoundService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(440, 'square', 0.1, 0.05);
  }

  playSuccess() {
    this.playTone(523.25, 'square', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'square', 0.1, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'square', 0.3, 0.1), 200); // G5
  }

  playFail() {
    this.playTone(110, 'sawtooth', 0.5, 0.1);
    setTimeout(() => this.playTone(73.42, 'sawtooth', 0.5, 0.1), 100);
  }

  playTick() {
    this.playTone(880, 'sine', 0.05, 0.02);
  }
}

export const soundService = new SoundService();

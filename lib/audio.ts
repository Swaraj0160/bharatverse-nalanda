"use client";

/**
 * All sound is synthesised in the browser — no audio files, so nothing to
 * license and nothing to fail to load. A tanpura-like drone (a stack of
 * detuned partials through a slow filter sweep) plus short shaped-noise
 * gestures for paper, ink and seal.
 */

let ctx: AudioContext | null = null;
let droneGain: GainNode | null = null;
let running = false;

function ac(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

export function startDrone() {
  if (running) return;
  const c = ac();
  if (c.state === "suspended") void c.resume();
  running = true;

  droneGain = c.createGain();
  droneGain.gain.value = 0;
  droneGain.gain.linearRampToValueAtTime(0.06, c.currentTime + 2.2);
  droneGain.connect(c.destination);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  lp.Q.value = 6;
  lp.connect(droneGain);

  // slow filter sweep — the "life" of the drone
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  // Sa (C3) + Pa (G3) + Sa (C4), each a pair of slightly detuned saws
  const partials = [130.81, 130.81, 196.0, 261.63, 261.63];
  const detunes = [-4, 5, 3, -6, 6];
  partials.forEach((f, i) => {
    const o = c.createOscillator();
    o.type = i === 2 ? "triangle" : "sawtooth";
    o.frequency.value = f;
    o.detune.value = detunes[i];
    const g = c.createGain();
    g.gain.value = i === 0 || i === 3 ? 0.5 : 0.28;
    o.connect(g);
    g.connect(lp);
    o.start();
  });
}

export function stopDrone() {
  if (!ctx || !droneGain) return;
  const c = ctx;
  droneGain.gain.cancelScheduledValues(c.currentTime);
  droneGain.gain.linearRampToValueAtTime(0, c.currentTime + 1.4);
  running = false;
}

export function isDroneRunning() {
  return running;
}

function noiseBurst(dur: number, shape: (t: number) => number, filterHz: number, q = 1) {
  if (!ctx) return;
  const c = ctx;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * shape(i / len);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = filterHz;
  bp.Q.value = q;
  const g = c.createGain();
  g.gain.value = 0.5;
  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start();
}

/** A short plucked tone — for musical game cues layered over the drone. */
function tone(freq: number, dur: number, type: OscillatorType = "triangle", gain = 0.16) {
  if (!ctx) return;
  const c = ctx;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function chord(freqs: number[], dur: number, stagger = 0.06) {
  freqs.forEach((f, i) => setTimeout(() => tone(f, dur, "triangle", 0.13), i * stagger * 1000));
}

type Sfx =
  | "paper"
  | "ink"
  | "seal"
  | "shell"
  | "success"
  | "fail"
  | "unlock"
  | "combo"
  | "star"
  | "tick"
  | "whoosh";

let comboStep = 0;

export function sfx(kind: Sfx) {
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  switch (kind) {
    case "paper":
      noiseBurst(0.22, (t) => Math.pow(1 - t, 2.5) * (0.5 + 0.5 * Math.sin(t * 60)), 2600, 0.7);
      break;
    case "ink":
      noiseBurst(0.35, (t) => Math.pow(1 - t, 1.6), 800, 0.9);
      break;
    case "seal":
      noiseBurst(0.14, (t) => (t < 0.15 ? t / 0.15 : Math.pow(1 - t, 3)), 320, 2);
      break;
    case "shell":
      noiseBurst(0.18, (t) => Math.pow(1 - t, 4) * (0.6 + 0.4 * Math.random()), 4200, 1.4);
      break;
    case "success":
      // a rising perfect fifth on the Sa–Pa of the drone
      tone(392, 0.18);
      setTimeout(() => tone(587.33, 0.32, "triangle", 0.15), 90);
      break;
    case "fail":
      tone(196, 0.16, "sawtooth", 0.12);
      setTimeout(() => tone(146.83, 0.34, "sawtooth", 0.1), 80);
      noiseBurst(0.3, (t) => Math.pow(1 - t, 2), 500, 0.8);
      break;
    case "unlock":
      chord([261.63, 392, 523.25, 659.25], 0.5, 0.08);
      break;
    case "combo": {
      const steps = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];
      tone(steps[Math.min(comboStep, steps.length - 1)], 0.16, "triangle", 0.14);
      comboStep = Math.min(comboStep + 1, steps.length - 1);
      break;
    }
    case "star":
      tone(659.25, 0.14, "triangle", 0.16);
      setTimeout(() => tone(987.77, 0.3, "triangle", 0.14), 70);
      break;
    case "tick":
      tone(1046.5, 0.05, "square", 0.05);
      break;
    case "whoosh":
      noiseBurst(0.26, (t) => Math.sin(Math.PI * t) * (1 - t), 1400, 0.6);
      break;
  }
}

/** call when a streak breaks so `combo` restarts low */
export function resetCombo() {
  comboStep = 0;
}

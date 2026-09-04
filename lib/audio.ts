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

type Sfx = "paper" | "ink" | "seal" | "shell";

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
  }
}

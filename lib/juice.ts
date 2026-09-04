"use client";

/**
 * A tiny pub/sub so any game can fire feedback ("juice") without prop-drilling.
 * <JuiceLayer/> (mounted once in the root layout) subscribes and renders it.
 */

export type JuiceEvent =
  | { t: "burst"; x: number; y: number; color?: string; count?: number; spread?: number }
  | { t: "pop"; x: number; y: number; text: string; color?: string }
  | { t: "shake"; ms?: number }
  | { t: "flash"; color?: string; ms?: number }
  | { t: "confettiSeal"; x: number; y: number };

type Handler = (e: JuiceEvent) => void;
const handlers = new Set<Handler>();

export function subscribeJuice(fn: Handler): () => void {
  handlers.add(fn);
  return () => handlers.delete(fn);
}

function emit(e: JuiceEvent) {
  handlers.forEach((h) => h(e));
}

/** Palette-safe defaults so bursts always read as "this world". */
const INK = "#1B1712";
const HINGULA = "#B23A2E";
const HARITALA = "#D9A63F";
const GREEN = "#5B7B5A";

export const juice = {
  burst: (x: number, y: number, opts: { color?: string; count?: number; spread?: number } = {}) =>
    emit({ t: "burst", x, y, color: opts.color ?? HARITALA, count: opts.count ?? 16, spread: opts.spread ?? 1 }),
  good: (x: number, y: number) => emit({ t: "burst", x, y, color: GREEN, count: 18, spread: 1.1 }),
  bad: (x: number, y: number) => emit({ t: "burst", x, y, color: HINGULA, count: 10, spread: 0.7 }),
  pop: (x: number, y: number, text: string, color = INK) => emit({ t: "pop", x, y, text, color }),
  shake: (ms = 260) => emit({ t: "shake", ms }),
  flash: (color = "rgba(178,58,46,0.16)", ms = 220) => emit({ t: "flash", color, ms }),
};

export function useJuice() {
  return juice;
}

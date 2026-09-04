"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { RECON_TEXTS, RECON_DECOYS } from "@/content/reconstruction";
import { useGame } from "@/lib/store";
import { starsFromScore } from "@/lib/games/scoring";
import { sfx, resetCombo } from "@/lib/audio";
import { juice } from "@/lib/juice";
import { WaxButton } from "@/components/chrome/WaxButton";
import type { GameProps } from "@/components/campaign/LevelShell";

type Frag = {
  id: string;
  text: string;
  kind: "real" | "decoy";
  correct: number | null;
  rot: number;
};

const TEXT_FOR: Record<number, string> = { 1: "colophon", 2: "pramana", 3: "seal" };

function sample<T>(a: T[], n: number): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x.slice(0, Math.max(0, n));
}
const shuffle = <T,>(a: T[]) => sample(a, a.length);

export function ReconstructionGame({ level, onComplete }: GameProps) {
  const lang = useGame((s) => s.lang);
  const p = level.params;
  const grid = Number(p.grid ?? 3);
  const decoyN = Number(p.decoys ?? 0);
  const rotate = Number(p.rotate ?? 0) > 0;
  const budget = Number(p.moveBudget ?? 0);
  const fadeMs = Number(p.fadeMs ?? 0);
  const n = grid * grid;

  const text = RECON_TEXTS[TEXT_FOR[level.index] ?? "colophon"];

  const build = useCallback((): { tray: Frag[] } => {
    const src =
      lang === "hi" && text.hi.length === text.fragments.length ? text.hi : text.fragments;
    const real: Frag[] = src.slice(0, n).map((s, i) => ({
      id: `r${i}`,
      text: s,
      kind: "real",
      correct: i,
      rot: rotate ? 180 : 0,
    }));
    const decoys: Frag[] = sample(RECON_DECOYS, decoyN).map((d, i) => ({
      id: `d${i}`,
      text: lang === "hi" ? d.hi : d.en,
      kind: "decoy",
      correct: null,
      rot: rotate ? 180 : 0,
    }));
    return { tray: shuffle([...real, ...decoys]) };
  }, [lang, text, n, rotate, decoyN]);

  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [tray, setTray] = useState<Frag[]>([]);
  const [board, setBoard] = useState<(Frag | null)[]>(Array(n).fill(null));
  const [locked, setLocked] = useState<Set<number>>(new Set());
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [hand, setHand] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [touched, setTouched] = useState<Record<string, number>>({});
  const [, force] = useState(0);

  const endedRef = useRef(false);
  const startRef = useRef(0);
  const comboRef = useRef(0);
  const bumpCombo = () => {
    comboRef.current += 1;
    if (comboRef.current >= 2) sfx("combo");
  };
  const comboBreak = () => {
    comboRef.current = 0;
    resetCombo();
  };

  const begin = () => {
    const { tray: tr } = build();
    setTray(tr);
    setBoard(Array(n).fill(null));
    setLocked(new Set());
    setDiscarded([]);
    setHand(null);
    setMoves(0);
    setMistakes(0);
    setTouched({});
    endedRef.current = false;
    startRef.current = Date.now();
    setPhase("play");
    resetCombo();
  };

  const totalDecoys = useMemo(() => decoyN, [decoyN]);

  const maxEst = useMemo(
    () => 40 * grid + (budget > 0 ? budget * 3 : 50) + decoyN * 8,
    [grid, budget, decoyN],
  );
  const thresholds = useMemo<[number, number, number]>(
    () => [
      Math.round(maxEst * 0.5),
      Math.round(maxEst * 0.75),
      Math.round(maxEst * 0.92),
    ],
    [maxEst],
  );

  const finish = useCallback(
    (won: boolean, mv: number, miss: number, decoysCleared: number) => {
      if (endedRef.current) return;
      endedRef.current = true;
      const budgetLeft = budget > 0 ? Math.max(0, budget - mv) : 12;
      const raw = 40 * grid + budgetLeft * 3 + decoysCleared * 8 - miss * 10;
      const score = Math.max(0, Math.round(raw));
      const stars = won ? starsFromScore(score, thresholds) : 0;
      setPhase("end");
      setTimeout(
        () =>
          onComplete({
            cleared: won,
            stars,
            score,
            timeMs: Date.now() - startRef.current,
            mistakes: miss,
          }),
        450,
      );
    },
    [budget, grid, thresholds, onComplete],
  );

  // fade tick
  useEffect(() => {
    if (!fadeMs || phase !== "play") return;
    const id = setInterval(() => force((x) => x + 1), 900);
    return () => clearInterval(id);
  }, [fadeMs, phase]);

  const note = (id: string) => setTouched((t) => ({ ...t, [id]: Date.now() }));
  const faded = (id: string) =>
    fadeMs > 0 && phase === "play" && Date.now() - (touched[id] ?? startRef.current) > fadeMs;

  const checkWin = (lk: Set<number>, disc: string[]) => {
    const allLocked = lk.size === n;
    const allDecoys = Array.from({ length: totalDecoys }).every((_, i) =>
      disc.includes(`d${i}`),
    );
    return allLocked && allDecoys;
  };

  const overBudget = (mv: number) => budget > 0 && mv >= budget;

  const place = (cell: number) => {
    if (phase !== "play" || hand == null || board[cell] || locked.has(cell)) return;
    const frag = tray.find((f) => f.id === hand);
    if (!frag) return;
    note(frag.id);
    const mv = moves + 1;
    setMoves(mv);
    setTray((t) => t.filter((f) => f.id !== frag.id));
    setBoard((b) => {
      const nb = [...b];
      nb[cell] = frag;
      return nb;
    });
    setHand(null);

    const rectC = document.getElementById(`cell-${cell}`)?.getBoundingClientRect();
    const cx = rectC ? rectC.left + rectC.width / 2 : innerWidth / 2;
    const cy = rectC ? rectC.top + rectC.height / 2 : innerHeight / 2;

    if (frag.kind === "real" && frag.correct === cell && (!rotate || frag.rot === 0)) {
      const lk = new Set(locked).add(cell);
      setLocked(lk);
      bumpCombo();
      sfx("success");
      juice.good(cx, cy);
      juice.pop(cx, cy, "✓", "#5B7B5A");
      if (checkWin(lk, discarded)) finish(true, mv, mistakes, discarded.length);
    } else if (frag.kind === "decoy") {
      setMistakes((m) => m + 1);
      comboBreak();
      sfx("fail");
      juice.bad(cx, cy);
      juice.shake(180);
      juice.pop(cx, cy, lang === "hi" ? "यह नहीं" : "not this", "#B23A2E");
    } else {
      sfx("paper");
    }
    if (overBudget(mv) && !checkWin(locked, discarded)) finish(false, mv, mistakes, discarded.length);
  };

  const pickBack = (cell: number) => {
    if (phase !== "play" || locked.has(cell) || !board[cell]) return;
    const frag = board[cell]!;
    setBoard((b) => {
      const nb = [...b];
      nb[cell] = null;
      return nb;
    });
    setTray((t) => [frag, ...t]);
    setMoves((m) => m + 1);
    setHand(frag.id);
  };

  const rotateFrag = (id: string, where: "tray" | number) => {
    if (phase !== "play" || !rotate) return;
    // orienting a fragment is core play, not a penalty — no move cost
    note(id);
    sfx("paper");
    if (where === "tray") {
      setTray((t) => t.map((f) => (f.id === id ? { ...f, rot: (f.rot + 180) % 360 } : f)));
    } else {
      setBoard((b) => {
        const nb = [...b];
        const f = nb[where];
        if (f && f.id === id) {
          const nf = { ...f, rot: (f.rot + 180) % 360 };
          nb[where] = nf;
          if (nf.kind === "real" && nf.correct === where && nf.rot === 0) {
            const lk = new Set(locked).add(where as number);
            setLocked(lk);
            bumpCombo();
            sfx("success");
            const r = document.getElementById(`cell-${where}`)?.getBoundingClientRect();
            juice.good(
              r ? r.left + r.width / 2 : innerWidth / 2,
              r ? r.top + r.height / 2 : innerHeight / 2,
            );
            if (checkWin(lk, discarded)) finish(true, moves, mistakes, discarded.length);
          }
        }
        return nb;
      });
    }
  };

  const discard = (id: string, e: React.MouseEvent) => {
    if (phase !== "play") return;
    const frag = tray.find((f) => f.id === id);
    if (!frag) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (frag.kind === "real") {
      setMistakes((m) => m + 1);
      comboBreak();
      sfx("fail");
      juice.bad(cx, cy);
      juice.shake(160);
      juice.pop(cx, cy, lang === "hi" ? "यह पत्र का है" : "belongs to the leaf", "#B23A2E");
      return;
    }
    const disc = [...discarded, id];
    setDiscarded(disc);
    setTray((t) => t.filter((f) => f.id !== id));
    setMoves((m) => m + 1);
    sfx("tick");
    juice.pop(cx, cy, "✓", "#5B7B5A");
    if (checkWin(locked, disc)) finish(true, moves + 1, mistakes, disc.length);
  };

  const assembled = useMemo(() => {
    const parts: string[] = [];
    for (let i = 0; i < n; i++) if (locked.has(i) && board[i]) parts.push(board[i]!.text);
    return parts.join(" ");
  }, [locked, board, n]);

  /* ---------- render ---------- */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
          {level.arc} · {lang === "hi" ? `स्तर ${level.index}` : `Level ${level.index}`}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
          {lang === "hi"
            ? `${n} टुकड़े क्रम में जोड़ो ताकि पाठ पढ़ा जा सके। ${decoyN ? "किसी और पुस्तक के टुकड़े हटाओ। " : ""}${rotate ? "कुछ टुकड़े घुमे हुए हैं। " : ""}${budget ? `${budget} चालें।` : ""}`
            : `Place ${n} fragments in order so the text reads. ${decoyN ? "Discard the fragments from other books. " : ""}${rotate ? "Some fragments are rotated. " : ""}${budget ? `${budget} moves.` : ""}`}
        </p>
        <div className="mt-6">
          <WaxButton onClick={begin}>{lang === "hi" ? "आरंभ करें" : "Begin"}</WaxButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 font-body text-[12px] text-ink-soft">
        <span>
          {locked.size}/{n} {lang === "hi" ? "जुड़े" : "set"}
        </span>
        {decoyN > 0 && (
          <span>
            {discarded.length}/{decoyN} {lang === "hi" ? "हटाए" : "discarded"}
          </span>
        )}
        {budget > 0 && (
          <span className={clsx(moves >= budget * 0.85 && "text-hingula")}>
            {lang === "hi" ? "चालें" : "moves"} {moves}/{budget}
          </span>
        )}
        {mistakes > 0 && <span className="text-hingula">{mistakes} {lang === "hi" ? "त्रुटि" : "wrong"}</span>}
      </div>

      {assembled && (
        <p className="mb-4 border-l-2 border-terreverte/50 pl-3 font-body text-[13px] italic leading-relaxed text-ink">
          {assembled}
        </p>
      )}

      {/* board */}
      <div
        className="mb-5 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}
      >
        {board.map((frag, i) => {
          const isLocked = locked.has(i);
          return (
            <button
              key={i}
              id={`cell-${i}`}
              data-hot
              onClick={() => {
                if (!frag) return place(i);
                if (isLocked) return;
                if (rotate && frag.correct === i && frag.rot !== 0)
                  return rotateFrag(frag.id, i);
                pickBack(i);
              }}
              className={clsx(
                "relative min-h-[58px] overflow-hidden border p-1.5 text-left align-top font-body text-[11px] leading-tight transition-colors",
                isLocked
                  ? "border-terreverte/60 bg-terreverte/10 text-ink"
                  : frag
                    ? "border-hingula/50 bg-hingula/5 text-ink"
                    : hand != null
                      ? "border-dashed border-hingula/60 bg-leaf hover:bg-hingula/5"
                      : "border-dashed border-ink/20 bg-leaf-deep/20",
              )}
            >
              {frag ? (
                <>
                  <span
                    className="block origin-center transition-transform"
                    style={{ transform: `rotate(${rotate ? frag.rot : 0}deg)` }}
                  >
                    {frag.text}
                  </span>
                  {!isLocked && rotate && frag.rot !== 0 && (
                    <span className="absolute right-0.5 top-0.5 text-[13px] text-hingula">
                      ↻
                    </span>
                  )}
                </>
              ) : (
                <span className="text-ink/25">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* tray */}
      <p className="mb-1.5 font-body text-[11px] uppercase tracking-widest text-ink-soft">
        {lang === "hi" ? "टुकड़े" : "Fragments"}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tray.map((f) => (
          <span
            key={f.id}
            onMouseEnter={() => note(f.id)}
            className={clsx(
              "group inline-flex items-center gap-1 border px-2 py-1 font-body text-[12px] transition-colors",
              hand === f.id
                ? "border-hingula bg-hingula/15 text-ink"
                : "border-ink/30 bg-leaf text-ink hover:border-hingula/50",
              faded(f.id) && "opacity-40 blur-[0.6px]",
            )}
          >
            <button data-hot onClick={() => setHand((h) => (h === f.id ? null : f.id))}>
              <span
                className="inline-block"
                style={{ transform: `rotate(${rotate ? f.rot : 0}deg)` }}
              >
                {f.text}
              </span>
            </button>
            {rotate && (
              <button
                onClick={() => rotateFrag(f.id, "tray")}
                className="text-hingula/70 hover:text-hingula"
                aria-label="rotate"
              >
                ↻
              </button>
            )}
            <button
              onClick={(e) => discard(f.id, e)}
              className="text-ink/30 hover:text-hingula"
              aria-label="discard"
            >
              ✕
            </button>
          </span>
        ))}
        {tray.length === 0 && (
          <span className="font-body text-xs italic text-ink-soft">
            {lang === "hi" ? "तसला ख़ाली" : "tray empty"}
          </span>
        )}
      </div>
    </div>
  );
}

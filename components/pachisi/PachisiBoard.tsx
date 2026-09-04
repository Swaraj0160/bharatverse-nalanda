"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { clsx } from "clsx";
import {
  newGame,
  throwDice,
  legalMoves,
  applyMove,
  aiChooseMove,
  cellFor,
  LOOP,
  HOME_COL,
  SAFE_RING,
  FINISH,
  type PState,
  type Move,
} from "@/lib/pachisi/engine";
import { chronicle } from "@/lib/pachisi/chronicle";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";
import { sfx } from "@/lib/audio";
import { WaxButton } from "@/components/chrome/WaxButton";

const PLUS = new Set<string>();
for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 15; j++) {
    if ((i >= 6 && i <= 8) || (j >= 6 && j <= 8)) PLUS.add(`${i},${j}`);
  }
}

export function PachisiBoard() {
  const lang = useGame((s) => s.lang);
  const score = useGame((s) => s.score);
  const earnSeal = useGame((s) => s.earnSeal);

  const [difficulty, setDifficulty] = useState<1 | 2>(2);
  const [state, setState] = useState<PState>(() => newGame(2));
  const [throwKey, setThrowKey] = useState(0);
  const scoredRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = (d: 1 | 2) => {
    setDifficulty(d);
    setState(newGame(d));
    scoredRef.current = false;
    setThrowKey((k) => k + 1);
  };

  const cast = useCallback(() => {
    setState((s) => {
      if (s.turn !== "you" || s.awaitingMove || s.winner) return s;
      sfx("shell");
      return throwDice(s);
    });
    setThrowKey((k) => k + 1);
  }, []);

  const pickToken = (i: number) => {
    setState((s) => {
      if (s.turn !== "you" || !s.awaitingMove || s.winner) return s;
      const mv = legalMoves(s).find((m) => m.token === i);
      if (!mv) return s;
      sfx(mv.capture ? "seal" : "ink");
      return applyMove(s, mv);
    });
  };

  /* AI + auto-continue driver */
  useEffect(() => {
    if (state.winner) return;
    if (timer.current) clearTimeout(timer.current);

    // human rolled a grace but had no move -> roll again
    if (state.turn === "you" && !state.awaitingMove && state.value != null && state.grace) {
      timer.current = setTimeout(() => {
        sfx("shell");
        setState((s) => throwDice(s));
        setThrowKey((k) => k + 1);
      }, 850);
      return;
    }

    if (state.turn !== "ai") return;

    if (!state.awaitingMove) {
      timer.current = setTimeout(() => {
        sfx("shell");
        setState((s) => throwDice(s));
        setThrowKey((k) => k + 1);
      }, 780);
    } else {
      timer.current = setTimeout(() => {
        setState((s) => {
          const mv = aiChooseMove(s);
          if (!mv) return s;
          sfx(mv.capture ? "seal" : "ink");
          return applyMove(s, mv);
        });
      }, 820);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state]);

  /* score once on finish */
  useEffect(() => {
    if (state.winner && !scoredRef.current) {
      scoredRef.current = true;
      score("pachisi", state.winner === "you" ? 1 : 0.35);
      if (state.winner === "you") earnSeal("keeper");
    }
  }, [state.winner, score, earnSeal]);

  const moves: Move[] =
    state.awaitingMove && state.turn === "you" && !state.winner ? legalMoves(state) : [];
  const movable = new Set(moves.map((m) => m.token));

  const cx = (c: number) => c + 0.5;
  const cy = (r: number) => r + 0.5;

  return (
    <MotionConfig reducedMotion="never">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* board */}
      <div className="mx-auto w-full max-w-[560px]">
        <svg viewBox="-0.4 -0.4 15.8 15.8" className="w-full select-none">
          {/* plus cells */}
          {[...PLUS].map((k) => {
            const [c, r] = k.split(",").map(Number);
            return (
              <rect
                key={k}
                x={c}
                y={r}
                width={1}
                height={1}
                fill="var(--leaf)"
                stroke="rgba(27,23,18,0.16)"
                strokeWidth={0.03}
              />
            );
          })}

          {/* home columns */}
          {HOME_COL.you.map(([c, r], i) => (
            <rect key={`hy${i}`} x={c} y={r} width={1} height={1} fill="rgba(178,58,46,0.16)" />
          ))}
          {HOME_COL.ai.map(([c, r], i) => (
            <rect key={`ha${i}`} x={c} y={r} width={1} height={1} fill="rgba(46,76,126,0.16)" />
          ))}

          {/* entry cells */}
          <rect x={LOOP[0][0]} y={LOOP[0][1]} width={1} height={1} fill="rgba(178,58,46,0.28)" />
          <rect x={LOOP[26][0]} y={LOOP[26][1]} width={1} height={1} fill="rgba(46,76,126,0.28)" />

          {/* safe squares */}
          {[...SAFE_RING].map((idx) => {
            const [c, r] = LOOP[idx];
            return (
              <g key={`s${idx}`} stroke="rgba(27,23,18,0.5)" strokeWidth={0.05}>
                <line x1={c + 0.2} y1={r + 0.2} x2={c + 0.8} y2={r + 0.8} />
                <line x1={c + 0.8} y1={r + 0.2} x2={c + 0.2} y2={r + 0.8} />
              </g>
            );
          })}

          {/* centre charkoni */}
          <rect x={6} y={6} width={3} height={3} fill="var(--leaf-deep)" stroke="rgba(27,23,18,0.3)" strokeWidth={0.04} />
          <path d="M6 6 L7.5 7.5 L6 9 Z" fill="rgba(178,58,46,0.5)" />
          <path d="M9 6 L7.5 7.5 L9 9 Z" fill="rgba(46,76,126,0.5)" />
          <path d="M6 6 L7.5 7.5 L9 6 Z" fill="rgba(217,166,63,0.5)" />
          <path d="M6 9 L7.5 7.5 L9 9 Z" fill="rgba(91,123,90,0.5)" />

          {/* tokens on board */}
          {(["you", "ai"] as const).map((pl) =>
            state.tokens[pl].map((pos, i) => {
              const cell = cellFor(pl, pos);
              if (!cell) {
                if (pos === FINISH) {
                  const off = i === 0 ? -0.28 : 0.28;
                  return (
                    <Token
                      key={`${pl}${i}`}
                      x={7.5 + off}
                      y={7.5}
                      player={pl}
                      dim
                    />
                  );
                }
                return null;
              }
              const nudge = state.tokens[pl][1 - i] === pos ? (i === 0 ? -0.18 : 0.18) : 0;
              const canMove = pl === "you" && movable.has(i);
              return (
                <Token
                  key={`${pl}${i}`}
                  x={cx(cell[0]) + nudge}
                  y={cy(cell[1])}
                  player={pl}
                  active={canMove}
                  onClick={canMove ? () => pickToken(i) : undefined}
                />
              );
            }),
          )}
        </svg>
      </div>

      {/* side panel */}
      <div className="flex flex-col gap-4">
        <div className="border border-ink/25 bg-leaf p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-sm text-ink">
              {state.winner
                ? state.winner === "you"
                  ? t("pachisi.youWin", lang)
                  : t("pachisi.youLose", lang)
                : state.turn === "you"
                  ? t("pachisi.yourTurn", lang)
                  : t("pachisi.theirTurn", lang)}
            </span>
            <span className="font-body text-xs text-ink-soft">
              {difficulty === 1 ? t("pachisi.easy", lang) : t("pachisi.hard", lang)}
            </span>
          </div>

          {/* cowrie tray */}
          <div className="flex items-center gap-1.5 border border-ink/15 bg-leaf-deep/40 p-2">
            <AnimatePresence mode="popLayout">
              {(state.faces ?? [false, false, false, false, false, false]).map((up, i) => (
                <motion.svg
                  key={`${throwKey}-${i}`}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  initial={{ rotateX: 0, scale: 0.7 }}
                  animate={{ rotateX: [0, 540, 360], scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 0.84, 0.44, 1] }}
                >
                  <ellipse
                    cx="11"
                    cy="11"
                    rx="8"
                    ry="6"
                    fill={up ? "var(--haritala)" : "none"}
                    stroke="var(--ink)"
                    strokeWidth="1.2"
                  />
                  {up && <path d="M6 11 Q11 8 16 11" stroke="var(--ink)" strokeWidth="1" fill="none" />}
                </motion.svg>
              ))}
            </AnimatePresence>
            <span className="ml-auto font-display text-lg tabular-nums text-hingula">
              {state.value ?? "—"}
            </span>
          </div>

          {state.grace && state.value != null && (
            <p className="mt-1.5 font-hand text-xs text-hingula">{t("pachisi.grace", lang)}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <WaxButton
              onClick={cast}
              disabled={state.turn !== "you" || state.awaitingMove || !!state.winner}
            >
              {t("pachisi.throw", lang)}
            </WaxButton>
            <WaxButton tone="quiet" onClick={() => reset(difficulty)}>
              {lang === "hi" ? "नया खेल" : "New game"}
            </WaxButton>
          </div>
          {state.awaitingMove && state.turn === "you" && moves.length > 0 && (
            <p className="mt-2 font-body text-xs text-ink-soft">
              {lang === "hi" ? "चलने के लिए गोटी चुनें।" : "Pick a glowing piece to move."}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => reset(1)}
              className={clsx(
                "flex-1 border px-2 py-1 font-display text-[11px]",
                difficulty === 1 ? "border-hingula text-hingula" : "border-ink/25 text-ink-soft",
              )}
            >
              {t("pachisi.easy", lang)}
            </button>
            <button
              onClick={() => reset(2)}
              className={clsx(
                "flex-1 border px-2 py-1 font-display text-[11px]",
                difficulty === 2 ? "border-hingula text-hingula" : "border-ink/25 text-ink-soft",
              )}
            >
              {t("pachisi.hard", lang)}
            </button>
          </div>
        </div>

        {/* tray */}
        <div className="border border-ink/25 bg-leaf p-3">
          <p className="mb-2 font-body text-[11px] uppercase tracking-widest text-ink-soft">
            {lang === "hi" ? "तसले में" : "In the tray"}
          </p>
          <div className="flex gap-4">
            {(["you", "ai"] as const).map((pl) => (
              <div key={pl} className="flex items-center gap-1.5">
                {state.tokens[pl].map((pos, i) =>
                  pos === 0 ? (
                    <button
                      key={i}
                      onClick={() => pl === "you" && pickToken(i)}
                      disabled={!(pl === "you" && movable.has(i))}
                      className={clsx(
                        "h-5 w-5 rounded-full border-2",
                        pl === "you" ? "border-hingula bg-hingula/30" : "border-lapis bg-lapis/30",
                        pl === "you" && movable.has(i) && "ring-2 ring-hingula ring-offset-1",
                      )}
                    />
                  ) : null,
                )}
                <span className="font-body text-[10px] text-ink/50">
                  {pl === "you" ? (lang === "hi" ? "लिपिक" : "scribe") : lang === "hi" ? "व्यापारी" : "merchant"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* chronicle */}
        {state.winner && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-ink/30 bg-leaf-deep/40 p-3"
          >
            <p className="mb-1.5 font-display text-sm text-ink">{t("pachisi.chronicle", lang)}</p>
            {chronicle(state.log, state.winner, lang).map((line, i) => (
              <p key={i} className="mb-1.5 font-hand text-[13px] leading-snug text-ink-soft last:mb-0">
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </div>
    </MotionConfig>
  );
}

function Token({
  x,
  y,
  player,
  active,
  dim,
  onClick,
}: {
  x: number;
  y: number;
  player: "you" | "ai";
  active?: boolean;
  dim?: boolean;
  onClick?: () => void;
}) {
  const fill = player === "you" ? "var(--hingula)" : "var(--lapis)";
  return (
    <motion.g
      initial={false}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      opacity={dim ? 0.55 : 1}
    >
      {active && (
        <motion.circle
          r={0.46}
          fill="none"
          stroke="var(--hingula)"
          strokeWidth={0.06}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ scale: [0.9, 1.28, 0.9], opacity: [0.9, 0.2, 0.9] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <circle r={0.34} fill={fill} stroke="var(--ink)" strokeWidth={0.05} />
      <circle r={0.13} fill="var(--leaf)" opacity={0.85} />
    </motion.g>
  );
}

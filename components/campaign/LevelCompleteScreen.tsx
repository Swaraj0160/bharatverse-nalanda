"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import type { LevelDef, LevelResult } from "@/lib/games/types";
import { useGame } from "@/lib/store";
import { sfx } from "@/lib/audio";
import { WaxButton } from "@/components/chrome/WaxButton";

function useCountUp(target: number, run: boolean, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

export function LevelCompleteScreen({
  open,
  level,
  result,
  xpGained,
  rankBefore,
  rankAfter,
  onReplay,
  onNext,
  onMap,
}: {
  open: boolean;
  level: LevelDef;
  result: LevelResult;
  xpGained: number;
  rankBefore: string;
  rankAfter: string;
  onReplay: () => void;
  onNext: (() => void) | null;
  onMap: () => void;
}) {
  const lang = useGame((s) => s.lang);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0 idle, 1 stars, 2 xp
  const [starsShown, setStarsShown] = useState(0);
  const xp = useCountUp(xpGained, phase >= 2);

  useEffect(() => {
    if (!open) {
      setPhase(0);
      setStarsShown(0);
      return;
    }
    sfx(result.cleared ? "unlock" : "fail");
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 350));
    for (let i = 0; i < result.stars; i++) {
      timers.push(
        setTimeout(() => {
          setStarsShown(i + 1);
          sfx("star");
        }, 650 + i * 420),
      );
    }
    timers.push(setTimeout(() => setPhase(2), 650 + result.stars * 420 + 300));
    return () => timers.forEach(clearTimeout);
  }, [open, result.stars, result.cleared]);

  const promoted = rankBefore !== rankAfter;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24, rotateX: -50 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.16, 0.84, 0.44, 1] }}
            style={{ transformOrigin: "top center", transformPerspective: 1000 }}
            className="relative z-10 w-full max-w-md border border-ink/40 bg-leaf p-7 text-center shadow-leaf"
          >
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
              {result.cleared
                ? lang === "hi"
                  ? "स्तर पूर्ण"
                  : "Level cleared"
                : lang === "hi"
                  ? "फिर से"
                  : "Not this time"}
            </p>
            <h2 className="mt-1 font-display text-2xl text-ink">{level.title[lang]}</h2>

            {/* stars */}
            <div className="mt-5 flex justify-center gap-3">
              {[0, 1, 2].map((i) => {
                const earned = i < result.stars && i < starsShown;
                return (
                  <div
                    key={i}
                    className={clsx(
                      "grid h-14 w-14 place-items-center rounded-full border-2 font-display text-2xl transition-all duration-300",
                      earned
                        ? "scale-100 border-ink/50 bg-hingula text-leaf"
                        : "scale-90 border-ink/15 bg-leaf-deep/50 text-ink/20",
                    )}
                    style={
                      earned && !reduce
                        ? { animation: "seal-in 520ms cubic-bezier(0.16,0.84,0.44,1) both" }
                        : undefined
                    }
                  >
                    ★
                  </div>
                );
              })}
            </div>

            {/* score line */}
            <p className="mt-4 font-body text-sm text-ink-soft">
              {lang === "hi" ? "अंक" : "Score"}:{" "}
              <span className="font-display text-ink">{Math.round(result.score)}</span>
              {result.timeMs > 0 && (
                <>
                  {"  ·  "}
                  {(result.timeMs / 1000).toFixed(1)}s
                </>
              )}
              {result.mistakes > 0 && (
                <>
                  {"  ·  "}
                  {result.mistakes} {lang === "hi" ? "त्रुटि" : "misses"}
                </>
              )}
            </p>

            {/* xp */}
            <div
              className={clsx(
                "mt-4 border-t border-ink/15 pt-3 transition-opacity duration-500",
                phase >= 2 ? "opacity-100" : "opacity-0",
              )}
            >
              <p className="font-display text-lg text-haritala">+{xp} XP</p>
              {promoted && phase >= 2 && (
                <p className="mt-1 font-body text-sm text-hingula">
                  {lang === "hi" ? "पदोन्नति — अब " : "Promoted — now "}
                  <span className="font-display">{rankAfter}</span>
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <WaxButton onClick={onReplay} tone="quiet">
                {lang === "hi" ? "फिर खेलें" : "Replay"}
              </WaxButton>
              <WaxButton onClick={onMap} tone="leaf">
                {lang === "hi" ? "मानचित्र" : "World map"}
              </WaxButton>
              {onNext && result.cleared && (
                <WaxButton onClick={onNext}>{lang === "hi" ? "अगला" : "Next level"}</WaxButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

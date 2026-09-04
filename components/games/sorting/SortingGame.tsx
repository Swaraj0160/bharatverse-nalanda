"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { SORT_ITEMS, type SortItem, type SortKind } from "@/content/sorting";
import { useGame } from "@/lib/store";
import { starsFromScore } from "@/lib/games/scoring";
import { sfx, resetCombo } from "@/lib/audio";
import { juice } from "@/lib/juice";
import { WaxButton } from "@/components/chrome/WaxButton";
import type { GameProps } from "@/components/campaign/LevelShell";

const SHELF = 4;

function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, n));
}
const shuffle = <T,>(a: T[]) => sample(a, a.length);

function buildQueue(p: Record<string, number | string | boolean>): SortItem[] {
  const items = Number(p.items ?? 8);
  const nDecoy = Number(p.decoys ?? 0);
  const nForgery = Number(p.forgery ?? 0);
  const pool = (k: SortKind) => SORT_ITEMS.filter((i) => i.kind === k);
  const restN = Math.max(0, items - nDecoy - nForgery);
  const nKeep = Math.max(1, Math.round(restN * 0.7));
  const nLeave = Math.max(0, restN - nKeep);
  return shuffle([
    ...sample(pool("keep"), nKeep),
    ...sample(pool("leave"), nLeave),
    ...sample(pool("decoy"), nDecoy),
    ...sample(pool("forgery"), nForgery),
  ]);
}

type Verdict = "keep" | "leave";

export function SortingGame({ level, onComplete }: GameProps) {
  const lang = useGame((s) => s.lang);
  const p = level.params;
  const seconds = Number(p.seconds ?? 60);
  const cartMax = Number(p.cart ?? 4);
  const faceDownN = Number(p.faceDown ?? 0);
  const speedUpAt = Number(p.speedUp ?? 0);

  const queue = useMemo(() => buildQueue(p), [p]);
  const targetScore = useMemo(
    () => queue.filter((i) => i.kind === "keep").reduce((s, i) => s + i.value, 0),
    [queue],
  );
  const thresholds = useMemo<[number, number, number]>(
    () => [
      Math.round(targetScore * 0.45),
      Math.round(targetScore * 0.72),
      Math.round(targetScore * 0.92),
    ],
    [targetScore],
  );

  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [shelf, setShelf] = useState<SortItem[]>([]);
  const [cart, setCart] = useState<SortItem[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [cartFull, setCartFull] = useState(false);

  const cursor = useRef(SHELF);
  const endedRef = useRef(false);
  const actedRef = useRef<Set<string>>(new Set());
  const cartRef = useRef<SortItem[]>([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(seconds);
  const missRef = useRef(0);
  useEffect(() => void (cartRef.current = cart), [cart]);
  useEffect(() => void (scoreRef.current = score), [score]);
  useEffect(() => void (timeRef.current = timeLeft), [timeLeft]);
  useEffect(() => void (missRef.current = mistakes), [mistakes]);

  const begin = () => {
    const faceDownIds = new Set(queue.slice(0, faceDownN).map((i) => i.id));
    setShelf(queue.slice(0, SHELF));
    setRevealed(new Set(queue.filter((i) => !faceDownIds.has(i.id)).map((i) => i.id)));
    cursor.current = SHELF;
    actedRef.current = new Set();
    cartRef.current = [];
    setTimeLeft(seconds);
    setPhase("play");
    resetCombo();
  };

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    const bonus = timeRef.current > 0 ? timeRef.current * 2 : 0;
    const final = Math.round(scoreRef.current + bonus);
    const stars = starsFromScore(final, thresholds);
    setScore(final);
    setPhase("end");
    setTimeout(
      () =>
        onComplete({
          cleared: final >= thresholds[0],
          stars,
          score: final,
          timeMs: (seconds - Math.max(0, timeRef.current)) * 1000,
          mistakes: missRef.current,
        }),
      450,
    );
  }, [onComplete, seconds, thresholds]);

  // timer
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 0;
        if (t <= 11) sfx("tick");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && timeLeft === 0) finish();
  }, [phase, timeLeft, finish]);
  useEffect(() => {
    if (phase === "play" && shelf.length === 0 && cursor.current >= queue.length) finish();
  }, [phase, shelf.length, queue.length, finish]);

  const pull = (without: SortItem) => {
    const nxt = cursor.current < queue.length ? queue[cursor.current] : null;
    if (nxt) cursor.current += 1;
    setShelf((sh) => {
      const kept = sh.filter((i) => i.id !== without.id);
      return nxt ? [...kept, nxt] : kept;
    });
  };

  const center = (el: EventTarget & Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const decide = (item: SortItem, verdict: Verdict, e: React.MouseEvent) => {
    if (phase !== "play") return;
    if (!revealed.has(item.id)) {
      setRevealed((s) => new Set(s).add(item.id));
      sfx("paper");
      return;
    }
    if (actedRef.current.has(item.id)) return; // guard rapid double-fire
    const { x, y } = center(e.currentTarget);

    if (verdict === "keep") {
      if (cartRef.current.length >= cartMax) {
        setCartFull(true);
        setTimeout(() => setCartFull(false), 550);
        sfx("fail");
        juice.shake(150);
        return;
      }
      actedRef.current.add(item.id);
      cartRef.current = [...cartRef.current, item];
      setCart((c) => [...c, item]);
      pull(item);
      if (item.kind === "keep") {
        setScore((s) => s + item.value);
        setCombo((c) => {
          const n = c + 1;
          if (n >= 2) sfx("combo");
          return n;
        });
        juice.good(x, y);
        sfx("success");
        juice.pop(x, y, `+${item.value}`, "#5B7B5A");
      } else if (item.kind === "leave") {
        setScore((s) => s + item.value);
        juice.pop(x, y, `+${item.value}`, "#4A3F33");
        sfx("paper");
      } else {
        setScore((s) => s + item.value);
        setMistakes((m) => m + 1);
        setCombo(0);
        resetCombo();
        juice.bad(x, y);
        sfx("fail");
        juice.shake(item.kind === "forgery" ? 320 : 220);
        juice.flash(item.kind === "forgery" ? "rgba(178,58,46,0.24)" : "rgba(178,58,46,0.14)");
        juice.pop(x, y, `${item.value}`, "#B23A2E");
      }
    } else {
      actedRef.current.add(item.id);
      pull(item);
      if (item.kind === "keep") {
        setScore((s) => s - 4);
        setMistakes((m) => m + 1);
        setCombo(0);
        resetCombo();
        juice.bad(x, y);
        juice.pop(x, y, lang === "hi" ? "खोया" : "lost", "#B23A2E");
      } else if (item.kind === "decoy" || item.kind === "forgery") {
        setScore((s) => s + 5);
        sfx("tick");
        juice.pop(x, y, "✓", "#5B7B5A");
      } else {
        setScore((s) => s + 2);
        sfx("tick");
      }
    }
  };

  const returnFromCart = (item: SortItem) => {
    if (phase !== "play") return;
    cartRef.current = cartRef.current.filter((i) => i.id !== item.id);
    setCart((c) => c.filter((i) => i.id !== item.id));
    if (item.kind === "keep") {
      setScore((s) => s - item.value - 4);
      setMistakes((m) => m + 1);
      setCombo(0);
      resetCombo();
    } else if (item.kind === "leave") {
      setScore((s) => s - item.value + 2);
    } else {
      setScore((s) => s - item.value + 5);
      setMistakes((m) => Math.max(0, m - 1));
    }
    sfx("paper");
  };

  const seenCount = Math.max(0, cursor.current - shelf.length);
  const urgent = timeLeft <= Math.max(10, speedUpAt) && phase === "play";

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
          {level.arc} · {lang === "hi" ? `स्तर ${level.index}` : `Level ${level.index}`}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
          {lang === "hi"
            ? `${seconds} सेकंड। तसले में ${cartMax} जगह। हर गट्ठर का सुराग़ पढ़ो — रखो या छोड़ो। जालसाज़ी और छल तुम्हारे अंक गिराते हैं।`
            : `${seconds} seconds. ${cartMax} slots in the cart. Read each bundle's clue — Keep or Leave. Decoys and the forgery cost you.`}
        </p>
        <div className="mt-6">
          <WaxButton onClick={begin}>{lang === "hi" ? "आरंभ करें" : "Begin"}</WaxButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[180px] flex-1">
          <div className="h-3 border border-ink/30 bg-leaf-deep/40">
            <div
              className={clsx(
                "h-full transition-[width] duration-1000 ease-linear",
                urgent ? "animate-pulse bg-hingula" : "bg-tala",
              )}
              style={{ width: `${(timeLeft / seconds) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between font-body text-[11px] text-ink-soft">
            <span>
              {timeLeft}s{urgent && (lang === "hi" ? " · जल्दी!" : " · hurry")}
            </span>
            <span>
              {Math.min(seenCount, queue.length)}/{queue.length}
            </span>
          </div>
        </div>
        <div className="font-display text-lg text-ink">
          {score}
          {combo >= 2 && (
            <span className="ml-2 font-body text-xs text-haritala">×{combo}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shelf.map((item) => {
            const seen = revealed.has(item.id);
            return (
              <div
                key={item.id}
                className="sort-card-in flex flex-col border border-ink/25 bg-leaf p-3 shadow-leaf"
              >
                {seen ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display text-2xl text-hingula">{item.glyph}</span>
                      <span className="text-right font-body text-[10px] uppercase tracking-wide text-ink-soft">
                        {item.subject[lang]}
                      </span>
                    </div>
                    <p className="mt-1 font-display text-[13px] leading-tight text-ink">
                      {item.title[lang]}
                    </p>
                    <p className="mt-1 flex-1 font-body text-[12px] leading-snug text-ink-soft">
                      {item.clue[lang]}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={(e) => decide(item, "keep", e)}
                        data-hot
                        className={clsx(
                          "flex-1 border px-2 py-1 font-display text-[12px] transition-colors",
                          cart.length >= cartMax
                            ? "border-ink/15 text-ink/25"
                            : "border-terreverte/60 bg-terreverte/10 text-ink hover:bg-terreverte/20",
                        )}
                      >
                        {lang === "hi" ? "रखो ▲" : "Keep ▲"}
                      </button>
                      <button
                        onClick={(e) => decide(item, "leave", e)}
                        data-hot
                        className="flex-1 border border-ink/30 px-2 py-1 font-display text-[12px] text-ink-soft hover:border-hingula/50 hover:text-ink"
                      >
                        {lang === "hi" ? "छोड़ो ▼" : "Leave ▼"}
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={(e) => decide(item, "keep", e)}
                    data-hot
                    className="flex min-h-[130px] flex-col items-center justify-center gap-2 text-ink-soft"
                  >
                    <span className="font-display text-3xl">?</span>
                    <span className="font-body text-[11px] uppercase tracking-widest">
                      {lang === "hi" ? "पलटो" : "peek"}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-5">
        <p className="mb-1.5 font-body text-[11px] uppercase tracking-widest text-ink-soft">
          {lang === "hi" ? "तसला" : "The cart"} — {cart.length}/{cartMax}
          {cartFull && (
            <span className="ml-2 text-hingula">
              {lang === "hi" ? "भरा है — कुछ हटाओ" : "full — drop something"}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: cartMax }).map((_, i) => {
            const it = cart[i];
            return it ? (
              <button
                key={it.id}
                onClick={() => returnFromCart(it)}
                data-hot
                title={lang === "hi" ? "वापस फ़र्श पर" : "return to floor"}
                className="flex items-center gap-1.5 border border-terreverte/60 bg-terreverte/10 px-2 py-1 font-body text-[12px] text-ink hover:border-hingula/50"
              >
                <span className="font-display text-hingula">{it.glyph}</span>
                <span className="max-w-[14ch] truncate">{it.title[lang]}</span>
              </button>
            ) : (
              <span
                key={i}
                className={clsx(
                  "grid h-7 w-16 place-items-center border border-dashed font-body text-[10px]",
                  cartFull ? "border-hingula/50 text-hingula" : "border-ink/20 text-ink/25",
                )}
              >
                {lang === "hi" ? "खाली" : "slot"}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

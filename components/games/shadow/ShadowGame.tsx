"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import type { GameProps } from "@/components/campaign/LevelShell";
import { useGame } from "@/lib/store";
import { sfx, resetCombo } from "@/lib/audio";
import { juice } from "@/lib/juice";
import { WaxButton } from "@/components/chrome/WaxButton";
import { SundialWheel, type Scaffold } from "@/components/konark/SundialWheel";
import { fmt, clockDelta, MINUTES_PER_MAJOR } from "@/lib/konark";

/**
 * SHADOW & STONE — read the Konark chariot wheel as a sundial.
 *
 * GAME  → drag the vermilion reader to where you think the axle's shadow points
 * MECHANIC → the wheel's real geometry: 8 major spokes (3h), 8 minor (1.5h),
 *            480 rim beads (3 min), read anticlockwise from midnight at the top
 * LEARNING → astronomy, and the idea of a monument that is also an instrument
 *
 * Level params:
 *   snapMin   — reader snaps to this grid while dragging (90 = minor spokes)
 *   tol3/tol2/tol1 — |error| in minutes for 3/2/1 stars
 *   rounds    — how many shadows to read
 *   scaffold  — "all" | "major" | "none": how many hour labels are shown
 *   cloud     — ms the shadow hides mid-round (0 = never)
 */

type Phase = "intro" | "play" | "reveal" | "done";

export function ShadowGame({ level, onComplete }: GameProps) {
  const lang = useGame((s) => s.lang);
  const p = level.params;
  const snapMin = Number(p.snapMin ?? 90);
  const tol3 = Number(p.tol3 ?? 8);
  const tol2 = Number(p.tol2 ?? 20);
  const tol1 = Number(p.tol1 ?? 45);
  const rounds = Number(p.rounds ?? 4);
  const scaffold = (p.scaffold as Scaffold) ?? "major";
  const cloudMs = Number(p.cloud ?? 0);

  const targets = useMemo(() => {
    // spread targets across the day, jittered off the exact spokes
    const out: number[] = [];
    for (let i = 0; i < rounds; i++) {
      const base = Math.floor(((i + 0.5) / rounds) * 1440);
      const jitter = Math.round((Math.random() * 2 - 1) * (MINUTES_PER_MAJOR / 2 - 6));
      out.push(((base + jitter) % 1440 + 1440) % 1440);
    }
    return out;
  }, [rounds]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [reading, setReading] = useState(360);
  const [errors, setErrors] = useState<number[]>([]);
  const [clouded, setClouded] = useState(false);
  const startedAt = useRef(0);
  const endedRef = useRef(false);

  const target = targets[Math.min(round, targets.length - 1)];

  const begin = () => {
    setPhase("play");
    setRound(0);
    setReading(360);
    setErrors([]);
    startedAt.current = Date.now();
    endedRef.current = false;
    resetCombo();
  };

  // passing cloud
  useEffect(() => {
    if (phase !== "play" || !cloudMs) return;
    setClouded(false);
    const on = setTimeout(() => {
      setClouded(true);
      sfx("whoosh");
      const off = setTimeout(() => setClouded(false), cloudMs);
      return () => clearTimeout(off);
    }, 1200 + Math.random() * 2500);
    return () => clearTimeout(on);
  }, [phase, round, cloudMs]);

  const pick = (m: number) => {
    if (phase !== "play") return;
    const snapped = snapMin > 0 ? Math.round(m / snapMin) * snapMin : Math.round(m);
    setReading(((snapped % 1440) + 1440) % 1440);
  };

  const nudge = (delta: number) => {
    if (phase !== "play") return;
    setReading((r) => (((r + delta) % 1440) + 1440) % 1440);
    sfx("tick");
  };

  const finish = useCallback(
    (errs: number[]) => {
      if (endedRef.current) return;
      endedRef.current = true;
      const worst = Math.max(...errs);
      const avg = errs.reduce((a, b) => a + b, 0) / errs.length;
      let stars: 0 | 1 | 2 | 3 = 0;
      if (worst <= tol1) stars = 1;
      if (worst <= tol2) stars = 2;
      if (worst <= tol3) stars = 3;
      const score = Math.round(Math.max(0, rounds * 100 - avg * 6));
      setPhase("done");
      setTimeout(
        () =>
          onComplete({
            cleared: stars >= 1,
            stars,
            score,
            timeMs: Date.now() - startedAt.current,
            mistakes: errs.filter((e) => e > tol1).length,
            meta: { avgError: Math.round(avg), worstError: worst },
          }),
        640,
      );
    },
    [onComplete, rounds, tol1, tol2, tol3],
  );

  const lockIn = () => {
    if (phase !== "play") return;
    const err = Math.abs(clockDelta(reading, target));
    const nextErrors = [...errors, err];
    setErrors(nextErrors);
    setPhase("reveal");

    if (err <= tol3) {
      sfx("success");
      juice.good(innerWidth / 2, innerHeight / 2.4);
      juice.pop(innerWidth / 2, innerHeight / 2.4, lang === "hi" ? "बिलकुल!" : "dead on", "#5B7B5A");
    } else if (err <= tol2) {
      sfx("combo");
      juice.pop(innerWidth / 2, innerHeight / 2.4, `${err}m`, "#D9A63F");
    } else if (err <= tol1) {
      sfx("tick");
      juice.pop(innerWidth / 2, innerHeight / 2.4, `${err}m`, "#8C7355");
    } else {
      sfx("fail");
      juice.bad(innerWidth / 2, innerHeight / 2.4);
      juice.shake(200);
    }

    setTimeout(() => {
      if (round + 1 >= rounds) finish(nextErrors);
      else {
        setRound((r) => r + 1);
        setReading(360);
        setPhase("play");
      }
    }, 1500);
  };

  /* -------------------------------------------------------- render */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg py-8 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
          {level.arc} · {lang === "hi" ? `स्तर ${level.index}` : `Level ${level.index}`}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
          {lang === "hi"
            ? "कोणार्क का हर पहिया एक धूपघड़ी है। धुरी की छाया कहाँ पड़ रही है — पहिये पर वह समय पढ़िए। आठ मोटे अरे तीन-तीन घंटे के, आठ पतले अरे बीच में डेढ़-डेढ़ घंटे पर। ऊपर वाला अरा मध्यरात्रि; गिनती उलटी दिशा में।"
            : "Every wheel at Konark is a sundial. Read where the axle's shadow falls. Eight thick spokes three hours apart, eight thin ones halfway between at ninety minutes. The top spoke is midnight, and you count anticlockwise."}
        </p>
        <p className="mt-3 font-body text-xs text-stone-deep">
          {lang === "hi" ? "अपनी सूई को छाया पर लाइए, फिर पक्का कीजिए।" : "Bring your reader to the shadow, then lock it in."}
          {" · "}
          {lang === "hi" ? "3★ के लिए ±" : "3★ within ±"}
          {tol3}m
        </p>
        <div className="mt-6">
          <WaxButton onClick={begin}>{lang === "hi" ? "आरंभ" : "Begin"}</WaxButton>
        </div>
      </div>
    );
  }

  const revealErr = errors[errors.length - 1] ?? 0;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 flex items-center justify-between font-body text-[12px] text-ink-soft">
        <span>
          {lang === "hi" ? "पाठ" : "Reading"} {round + 1}/{rounds}
        </span>
        <span className="font-display text-base text-ink">
          {lang === "hi" ? "आपकी सूई: " : "your reader: "}
          {fmt(reading)}
        </span>
      </div>

      <div className="relative border border-stone-deep/40 bg-sandstone/40 p-3">
        <SundialWheel
          minutes={target}
          reading={reading}
          scaffold={scaffold}
          hideShadow={phase === "play" && clouded}
          onPickAngle={phase === "play" ? pick : undefined}
        />
        {phase === "play" && clouded && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="rounded bg-ink/70 px-3 py-1 font-body text-xs text-sandstone">
              {lang === "hi" ? "एक बादल गुज़रा…" : "a cloud passes…"}
            </span>
          </div>
        )}
        {phase === "reveal" && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div
              className={clsx(
                "rounded border px-4 py-2 text-center font-display",
                revealErr <= tol3
                  ? "border-terreverte bg-terreverte/15 text-terreverte"
                  : revealErr <= tol1
                    ? "border-haritala bg-haritala/15 text-ink"
                    : "border-hingula bg-hingula/15 text-hingula",
              )}
            >
              <div className="text-lg">{fmt(target)}</div>
              <div className="font-body text-xs">
                {revealErr === 0
                  ? lang === "hi"
                    ? "ठीक निशाने पर"
                    : "exactly right"
                  : `${lang === "hi" ? "अंतर" : "off by"} ${revealErr} ${lang === "hi" ? "मिनट" : "min"}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {phase === "play" && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => nudge(-snapMin || -1)}
            className="border border-stone-deep/40 px-3 py-1.5 font-display text-sm text-ink hover:bg-sandstone"
          >
            ◄ {snapMin >= 60 ? `${snapMin / 60}h` : `${snapMin}m`}
          </button>
          <button
            onClick={() => nudge(snapMin || 1)}
            className="border border-stone-deep/40 px-3 py-1.5 font-display text-sm text-ink hover:bg-sandstone"
          >
            {snapMin >= 60 ? `${snapMin / 60}h` : `${snapMin}m`} ►
          </button>
          <WaxButton onClick={lockIn}>{lang === "hi" ? "पक्का" : "Lock in"}</WaxButton>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import type { GameProps } from "@/components/campaign/LevelShell";
import { useGame } from "@/lib/store";
import { sfx, resetCombo } from "@/lib/audio";
import { juice } from "@/lib/juice";
import { WaxButton } from "@/components/chrome/WaxButton";
import { PROFILES, type Course } from "@/content/rebuild";

/**
 * REBUILD INDIA — reconstruct a monument's section from its courses.
 *
 * GAME  → pick the next course and set its horizontal offset; it must rest
 *         soundly on the course below
 * MECHANIC → footing-up assembly; structural validity = bearing (centre of a
 *            course lies within the span of the one beneath) + correct order
 * LEARNING → why a tower steps inward; load paths; why the finial is last
 *
 * Level params:
 *   shuffleOrder — 1: the tray is unordered (player must know the sequence)
 *   tol          — allowed |offset| as a fraction of base width before it is
 *                  "unsound" (smaller = harder)
 *   showGhost    — 1: faint correct silhouette shown behind
 */

type Placed = { course: Course; offset: number; sound: boolean };

const BASE_W = 300;
const STAGE_H = 320;

export function RebuildGame({ level, onComplete }: GameProps) {
  const lang = useGame((s) => s.lang);
  const p = level.params;
  const profileId = (p.profile as string) ?? "konarkDeul";
  const profile = PROFILES[profileId] ?? PROFILES.konarkDeul;
  const shuffleOrder = Number(p.shuffleOrder ?? 0) > 0;
  const tol = Number(p.tol ?? 0.16);
  const showGhost = Number(p.showGhost ?? 1) > 0;

  const tray = useMemo(() => {
    const cs = [...profile.courses];
    if (shuffleOrder) {
      for (let i = cs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cs[i], cs[j]] = [cs[j], cs[i]];
      }
      return cs;
    }
    return cs; // footing → finial
  }, [profile, shuffleOrder]);

  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const startedAt = useRef(0);
  const endedRef = useRef(false);

  const remaining = tray.filter((c) => !placed.some((pl) => pl.course.id === c.id));
  const nextCorrect = profile.courses[placed.length]; // footing-up expected
  const totalH = profile.courses.reduce((a, c) => a + c.h, 0);

  const begin = () => {
    setPhase("play");
    setPlaced([]);
    setSelId(shuffleOrder ? null : tray[0].id);
    setOffset(0);
    setMistakes(0);
    startedAt.current = Date.now();
    endedRef.current = false;
    resetCombo();
  };

  const finish = useCallback(
    (finalPlaced: Placed[], miss: number) => {
      if (endedRef.current) return;
      endedRef.current = true;
      const soundCount = finalPlaced.filter((pl) => pl.sound).length;
      const orderRight = finalPlaced.every(
        (pl, i) => pl.course.id === profile.courses[i].id,
      );
      let stars: 0 | 1 | 2 | 3 = 0;
      if (orderRight && soundCount === profile.courses.length) stars = 1;
      if (stars && miss <= 1) stars = 2;
      if (stars === 2 && miss === 0) stars = 3;
      const score = Math.round(
        soundCount * 60 + (orderRight ? 120 : 0) - miss * 25,
      );
      setPhase("done");
      setTimeout(
        () =>
          onComplete({
            cleared: stars >= 1,
            stars,
            score: Math.max(0, score),
            timeMs: Date.now() - startedAt.current,
            mistakes: miss,
          }),
        640,
      );
    },
    [onComplete, profile.courses],
  );

  const place = () => {
    if (phase !== "play" || !selId) return;
    const course = tray.find((c) => c.id === selId)!;
    const below = placed[placed.length - 1];

    // bearing check: this course's centre (its offset) must fall within the span
    // of the course below (or the platform for the first course).
    let sound = true;
    if (below) {
      const halfBelow = (below.course.w * BASE_W) / 2;
      const centreDelta = Math.abs(offset - below.offset) * BASE_W;
      sound = centreDelta <= halfBelow - 6 && Math.abs(offset) <= tol + 0.02;
    } else {
      sound = Math.abs(offset) <= tol;
    }
    const orderOk = course.id === nextCorrect?.id;
    const ok = sound && orderOk;

    const next = [...placed, { course, offset, sound: ok }];
    setPlaced(next);
    if (ok) {
      sfx("success");
      const el = document.getElementById("rebuild-stage")?.getBoundingClientRect();
      if (el) {
        juice.good(el.left + el.width / 2, el.top + 40);
        juice.pop(el.left + el.width / 2, el.top + 40, lang === "hi" ? "टिका!" : "seated", "#5B7B5A");
      }
    } else {
      setMistakes((m) => m + 1);
      sfx("fail");
      juice.shake(220);
      juice.flash("rgba(178,58,46,0.14)");
    }

    setSelId(null);
    setOffset(0);
    if (next.length === profile.courses.length) finish(next, mistakes + (ok ? 0 : 1));
    else if (!shuffleOrder) {
      const nc = profile.courses[next.length];
      setSelId(tray.find((c) => c.id === nc.id)?.id ?? null);
    }
  };

  /* ------------------------------------------------ render */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg py-8 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
          {level.arc} · {lang === "hi" ? `स्तर ${level.index}` : `Level ${level.index}`}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
          {lang === "hi"
            ? `${profile.title.hi} को नीचे से ऊपर फिर से खड़ा कीजिए। हर परत नीचे वाली पर ठीक से टिकनी चाहिए — कोई भार खाली जगह पर नहीं। शिखर भीतर की ओर सिमटता है, इसीलिए वह टिका रहता है।`
            : `Rebuild ${profile.title.en} from the footing up. Each course must bear on the one below — no load on a void. The tower steps inward as it rises; that is why it stands.`}
        </p>
        <div className="mt-6">
          <WaxButton onClick={begin}>{lang === "hi" ? "आरंभ" : "Begin"}</WaxButton>
        </div>
      </div>
    );
  }

  // draw placed courses bottom-up
  let yCursor = STAGE_H;
  const drawn = placed.map((pl) => {
    const h = (pl.course.h / totalH) * STAGE_H;
    yCursor -= h;
    const w = pl.course.w * BASE_W;
    return { pl, x: BASE_W / 2 + pl.offset * BASE_W - w / 2, y: yCursor, w, h };
  });

  let gy = STAGE_H;

  return (
    <div className="mx-auto max-w-xl">
      <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
        {/* stage */}
        <div
          id="rebuild-stage"
          className="relative border border-stone-deep/40 bg-sandstone/40"
          style={{ height: STAGE_H + 24 }}
        >
          <svg viewBox={`0 0 ${BASE_W} ${STAGE_H + 24}`} className="h-full w-full">
            {/* ground line */}
            <line x1="0" y1={STAGE_H + 2} x2={BASE_W} y2={STAGE_H + 2} stroke="#5E4B33" strokeWidth="2" />
            {/* ghost silhouette */}
            {showGhost &&
              profile.courses.map((c) => {
                const h = (c.h / totalH) * STAGE_H;
                gy -= h;
                const w = c.w * BASE_W;
                return (
                  <rect
                    key={`g${c.id}`}
                    x={BASE_W / 2 - w / 2}
                    y={gy}
                    width={w}
                    height={h - 1}
                    fill="none"
                    stroke="#8C7355"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.5"
                  />
                );
              })}
            {/* placed courses */}
            {drawn.map(({ pl, x, y, w, h }) => (
              <g key={pl.course.id}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h - 2}
                  fill={pl.sound ? "#B2966E" : "#B23A2E"}
                  fillOpacity={pl.sound ? 0.9 : 0.55}
                  stroke="#5E4B33"
                  strokeWidth="1.5"
                />
                {!pl.sound && (
                  <text x={x + w / 2} y={y + h / 2} textAnchor="middle" fontSize="12" fill="#fff">
                    ⚠
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* controls */}
        <div>
          <p className="mb-1 font-body text-[11px] uppercase tracking-widest text-ink-soft">
            {shuffleOrder
              ? lang === "hi"
                ? "अगली परत चुनिए"
                : "Choose the next course"
              : lang === "hi"
                ? "अगली परत"
                : "Next course"}
          </p>
          <div className="flex flex-col gap-1.5">
            {remaining.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelId(c.id)}
                disabled={!shuffleOrder && c.id !== nextCorrect?.id}
                className={clsx(
                  "border px-2 py-1.5 text-left font-body text-[12px] transition-colors",
                  selId === c.id
                    ? "border-hingula bg-hingula/10 text-ink"
                    : "border-stone-deep/40 text-ink hover:border-hingula/50 disabled:opacity-30",
                )}
              >
                {c.name[lang]}
              </button>
            ))}
          </div>

          {selId && (
            <div className="mt-3">
              <p className="font-body text-[11px] text-ink-soft">
                {lang === "hi" ? "क्षैतिज स्थिति" : "Horizontal offset"}
              </p>
              <input
                type="range"
                min={-30}
                max={30}
                value={Math.round(offset * 100)}
                onChange={(e) => setOffset(Number(e.target.value) / 100)}
                className="w-full accent-hingula"
              />
              <p className="mt-1 font-body text-[11px] leading-snug text-stone-deep">
                {tray.find((c) => c.id === selId)?.note[lang]}
              </p>
              <div className="mt-2">
                <WaxButton onClick={place}>{lang === "hi" ? "रखिए" : "Set course"}</WaxButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 font-body text-[11px] text-ink-soft">
        {placed.length}/{profile.courses.length}
        {mistakes > 0 && (
          <span className="ml-2 text-hingula">
            {mistakes} {lang === "hi" ? "अस्थिर" : "unsound"}
          </span>
        )}
      </p>
    </div>
  );
}

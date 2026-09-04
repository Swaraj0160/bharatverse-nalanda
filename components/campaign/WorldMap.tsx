"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { LEVELS, LEVELS_BY_ID, levelUnlocked } from "@/lib/games/levels";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { sfx } from "@/lib/audio";

/** Loose silhouette of the subcontinent — evocative, not a survey. */
const INDIA =
  "M30 8 L44 6 L52 12 L62 10 L70 16 L66 26 L74 30 L72 40 L80 44 L74 54 L66 60 L60 74 L54 88 L48 100 L44 88 L40 74 L34 64 L26 56 L22 44 L18 32 L22 20 Z";

type NodeState = "cleared" | "open" | "locked";

export function WorldMap() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const lang = useGame((s) => s.lang);
  const campaign = useGame((s) => s.campaign);
  const hydrated = useHydrated();
  const [sel, setSel] = useState<string | null>(null);

  const stateOf = (id: string): NodeState => {
    const lvl = LEVELS_BY_ID[id];
    const entry = campaign[id] ?? EMPTY_ENTRY;
    if (entry.cleared) return "cleared";
    if (!hydrated) return lvl.requires.length === 0 ? "open" : "locked";
    return levelUnlocked(lvl, campaign) ? "open" : "locked";
  };

  const edges = LEVELS.flatMap((l) =>
    l.requires
      .map((r) => LEVELS_BY_ID[r])
      .filter(Boolean)
      .map((from) => ({ from, to: l, key: `${from.id}-${l.id}` })),
  );

  const selLvl = sel ? LEVELS_BY_ID[sel] : null;
  const selEntry = sel ? campaign[sel] ?? EMPTY_ENTRY : null;

  return (
    <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
      <div className="relative border border-ink/25 bg-ink/[0.03] p-2">
        <svg viewBox="0 0 100 108" className="w-full">
          <path d={INDIA} fill="var(--leaf-deep)" stroke="var(--ink)" strokeWidth="0.5" strokeOpacity="0.5" />

          {edges.map(({ from, to, key }) => {
            const lit = stateOf(to.id) !== "locked";
            return (
              <motion.line
                key={key}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={lit ? "var(--hingula)" : "var(--ink)"}
                strokeOpacity={lit ? 0.5 : 0.15}
                strokeWidth={lit ? 0.5 : 0.35}
                strokeDasharray="1.6 1.4"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            );
          })}

          {LEVELS.map((l) => {
            const st = stateOf(l.id);
            const entry = campaign[l.id] ?? EMPTY_ENTRY;
            const color =
              st === "cleared" ? "var(--terreverte)" : st === "open" ? "var(--hingula)" : "var(--ink)";
            return (
              <g
                key={l.id}
                transform={`translate(${l.x} ${l.y})`}
                className={st === "locked" ? "cursor-default" : "cursor-pointer"}
                onClick={() => {
                  setSel(l.id);
                  if (st !== "locked") sfx("paper");
                }}
              >
                {st === "open" && !reduce && (
                  <motion.circle
                    r="2.6"
                    fill="none"
                    stroke="var(--hingula)"
                    strokeWidth="0.4"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    animate={{ scale: [0.7, 1.7, 0.7], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                )}
                <circle
                  r={sel === l.id ? 2.6 : 2}
                  fill={color}
                  fillOpacity={st === "locked" ? 0.28 : 1}
                  stroke="var(--leaf)"
                  strokeWidth="0.4"
                />
                {st === "cleared" && (
                  <text x="0" y="0.9" fontSize="2.4" textAnchor="middle" fill="var(--leaf)">
                    ✓
                  </text>
                )}
                {entry.stars > 0 && (
                  <text
                    x="0"
                    y="-3"
                    fontSize="2.6"
                    textAnchor="middle"
                    fill="var(--hingula)"
                    className="font-display"
                  >
                    {"★".repeat(entry.stars)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col justify-center border border-ink/25 bg-leaf p-4">
        {selLvl ? (
          <>
            <p className="font-body text-[11px] uppercase tracking-widest text-hingula">
              {selLvl.arc}
            </p>
            <h3 className="mt-1 font-display text-xl text-ink">{selLvl.title[lang]}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
              {selLvl.blurb[lang]}
            </p>
            {selEntry && selEntry.stars > 0 && (
              <p className="mt-2 font-display text-sm text-hingula">
                {"★".repeat(selEntry.stars)}
                <span className="text-ink/20">{"★".repeat(3 - selEntry.stars)}</span>
                <span className="ml-2 font-body text-xs text-ink-soft">
                  {lang === "hi" ? "सर्वोत्तम" : "best"} {selEntry.bestScore}
                </span>
              </p>
            )}
            <div className="mt-4">
              {stateOf(selLvl.id) === "locked" ? (
                <span className="border border-ink/25 px-3 py-1.5 font-display text-xs text-ink/40">
                  🔒 {lang === "hi" ? "बंद" : "locked"}
                </span>
              ) : (
                <button
                  onClick={() => {
                    sfx("seal");
                    router.push(`/play/${selLvl.id}`);
                  }}
                  className="border border-ink/40 bg-hingula px-4 py-2 font-display text-sm text-leaf hover:bg-redochre"
                >
                  {selLvl.playable || selLvl.params.external
                    ? lang === "hi"
                      ? "खेलें"
                      : "Play"
                    : lang === "hi"
                      ? "देखें"
                      : "Preview"}
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="font-body text-sm text-ink-soft">
            {lang === "hi"
              ? "किसी गाँठ को छूकर उसका स्तर देखें।"
              : "Touch a node to see its level."}
          </p>
        )}
      </div>
    </div>
  );
}

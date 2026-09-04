"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ROADMAP_PINS } from "@/content/roadmap";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";

/** Stylised map of the subcontinent with the future chapters greyed in. */
export function RoadmapPanel() {
  const lang = useGame((s) => s.lang);
  const [active, setActive] = useState<string>("nalanda");
  const pin = ROADMAP_PINS.find((p) => p.id === active) ?? ROADMAP_PINS[0];

  return (
    <section className="mt-20 border-t border-ink/20 pt-10">
      <h2 className="font-display text-2xl text-ink">{t("roadmap.title", lang)}</h2>
      <p className="mt-1 max-w-[54ch] font-body text-sm italic text-ink-soft">
        {t("roadmap.sub", lang)}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1.1fr_1fr]">
        <div className="relative border border-ink/20 bg-ink/[0.03] p-3">
          <svg viewBox="0 0 100 110" className="w-full">
            {/* very loose silhouette of the subcontinent — evocative, not a survey */}
            <path
              d="M30 8 L44 6 L52 12 L62 10 L70 16 L66 26 L74 30 L72 40 L80 44 L74 54 L66 60 L60 74 L54 88 L48 100 L44 88 L40 74 L34 64 L26 56 L22 44 L18 32 L22 20 Z"
              fill="var(--leaf-deep)"
              stroke="var(--ink)"
              strokeWidth="0.6"
              strokeOpacity="0.5"
            />
            {ROADMAP_PINS.map((p) => (
              <g
                key={p.id}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-pointer"
                onClick={() => setActive(p.id)}
              >
                {p.active && (
                  <motion.circle
                    r="3.5"
                    fill="none"
                    stroke="var(--hingula)"
                    strokeWidth="0.6"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    animate={{ scale: [0.7, 1.6, 0.7], opacity: [0.85, 0, 0.85] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                  />
                )}
                <circle
                  r={active === p.id ? 2.6 : 1.8}
                  fill={p.active ? "var(--hingula)" : active === p.id ? "var(--ink)" : "var(--ink)"}
                  fillOpacity={p.active ? 1 : active === p.id ? 0.8 : 0.35}
                />
                <text
                  x="3.5"
                  y="1.5"
                  fontSize="3"
                  fill="var(--ink)"
                  fillOpacity={p.active || active === p.id ? 0.9 : 0.4}
                  className="font-display"
                >
                  {p.label[lang]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-col justify-center border border-ink/20 bg-leaf p-4">
          <span className="font-body text-[11px] uppercase tracking-widest text-hingula">
            {pin.era}
          </span>
          <span className="mt-1 font-display text-xl text-ink">{pin.label[lang]}</span>
          <span className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
            {pin.note[lang]}
          </span>
          {!pin.active && (
            <span className="mt-3 w-fit border border-ink/25 px-2 py-0.5 font-display text-[10px] uppercase tracking-widest text-ink/40">
              {lang === "hi" ? "आगामी अध्याय" : "future chapter"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

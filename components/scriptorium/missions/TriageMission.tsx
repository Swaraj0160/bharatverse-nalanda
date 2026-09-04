"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { BUNDLES, TRIAGE_KEEP } from "@/content/missions";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";
import { sfx } from "@/lib/audio";
import { WaxButton } from "@/components/chrome/WaxButton";

export function TriageMission({ onDone }: { onDone: () => void }) {
  const lang = useGame((s) => s.lang);
  const done = useGame((s) => s.missions.triage);
  const completeTriage = useGame((s) => s.completeTriage);
  const discover = useGame((s) => s.discover);
  const score = useGame((s) => s.score);
  const earnSeal = useGame((s) => s.earnSeal);

  const [picked, setPicked] = useState<string[]>(done.done ? done.kept : []);
  const [sealed, setSealed] = useState(done.done);

  const toggle = (id: string) => {
    if (sealed) return;
    sfx("paper");
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length < TRIAGE_KEEP ? [...p, id] : p,
    );
  };

  const seal = () => {
    sfx("seal");
    setSealed(true);
    completeTriage(picked);
    discover(BUNDLES.map((b) => b.passageId));
    let outcome = 0.7;
    if (picked.includes("healer")) outcome += 0.1;
    if (picked.includes("tantra")) outcome += 0.1;
    if (picked.includes("logic") || picked.includes("prajna")) outcome += 0.1;
    score("triage", Math.min(1, outcome));
    if (picked.includes("healer")) earnSeal("healer");
    if (picked.includes("tantra")) earnSeal("chest");
  };

  return (
    <div>
      <p className="mb-4 font-body text-sm text-ink-soft">
        {lang === "hi"
          ? `आज रात केवल ${TRIAGE_KEEP} गट्ठर सवार के साथ जा सकते हैं। ${picked.length}/${TRIAGE_KEEP} चुने गए।`
          : `Only ${TRIAGE_KEEP} bundles leave with the rider tonight. ${picked.length}/${TRIAGE_KEEP} chosen.`}
      </p>

      <div className="space-y-2">
        {BUNDLES.map((b) => {
          const on = picked.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              data-hot
              disabled={sealed}
              className={clsx(
                "block w-full border px-3 py-2.5 text-left transition-colors",
                on
                  ? "border-hingula bg-hingula/10"
                  : "border-ink/20 bg-leaf hover:border-ink/40",
                b.fromChest && "border-dashed",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-[15px] text-ink">{b.title[lang]}</span>
                <span className="shrink-0 font-body text-[11px] uppercase tracking-wide text-ink-soft">
                  {b.subject[lang]}
                </span>
              </span>
              {sealed && (
                <span
                  className={clsx(
                    "mt-2 block border-l-2 pl-3 font-body text-[13px] leading-snug",
                    on ? "border-terreverte text-ink" : "border-redochre/50 text-ink-soft",
                  )}
                >
                  {on ? b.savedOutcome[lang] : b.lostOutcome[lang]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!sealed ? (
          <WaxButton onClick={seal} disabled={picked.length !== TRIAGE_KEEP}>
            {lang === "hi" ? "चयन पर मुहर लगाएँ" : "Seal these choices"}
          </WaxButton>
        ) : (
          <WaxButton onClick={onDone}>{t("mission.done", lang)}</WaxButton>
        )}
      </div>
    </div>
  );
}

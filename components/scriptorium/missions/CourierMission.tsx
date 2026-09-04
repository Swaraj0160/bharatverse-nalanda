"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { ROUTES } from "@/content/missions";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";
import { sfx } from "@/lib/audio";
import { WaxButton } from "@/components/chrome/WaxButton";

const GRADE_OUTCOME: Record<string, number> = { best: 1, partial: 0.65, worst: 0.25 };

export function CourierMission({ onDone }: { onDone: () => void }) {
  const lang = useGame((s) => s.lang);
  const done = useGame((s) => s.missions.courier);
  const complete = useGame((s) => s.completeCourier);
  const discover = useGame((s) => s.discover);
  const setLitNodes = useGame((s) => s.setLitNodes);
  const score = useGame((s) => s.score);
  const earnSeal = useGame((s) => s.earnSeal);
  const discovered = useGame((s) => s.discovered);

  const [chosen, setChosen] = useState<string | null>(done.routeId);
  const informed = ROUTES.some((r) => discovered.includes(r.passageId));

  const choose = (id: string) => {
    if (chosen) return;
    const route = ROUTES.find((r) => r.id === id)!;
    sfx("seal");
    setChosen(id);
    discover([route.passageId]);
    setLitNodes([route.nodeId]);
    let outcome = GRADE_OUTCOME[route.grade];
    if (informed) outcome = Math.min(1, outcome + 0.1);
    score("courier", outcome);
    complete(route.id, route.grade);
    if (route.id === "nepal") earnSeal("tibet");
  };

  const chosenRoute = ROUTES.find((r) => r.id === chosen);

  return (
    <div>
      <p className="mb-4 font-body text-sm text-ink-soft">
        {informed
          ? lang === "hi"
            ? "आपने मार्गों के बारे में पढ़ा है — यह निर्णय सूचित है।"
            : "You have read about the roads — this is an informed decision."
          : lang === "hi"
            ? "आपने अभी तक मार्गों के बारे में नहीं पूछा। इतिहासकार से पूछना बुद्धिमानी होगी।"
            : "You have not asked about the roads yet. It would be wise to consult the Historian first."}
      </p>

      <div className="space-y-2">
        {ROUTES.map((r) => (
          <button
            key={r.id}
            onClick={() => choose(r.id)}
            data-hot
            disabled={!!chosen}
            className={clsx(
              "block w-full border px-3 py-2.5 text-left transition-colors",
              chosen === r.id
                ? "border-hingula bg-hingula/10"
                : chosen
                  ? "border-ink/15 opacity-50"
                  : "border-ink/25 hover:border-ink/45",
            )}
          >
            <span className="block font-display text-[15px] text-ink">{r.name[lang]}</span>
            <span className="mt-0.5 block font-body text-[13px] text-ink-soft">{r.line[lang]}</span>
          </button>
        ))}
      </div>

      {chosenRoute && (
        <div
          className={clsx(
            "mt-5 border-l-2 pl-4",
            chosenRoute.grade === "best"
              ? "border-terreverte"
              : chosenRoute.grade === "partial"
                ? "border-haritala"
                : "border-hingula",
          )}
        >
          <p className="font-body text-[14px] leading-relaxed text-ink">
            {chosenRoute.outcome[lang]}
          </p>
          <div className="mt-3">
            <WaxButton onClick={onDone}>{t("mission.done", lang)}</WaxButton>
          </div>
        </div>
      )}
    </div>
  );
}

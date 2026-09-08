"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { LEVELS, ARCS, levelUnlocked } from "@/lib/games/levels";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { ShellNav } from "@/components/shell/ShellNav";

/** GAME → MECHANIC → LEARNING, published in-app per the brief. */
const MAPPING: Record<string, { mech: string; learn: string }> = {
  shadow: { mech: "Read the Konark wheel as a sundial", learn: "Astronomy; a monument that is an instrument" },
  rebuild: { mech: "Restack a tower from its courses, footing up", learn: "Load paths; why a spire steps inward" },
  sorting: { mech: "Triage manuscripts against a countdown and a forgery", learn: "Prioritisation; spotting a fake" },
  reconstruction: { mech: "Reassemble a torn leaf so it fits and reads", learn: "Pattern-matching; reading in sequence" },
  road: { mech: "Turn-based escape past fully-telegraphed patrols", learn: "Spatial planning; risk vs cover" },
  ashtapada: { mech: "The older race board, with the doubles rule", learn: "Blockade tactics; a traditional game" },
  gillidanda: { mech: "Timing-meter flick, then an angle-and-power strike", learn: "Timing; a traditional street game" },
  capstone: { mech: "Sort, reconstruct and run, back to back", learn: "Everything, under pressure" },
};

export function GamesHub() {
  const lang = useGame((s) => s.lang);
  const campaign = useGame((s) => s.campaign);
  const hydrated = useHydrated();

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[1000px] px-6 py-8">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
          {lang === "hi" ? "खेल — यही रीढ़ है" : "Games — the spine"}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          {lang === "hi" ? "सभी खेल" : "Every game"}
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-ink-soft">
          {lang === "hi"
            ? "हर खेल एक तंत्र है और एक सीख। सब बिना नेटवर्क के चलते हैं।"
            : "Each game is a mechanic and a lesson. All of them run with no network."}
        </p>

        {ARCS.map((arc) => {
          const levels = LEVELS.filter((l) => l.arc === arc);
          return (
            <section key={arc} className="mt-8">
              <h2 className="mb-3 border-b border-stone-deep/25 pb-1 font-display text-lg text-ink">
                {arc}
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {levels.map((l) => {
                  const e = hydrated ? campaign[l.id] ?? EMPTY_ENTRY : EMPTY_ENTRY;
                  const open = !hydrated
                    ? l.requires.length === 0
                    : levelUnlocked(l, campaign);
                  const map = MAPPING[l.game];
                  const body = (
                    <div
                      className={
                        "h-full border p-3 transition-colors " +
                        (open
                          ? "border-stone-deep/25 bg-sandstone/40 hover:border-hingula/50"
                          : "border-stone-deep/15 bg-sandstone/20 opacity-55")
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[15px] text-ink">
                          {l.title[lang]}
                        </span>
                        <span className="shrink-0 font-display text-sm text-hingula">
                          {open ? (
                            <>
                              {"★".repeat(e.stars)}
                              <span className="text-ink/20">{"★".repeat(3 - e.stars)}</span>
                            </>
                          ) : (
                            "🔒"
                          )}
                        </span>
                      </div>
                      <p className="mt-1 font-body text-[12px] text-ink-soft">{l.blurb[lang]}</p>
                      {map && (
                        <p className="mt-2 font-body text-[11px] text-stone-deep">
                          <span className="uppercase tracking-wide">
                            {lang === "hi" ? "सीख" : "learn"}:
                          </span>{" "}
                          {map.learn}
                        </p>
                      )}
                    </div>
                  );
                  return (
                    <div key={l.id}>
                      {open ? (
                        <Link
                          href={
                            l.params.external ? String(l.params.external) : `/play/${l.id}`
                          }
                        >
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

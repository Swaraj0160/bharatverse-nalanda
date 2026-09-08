"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useGame, useRankTier } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { SITES } from "@/content/heritage";
import { LEVELS, LEVELS_BY_ID } from "@/lib/games/levels";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { ShellNav } from "@/components/shell/ShellNav";

/** Mastery ladder — earned by interaction, never by time spent. */
function siteMastery(clearedStars: number[], total: number) {
  const cleared = clearedStars.filter((s) => s > 0).length;
  const threes = clearedStars.filter((s) => s === 3).length;
  if (total === 0) return "Discovered";
  if (cleared === 0) return "Discovered";
  if (cleared < total) return "Explored";
  if (threes < total) return "Practiced";
  return "Mastered";
}

const MASTERY_HI: Record<string, string> = {
  Discovered: "खोजा",
  Explored: "घूमा",
  Practiced: "अभ्यस्त",
  Mastered: "निपुण",
};

export function PassportPage() {
  const lang = useGame((s) => s.lang);
  const campaign = useGame((s) => s.campaign);
  const xp = useGame((s) => s.xp);
  const historyLen = useGame((s) => s.historyLog.length);
  const tier = useRankTier();
  const hydrated = useHydrated();

  const clearedLevels = LEVELS.filter((l) => (campaign[l.id]?.cleared ?? false));
  const totalStars = Object.values(campaign).reduce((a, e) => a + (e?.stars ?? 0), 0);

  const badges: { id: string; en: string; hi: string; got: boolean }[] = [
    { id: "b1", en: "First Reading", hi: "पहला पाठ", got: clearedLevels.length >= 1 },
    { id: "b2", en: "Sundial Reader", hi: "धूपघड़ी-पाठक", got: (campaign["shadow-3"]?.cleared ?? false) },
    { id: "b3", en: "Architecture Detective", hi: "स्थापत्य-गोयंदा", got: (campaign["rebuild-2"]?.cleared ?? false) },
    { id: "b4", en: "Asked the Guide", hi: "गाइड से पूछा", got: historyLen >= 1 },
    { id: "b5", en: "Night at Nalanda", hi: "नालंदा की रात", got: ["sorting-3", "reconstruction-3", "road-3"].every((i) => campaign[i]?.cleared) },
    { id: "b6", en: "Fifteen Stars", hi: "पंद्रह तारे", got: totalStars >= 15 },
  ];

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[900px] px-6 py-8">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
          {lang === "hi" ? "भारत विरासत पासपोर्ट" : "Bharat Heritage Passport"}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          {hydrated ? tier.title[lang] : "—"}
        </h1>
        <p className="mt-1 font-body text-sm text-stone-deep">
          {hydrated ? `${xp} XP · ${totalStars} ${lang === "hi" ? "तारे" : "stars"}` : ""}
        </p>

        {/* stamps */}
        <section className="mt-8">
          <h2 className="font-display text-xl text-ink">
            {lang === "hi" ? "मुहरें" : "Stamps"}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {SITES.map((site) => {
              const lv = site.games
                .map((id) => LEVELS_BY_ID[id])
                .filter((l) => l && !l.params.external);
              const stars = lv.map((l) => campaign[l.id]?.stars ?? 0);
              const cleared = stars.filter((s) => s > 0).length;
              const mastery = siteMastery(stars, lv.length);
              const stamped = cleared > 0;
              return (
                <Link
                  key={site.id}
                  href={`/site/${site.id}`}
                  className={clsx(
                    "relative border p-4 text-center transition-colors",
                    stamped
                      ? "border-hingula/60 bg-hingula/[0.06]"
                      : "border-dashed border-stone-deep/40 bg-sandstone/30",
                  )}
                >
                  {stamped && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-2 top-2 font-display text-3xl text-hingula/70 [animation:seal-in_520ms_var(--ease-ink)_both]"
                    >
                      ◉
                    </span>
                  )}
                  <p className="font-display text-[15px] text-ink">{site.name[lang]}</p>
                  <p className="font-body text-[11px] text-stone-deep">{site.state}</p>
                  <p className="mt-2 font-body text-[12px] text-ink-soft">
                    {cleared}/{lv.length} {lang === "hi" ? "खेल" : "games"}
                  </p>
                  <p className="mt-1 font-display text-[12px] text-hingula">
                    {lang === "hi" ? MASTERY_HI[mastery] : mastery}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* badges */}
        <section className="mt-8">
          <h2 className="font-display text-xl text-ink">
            {lang === "hi" ? "उपाधियाँ" : "Badges"}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={clsx(
                  "border p-3 text-center",
                  b.got
                    ? "border-haritala/60 bg-haritala/10"
                    : "border-stone-deep/20 bg-sandstone/20 opacity-50",
                )}
              >
                <span className="font-display text-2xl">{b.got ? "❂" : "○"}</span>
                <p className="mt-1 font-display text-[13px] text-ink">
                  {lang === "hi" ? b.hi : b.en}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

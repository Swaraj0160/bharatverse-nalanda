"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import { SITE_BY_ID } from "@/content/heritage";
import { LEVELS_BY_ID } from "@/lib/games/levels";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { ShellNav } from "@/components/shell/ShellNav";
import { BharatGuide } from "@/components/guide/BharatGuide";
import { WaxButton } from "@/components/chrome/WaxButton";

export function SitePage({ siteId }: { siteId: string }) {
  const lang = useGame((s) => s.lang);
  const campaign = useGame((s) => s.campaign);
  const site = SITE_BY_ID[siteId];

  if (!site) {
    return (
      <div>
        <ShellNav />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-ink">
            {lang === "hi" ? "यह स्थल नहीं मिला" : "No such site"}
          </h1>
          <Link href="/explore" className="mt-4 inline-block">
            <WaxButton>{lang === "hi" ? "खोजें" : "Explore"}</WaxButton>
          </Link>
        </main>
      </div>
    );
  }

  const games = site.games.map((id) => LEVELS_BY_ID[id]).filter(Boolean);

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[1000px] px-6 py-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-12" style={{ background: site.accent }} />
          <span
            className={clsx(
              "font-body text-[10px] uppercase tracking-wide",
              site.verification === "verified" ? "text-terreverte" : "text-hingula",
            )}
          >
            {site.verification}
          </span>
          <Link href="/explore" className="ml-auto font-body text-xs text-stone-deep hover:text-ink">
            ← {lang === "hi" ? "सभी स्थल" : "all sites"}
          </Link>
        </div>

        <h1 className="mt-3 font-display text-4xl text-ink">{site.name[lang]}</h1>
        <p className="font-body text-sm italic text-stone-deep">
          {site.epithet[lang]} · {site.state} · {site.period} · {site.dynasty}
        </p>
        <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-ink-soft">
          {site.summary[lang]}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/lens/${site.id}`}>
            <WaxButton>{lang === "hi" ? "हेरिटेज लेंस खोलें" : "Open Heritage Lens"}</WaxButton>
          </Link>
        </div>

        {/* timeline */}
        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">
            {lang === "hi" ? "समयरेखा" : "Timeline"}
          </h2>
          <ol className="mt-3 space-y-2 border-l-2 border-stone-deep/30 pl-4">
            {site.timeline.map((e, i) => (
              <li key={i} className="font-body text-[13px]">
                <span className="font-display text-hingula">{e.year}</span>
                {" — "}
                <span className={e.certain ? "text-ink" : "text-stone-deep"}>
                  {e.label[lang]}
                </span>
                {!e.certain && (
                  <span className="ml-1 border border-dashed border-stone-deep/50 px-1 text-[10px] uppercase text-stone-deep">
                    {lang === "hi" ? "विवादित" : "disputed"}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* games */}
        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">
            {lang === "hi" ? "इस स्थल के खेल" : "Games at this site"}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {games.map((g) => {
              const e = campaign[g.id] ?? EMPTY_ENTRY;
              return (
                <Link
                  key={g.id}
                  href={g.params.external ? String(g.params.external) : `/play/${g.id}`}
                  className="border border-stone-deep/25 bg-sandstone/40 p-4 transition-colors hover:border-hingula/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[15px] text-ink">{g.title[lang]}</span>
                    <span className="font-display text-sm text-hingula">
                      {"★".repeat(e.stars)}
                      <span className="text-ink/20">{"★".repeat(3 - e.stars)}</span>
                    </span>
                  </div>
                  <p className="mt-1 font-body text-[12px] text-ink-soft">{g.blurb[lang]}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* sources */}
        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">{lang === "hi" ? "स्रोत" : "Sources"}</h2>
          <ul className="mt-2 space-y-1">
            {site.sources.map((s, i) => (
              <li key={i} className="font-body text-[12px] text-stone-deep">
                · {s}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <BharatGuide siteId={site.id} screen="site" />
    </div>
  );
}

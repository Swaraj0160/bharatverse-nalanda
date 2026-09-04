"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { LEVELS, ARCS, levelUnlocked } from "@/lib/games/levels";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { t } from "@/content/i18n";
import { HudBar } from "@/components/chrome/HudBar";
import { Boot } from "@/components/chrome/Boot";

function Stars({ n }: { n: number }) {
  return (
    <span className="font-display text-sm tracking-tight">
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < n ? "text-hingula" : "text-ink/20"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function AtlasList() {
  const lang = useGame((s) => s.lang);
  const campaign = useGame((s) => s.campaign);
  const xp = useGame((s) => s.xp);
  const hydrated = useHydrated();

  return (
    <div className="min-h-screen">
      <Boot />
      <HudBar back={{ href: "/scriptorium", label: t("nav.scriptorium", lang) }} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
          {lang === "hi" ? "अभियान" : "The campaign"}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">
          {lang === "hi" ? "मानचित्र" : "The Atlas"}
        </h1>
        <p className="mt-2 font-body text-sm text-ink-soft">
          {lang === "hi"
            ? "हर गाँठ एक स्तर है। पिछला साफ़ करने पर अगला खुलता है।"
            : "Each node is a level. Clear one to unlock the next."}
          {hydrated && ` · ${xp} XP`}
        </p>

        {ARCS.map((arc) => (
          <section key={arc} className="mt-8">
            <h2 className="mb-3 border-b border-ink/20 pb-1 font-display text-lg text-ink">
              {arc}
            </h2>
            <ul className="space-y-2">
              {LEVELS.filter((l) => l.arc === arc).map((l) => {
                const entry = hydrated ? campaign[l.id] ?? EMPTY_ENTRY : EMPTY_ENTRY;
                const open = !hydrated
                  ? l.requires.length === 0
                  : levelUnlocked(l, campaign);
                const body = (
                  <div
                    className={
                      "flex items-center gap-3 border px-3 py-2.5 transition-colors " +
                      (open
                        ? "border-ink/25 bg-leaf hover:border-hingula/50"
                        : "border-ink/15 bg-leaf-deep/30 opacity-55")
                    }
                  >
                    <span
                      className={
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-display text-xs " +
                        (entry.cleared
                          ? "border-terreverte/60 bg-terreverte/15 text-terreverte"
                          : open
                            ? "border-hingula bg-hingula/10 text-hingula"
                            : "border-ink/25 text-ink/30")
                      }
                    >
                      {entry.cleared ? "✓" : open ? l.index || "◆" : "🔒"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[15px] text-ink">
                        {l.title[lang]}
                      </span>
                      <span className="block truncate font-body text-xs text-ink-soft">
                        {l.blurb[lang]}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <Stars n={entry.stars} />
                      {!l.playable && !l.params.external && (
                        <span className="block font-body text-[10px] uppercase tracking-wide text-ink/35">
                          {lang === "hi" ? "जल्द" : "soon"}
                        </span>
                      )}
                    </span>
                  </div>
                );
                return (
                  <li key={l.id}>
                    {open ? <Link href={`/play/${l.id}`}>{body}</Link> : body}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

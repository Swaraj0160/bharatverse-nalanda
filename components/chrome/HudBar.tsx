"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { useGame, useDemoMode, useRankTier, usePachisiUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { t } from "@/content/i18n";
import { sfx } from "@/lib/audio";

export function HudBar({ back }: { back?: { href: string; label: string } }) {
  const hydrated = useHydrated();
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const audioOn = useGame((s) => s.audioOn);
  const toggleAudio = useGame((s) => s.toggleAudio);
  const demoPref = useGame((s) => s.demoPref);
  const setDemoPref = useGame((s) => s.setDemoPref);
  const apiHasKey = useGame((s) => s.apiHasKey);
  const rating = useGame((s) => s.rating);
  const demo = useDemoMode();
  const tier = useRankTier();
  const unlocked = usePachisiUnlocked();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/20 bg-leaf/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 text-xs">
        <Link href="/" className="font-display text-sm tracking-wide text-ink hover:text-hingula">
          BHARATVERSE
        </Link>
        <span className="hidden text-ink/40 sm:inline">·</span>
        <span className="hidden font-body italic text-ink-soft sm:inline">
          {t("app.title", lang)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {hydrated && (
            <span
              className="hidden items-center gap-1.5 border border-ink/25 px-2 py-1 md:inline-flex"
              title={t("hud.rank", lang)}
            >
              <span className="font-display text-hingula">{tier.title[lang]}</span>
              <span className="tabular-nums text-ink-soft">{Math.round(rating)}</span>
            </span>
          )}

          {/* Demo / Live */}
          <button
            onClick={() => {
              sfx("seal");
              // cycle: auto -> demo -> live -> auto
              setDemoPref(demoPref === null ? true : demoPref === true ? false : null);
            }}
            className={clsx(
              "inline-flex items-center gap-1.5 border px-2 py-1 font-display tracking-wide transition-colors",
              demo
                ? "border-ink/40 bg-tala/40 text-ink"
                : "border-hingula/50 bg-hingula/15 text-hingula",
            )}
            title={demo ? t("hud.demoOn", lang) : t("hud.liveOn", lang)}
          >
            <span
              className={clsx(
                "h-1.5 w-1.5 rounded-full",
                demo ? "bg-ink/60" : "bg-hingula",
              )}
            />
            {demo ? t("hud.demo", lang) : t("hud.live", lang)}
            {demoPref === null && <span className="text-ink/40">·auto</span>}
          </button>

          <button
            onClick={toggleAudio}
            className={clsx(
              "border border-ink/25 px-2 py-1 font-display tracking-wide",
              audioOn ? "text-ink" : "text-ink/40",
            )}
            title={t("hud.audio", lang)}
          >
            {audioOn ? "♪" : "♪̶"}
          </button>

          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="border border-ink/25 px-2 py-1 font-display tracking-wide text-ink-soft hover:text-ink"
          >
            {t("hud.lang", lang)}
          </button>

          {hydrated && unlocked && (
            <Link
              href="/pachisi"
              className="border border-ink/25 px-2 py-1 font-display tracking-wide text-ink-soft hover:text-ink"
            >
              {t("nav.pachisi", lang)}
            </Link>
          )}
          {back && (
            <Link
              href={back.href}
              className="border border-ink/25 px-2 py-1 font-display tracking-wide text-ink-soft hover:text-ink"
            >
              {back.label}
            </Link>
          )}
        </div>
      </div>
      {hydrated && apiHasKey === false && demoPref === false && (
        <div className="bg-hingula/10 px-4 py-1 text-center text-[11px] text-hingula">
          {lang === "hi"
            ? "कुंजी नहीं मिली — सजीव विधा संचित उत्तरों पर लौट आएगी।"
            : "No API key on the server — Live Mode will fall back to cached answers."}
        </div>
      )}
    </header>
  );
}

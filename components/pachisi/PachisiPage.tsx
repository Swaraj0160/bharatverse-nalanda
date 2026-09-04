"use client";

import Link from "next/link";
import { useGame, usePachisiUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { t } from "@/content/i18n";
import { HudBar } from "@/components/chrome/HudBar";
import { Boot } from "@/components/chrome/Boot";
import { PachisiBoard } from "@/components/pachisi/PachisiBoard";
import { WaxButton } from "@/components/chrome/WaxButton";

export function PachisiPage() {
  const lang = useGame((s) => s.lang);
  const hydrated = useHydrated();
  const unlocked = usePachisiUnlocked();

  return (
    <div className="min-h-screen">
      <Boot />
      <HudBar back={{ href: "/scriptorium", label: t("nav.scriptorium", lang) }} />

      <main className="mx-auto max-w-[1100px] px-4 py-8">
        <header className="mb-6">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
            {lang === "hi" ? "भोर से पहले" : "Before dawn"}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">{t("pachisi.title", lang)}</h1>
          <p className="mt-3 max-w-[60ch] font-body text-sm leading-relaxed text-ink-soft">
            {lang === "hi"
              ? "पचीसी — कौड़ियों से खेला जाने वाला वह खेल जिसका उल्लेख महाभारत में है और जिसे अकबर ने फतेहपुर सीकरी के आँगन में जीवित आकार में खेला। दो गोटियाँ, छह कौड़ियाँ; कृपा-दान पर ही गोटी मैदान में आती है और आप फिर चलते हैं।"
              : "Pachisi — the cowrie game named in the Mahabharata, which Akbar is said to have played at life size in the courtyard at Fatehpur Sikri. Two pieces, six shells; a piece enters only on a grace throw, and a grace lets you play again."}
          </p>
        </header>

        {!hydrated ? (
          <p className="font-body text-sm text-ink-soft">…</p>
        ) : unlocked ? (
          <PachisiBoard />
        ) : (
          <div className="border border-ink/30 bg-leaf-deep/40 p-6">
            <p className="font-display text-lg text-ink">{t("pachisi.locked", lang)}</p>
            <div className="mt-4">
              <Link href="/scriptorium">
                <WaxButton>{t("nav.scriptorium", lang)}</WaxButton>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

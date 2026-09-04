"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type TargetAndTransition,
} from "framer-motion";
import { useGame, usePachisiUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { t } from "@/content/i18n";
import { Boot } from "@/components/chrome/Boot";
import { Reveal } from "@/components/chrome/Reveal";
import { WaxButton } from "@/components/chrome/WaxButton";
import { LampBundle } from "@/components/landing/LampBundle";

const INK_EASE = [0.16, 0.84, 0.44, 1] as const;

export function Landing() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const started = useGame(
    (s) => s.missions.triage.done || s.historyLog.length > 0 || s.rating !== 1000,
  );
  const unlocked = usePachisiUnlocked();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const leafY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const titleFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // when animation can't be relied on, start elements at their resting state
  const inFrom = (v: TargetAndTransition): TargetAndTransition | false =>
    reduce ? false : v;

  return (
    <div ref={ref} className="relative">
      <Boot />

      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="border border-ink/30 bg-leaf/80 px-3 py-1 font-display text-xs tracking-wide text-ink-soft backdrop-blur hover:text-ink"
        >
          {t("hud.lang", lang)}
        </button>
      </div>

      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
        <motion.div
          aria-hidden
          style={{ y: reduce ? 0 : leafY }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(27,23,18,0.10) 0px, rgba(27,23,18,0.10) 1px, transparent 1px, transparent 34px)",
              maskImage: "radial-gradient(120% 80% at 50% 40%, #000 30%, transparent 85%)",
            }}
          />
        </motion.div>

        <motion.div
          style={{ y: reduce ? 0 : titleY, opacity: reduce ? 1 : titleFade }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            initial={inFrom({ opacity: 0, y: 8 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: INK_EASE }}
            className="mb-6 font-deva text-lg tracking-[0.3em] text-hingula"
          >
            नालन्दा · ᬦᬮᬦ᭄ᬤ
          </motion.p>

          <motion.h1
            initial={inFrom({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="max-w-[16ch] text-balance font-display text-5xl leading-[1.05] text-ink sm:text-7xl"
          >
            {t("app.title", lang)}
          </motion.h1>

          <motion.div
            initial={inFrom({ scaleX: 0 })}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: INK_EASE }}
            className="my-8 h-px w-56 origin-center bg-ink/40"
          />

          <motion.p
            initial={inFrom({ opacity: 0, y: 10 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="max-w-[52ch] text-pretty font-body text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {t("app.tagline", lang)}
          </motion.p>

          <motion.div
            initial={inFrom({ opacity: 0, y: 12 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/scriptorium">
              <WaxButton>
                {hydrated && started ? t("app.continue", lang) : t("app.begin", lang)}
              </WaxButton>
            </Link>
            {hydrated && unlocked && (
              <Link href="/pachisi">
                <WaxButton tone="quiet">{t("nav.pachisi", lang)}</WaxButton>
              </Link>
            )}
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-3xl -translate-x-1/2">
          <LampBundle />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24 sm:py-36">
        {STANZAS[lang].map((line, i) => (
          <Reveal
            key={i}
            as="p"
            blur
            className="mb-10 border-l-2 border-hingula/30 pl-6 font-body text-xl leading-relaxed text-ink last:mb-0 sm:text-2xl"
          >
            {line}
          </Reveal>
        ))}

        <div className="mt-16 flex justify-center">
          <Link href="/scriptorium">
            <WaxButton>{t("app.begin", lang)}</WaxButton>
          </Link>
        </div>
      </section>
    </div>
  );
}

const STANZAS: Record<"en" | "hi", string[]> = {
  en: [
    "For seven hundred years this hall has copied what the world thought worth keeping — medicine and grammar, logic and the Middle Way, the words of teachers now a thousand miles east.",
    "Tonight a rider brought word from Odantapuri. The monasteries along the river are burning. You have until the third dawn.",
    "You cannot carry it all. Choose. Decipher. Send what you can down the northern road. What leaves these walls tonight is what the next age gets to read.",
  ],
  hi: [
    "सात सौ वर्षों से यह कक्ष वही उतारता आया है जिसे संसार ने बचाने योग्य समझा — चिकित्सा और व्याकरण, तर्क और मध्यम मार्ग, उन आचार्यों के शब्द जो अब हज़ार मील पूर्व में हैं।",
    "आज रात एक सवार ओदंतपुरी से समाचार लाया। नदी किनारे के मठ जल रहे हैं। तीसरी भोर तक का समय है।",
    "आप सब कुछ नहीं ले जा सकते। चुनिए। पढ़िए। जो भेज सकें, उत्तर की सड़क से भेजिए। आज रात इन दीवारों से जो बाहर जाएगा, वही अगला युग पढ़ पाएगा।",
  ],
};

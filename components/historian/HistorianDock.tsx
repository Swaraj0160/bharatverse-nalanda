"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { useGame, useDemoMode } from "@/lib/store";
import { useHistorian } from "@/lib/useHistorian";
import { t } from "@/content/i18n";
import { SourceChip } from "@/components/historian/SourceChip";
import { MandalaLoader } from "@/components/chrome/MandalaLoader";
import type { HistorianAnswer } from "@/lib/historian-types";

const SUGGESTED: Record<"en" | "hi", string[]> = {
  en: [
    "What was Nalanda?",
    "Did Bakhtiyar Khalji burn the library for months?",
    "How did any of the texts survive?",
    "Who came to Nalanda after the sack?",
    "Who won the 2011 Cricket World Cup?",
  ],
  hi: [
    "नालंदा क्या था?",
    "क्या बख़्तियार ख़िलजी ने पुस्तकालय महीनों जलाया?",
    "कोई ग्रंथ कैसे बचे?",
    "आक्रमण के बाद नालंदा कौन आया?",
    "2011 का क्रिकेट विश्व कप किसने जीता?",
  ],
};

function AnswerBody({ answer }: { answer: HistorianAnswer }) {
  let chipIndex = 0;
  return (
    <div
      className={clsx(
        "font-hand text-[15px] leading-relaxed",
        answer.inScope ? "text-ink" : "text-hingula",
      )}
    >
      {answer.segments.map((seg, i) => (
        <span key={i}>
          <span className={answer.inScope ? "writing-reveal" : ""}>{seg.text} </span>
          {seg.passageId && <SourceChip passageId={seg.passageId} index={chipIndex++} />}{" "}
        </span>
      ))}
      {answer.inScope && answer.citations.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-ink/15 pt-2 font-body text-[11px] text-ink-soft">
          <span className="mr-1 font-display">{t("hist.sources", "en")}:</span>
          {answer.citations.map((c, i) => (
            <SourceChip key={c} passageId={c} index={i} />
          ))}
        </div>
      )}
      <div className="mt-1 font-body text-[10px] uppercase tracking-widest text-ink/35">
        {answer.mode === "live" ? "grounded generation" : "cached · offline"}
      </div>
    </div>
  );
}

export function HistorianDock() {
  const lang = useGame((s) => s.lang);
  const log = useGame((s) => s.historyLog);
  const demo = useDemoMode();
  const { ask, pending } = useHistorian();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log.length, pending]);

  const submit = async () => {
    const q = text;
    setText("");
    await ask(q);
  };

  return (
    <section className="flex h-full flex-col border border-ink/25 bg-leaf">
      <div className="border-b border-ink/20 px-4 py-3">
        <h2 className="font-display text-lg text-ink">{t("hist.title", lang)}</h2>
        <p className="mt-0.5 font-body text-xs italic text-ink-soft">{t("hist.sub", lang)}</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {log.length === 0 && (
          <div className="space-y-2">
            <p className="font-body text-xs text-ink-soft">{t("hist.tryThese", lang)}:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED[lang].map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  data-hot
                  className="border border-ink/25 px-2 py-1 text-left font-body text-[12px] text-ink-soft hover:border-hingula/50 hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {log.map((entry) => (
          <div key={entry.id} className="space-y-1.5">
            <p className="ml-auto w-fit max-w-[85%] border border-ink/20 bg-leaf-deep/60 px-2.5 py-1 text-right font-body text-[13px] text-ink">
              {entry.q}
            </p>
            <AnswerBody answer={entry.answer} />
          </div>
        ))}

        <AnimatePresence>
          {pending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3"
            >
              <MandalaLoader label={t("hist.thinking", lang)} size={72} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="border-t border-ink/20 p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            placeholder={t("hist.placeholder", lang)}
            className="min-h-[3rem] flex-1 resize-none border border-ink/25 bg-leaf px-2 py-1.5 font-body text-sm text-ink placeholder:text-ink/40 focus:border-hingula/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || !text.trim()}
            className="shrink-0 border border-ink/40 bg-hingula px-3 py-2 font-display text-sm text-leaf disabled:opacity-40"
          >
            {t("hist.send", lang)}
          </button>
        </div>
        <p className="mt-1 font-body text-[10px] text-ink/40">
          {demo ? t("hud.demoOn", lang) : t("hud.liveOn", lang)}
        </p>
      </form>
    </section>
  );
}

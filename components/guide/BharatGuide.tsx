"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import { CORPUS_BY_ID } from "@/lib/ai/ground";
import type { HistorianAnswer } from "@/lib/historian-types";

/**
 * The Bharat Guide — a global, context-aware surface. It floats; it is never a
 * nav slot. It carries the current site + screen so it already knows what the
 * visitor is looking at, and it renders a source chip after every factual
 * segment. Out-of-scope questions come back with no chips and "No source, no
 * answer" — that is the point, so it is shown, not hidden.
 */

const SUGGEST: Record<string, Record<"en" | "hi", string[]>> = {
  konark: {
    en: [
      "Why is Konark shaped like a chariot?",
      "How do the wheels tell the time?",
      "When did the tower fall?",
      "Who won the 2011 Cricket World Cup?",
    ],
    hi: [
      "कोणार्क रथ जैसा क्यों है?",
      "पहिये समय कैसे बताते हैं?",
      "शिखर कब गिरा?",
      "2011 का क्रिकेट विश्व कप किसने जीता?",
    ],
  },
  nalanda: {
    en: [
      "What was taught at Nalanda?",
      "Did the library really burn for months?",
      "How did any texts survive?",
      "What is the population of Tokyo?",
    ],
    hi: [
      "नालंदा में क्या पढ़ाया जाता था?",
      "क्या पुस्तकालय सचमुच महीनों जला?",
      "कोई ग्रंथ कैसे बचे?",
      "टोक्यो की जनसंख्या कितनी है?",
    ],
  },
  ranikivav: {
    en: [
      "Why is a stepwell built downward?",
      "Who commissioned Rani ki Vav?",
      "Why did the carving survive so well?",
      "Who is the prime minister of Canada?",
    ],
    hi: [
      "बावड़ी नीचे की ओर क्यों बनती है?",
      "रानी की वाव किसने बनवाई?",
      "उत्कीर्णन इतना अच्छा क्यों बचा?",
      "कनाडा के प्रधानमंत्री कौन हैं?",
    ],
  },
};

export function BharatGuide({
  siteId,
  screen,
  focusedElement,
  defaultOpen = false,
}: {
  siteId?: string;
  screen?: string;
  focusedElement?: string;
  defaultOpen?: boolean;
}) {
  const lang = useGame((s) => s.lang);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [ans, setAns] = useState<HistorianAnswer | null>(null);
  const [provider, setProvider] = useState<"mock" | "gemini">("mock");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/guide")
      .then((r) => r.json())
      .then((d) => setProvider(d.provider === "gemini" ? "gemini" : "mock"))
      .catch(() => setProvider("mock"));
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const ask = async (query: string) => {
    if (!query.trim() || busy) return;
    setBusy(true);
    setAns(null);
    try {
      const r = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, lang, siteId, screen, focusedElement }),
      });
      setAns(await r.json());
    } catch {
      setAns({
        inScope: false,
        segments: [
          {
            text:
              lang === "hi"
                ? "अभी उत्तर नहीं ला सका। स्रोत नहीं, तो उत्तर नहीं।"
                : "I could not reach the sources just now. No source, no answer.",
          },
        ],
        citations: [],
        mode: "demo",
        litNodes: [],
      });
    } finally {
      setBusy(false);
    }
  };

  const suggestions = (siteId && SUGGEST[siteId]?.[lang]) || SUGGEST.nalanda[lang];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 border border-ink/40 bg-hingula px-4 py-2.5 font-display text-sm text-sandstone shadow-leaf transition-transform hover:-translate-y-0.5"
        >
          <span aria-hidden>◈</span>
          {lang === "hi" ? "भारत गाइड से पूछें" : "Ask the Bharat Guide"}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 z-50 flex max-h-[85vh] w-full flex-col border-l border-t border-stone-deep/40 bg-sandstone shadow-leaf sm:bottom-4 sm:right-4 sm:w-[380px] sm:border"
          >
            <div className="flex items-center gap-2 border-b border-stone-deep/25 px-4 py-2.5">
              <span className="font-display text-sm text-ink">
                {lang === "hi" ? "भारत गाइड" : "Bharat Guide"}
              </span>
              <span
                className={clsx(
                  "border px-1.5 py-0.5 font-body text-[10px] uppercase tracking-wide",
                  provider === "gemini"
                    ? "border-terreverte/50 text-terreverte"
                    : "border-stone-deep/40 text-stone-deep",
                )}
              >
                {provider === "gemini"
                  ? lang === "hi"
                    ? "सजीव"
                    : "Live"
                  : lang === "hi"
                    ? "संचित"
                    : "Grounded"}
              </span>
              {siteId && (
                <span className="font-body text-[11px] text-stone-deep">· {siteId}</span>
              )}
              <button
                onClick={() => setOpen(false)}
                className="ml-auto font-display text-lg text-ink-soft hover:text-ink"
                aria-label="close"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {!ans && !busy && (
                <div className="space-y-1.5">
                  <p className="font-body text-xs text-stone-deep">
                    {lang === "hi"
                      ? "हर तथ्य के साथ उसका स्रोत दिखता है। जो सत्यापित नहीं, उसका उत्तर नहीं।"
                      : "Every fact shows its source. What cannot be verified is not answered."}
                  </p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQ(s);
                        ask(s);
                      }}
                      className="block w-full border border-stone-deep/25 px-2.5 py-1.5 text-left font-body text-[13px] text-ink hover:border-hingula/50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {busy && (
                <p className="py-6 text-center font-body text-sm text-stone-deep">
                  <span className="mandala-spin inline-block">◈</span>
                </p>
              )}

              {ans && (
                <div>
                  <p
                    className={clsx(
                      "font-hand text-[15px] leading-relaxed",
                      ans.inScope ? "text-ink" : "text-hingula",
                    )}
                  >
                    {ans.segments.map((seg, i) => (
                      <span key={i}>
                        {seg.text}{" "}
                        {seg.passageId && CORPUS_BY_ID[seg.passageId] && (
                          <SourceChip id={seg.passageId} />
                        )}{" "}
                      </span>
                    ))}
                  </p>
                  {ans.inScope && ans.citations.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-stone-deep/20 pt-2">
                      {ans.citations.map((id) => {
                        const p = CORPUS_BY_ID[id];
                        if (!p) return null;
                        return (
                          <p key={id} className="font-body text-[11px] text-stone-deep">
                            <span className="font-display text-ink">{p.title}</span> —{" "}
                            {p.source}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {!ans.inScope && (
                    <p className="mt-3 border-t border-stone-deep/20 pt-2 font-body text-[11px] text-stone-deep">
                      {lang === "hi"
                        ? "कोई स्रोत उद्धृत नहीं — क्योंकि कोई मेल नहीं मिला।"
                        : "No sources cited — because nothing matched."}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setAns(null);
                      setQ("");
                    }}
                    className="mt-3 font-body text-[12px] text-hingula underline"
                  >
                    {lang === "hi" ? "एक और सवाल" : "Ask another"}
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(q);
              }}
              className="flex gap-2 border-t border-stone-deep/25 p-3"
            >
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={lang === "hi" ? "पूछिए…" : "Ask about this place…"}
                className="min-w-0 flex-1 border border-stone-deep/40 bg-sandstone/60 px-2.5 py-1.5 font-body text-sm text-ink outline-none focus:border-hingula"
              />
              <button
                type="submit"
                disabled={busy}
                className="border border-ink/40 bg-hingula px-3 py-1.5 font-display text-sm text-sandstone disabled:opacity-40"
              >
                {lang === "hi" ? "पूछें" : "Ask"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SourceChip({ id }: { id: string }) {
  const [show, setShow] = useState(false);
  const p = CORPUS_BY_ID[id];
  if (!p) return null;
  const short = p.title.length > 22 ? p.title.slice(0, 20) + "…" : p.title;
  return (
    <button
      onClick={() => setShow((s) => !s)}
      className="relative -translate-y-0.5 border border-terreverte/60 bg-terreverte/10 px-1 align-middle font-body text-[10px] text-terreverte"
    >
      {short}
      {show && (
        <span className="absolute bottom-full left-0 z-10 mb-1 w-56 border border-stone-deep/50 bg-sandstone p-2 text-left font-body text-[11px] leading-snug text-ink shadow-leaf">
          <span className="block font-display">{p.title}</span>
          {p.text}
          <span className="mt-1 block text-stone-deep">{p.source}</span>
        </span>
      )}
    </button>
  );
}

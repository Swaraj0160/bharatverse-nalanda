"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { COLOPHON_PAIRS, COLOPHON_FULL } from "@/content/missions";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";
import { sfx } from "@/lib/audio";
import { WaxButton } from "@/components/chrome/WaxButton";

function shuffle<T>(a: T[]): T[] {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

export function TranslateMission({ onDone }: { onDone: () => void }) {
  const lang = useGame((s) => s.lang);
  const done = useGame((s) => s.missions.translate);
  const complete = useGame((s) => s.completeTranslate);
  const discover = useGame((s) => s.discover);
  const score = useGame((s) => s.score);
  const earnSeal = useGame((s) => s.earnSeal);

  const terms = useMemo(() => shuffle(COLOPHON_PAIRS), []);
  const glosses = useMemo(() => shuffle(COLOPHON_PAIRS), []);

  const [sel, setSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const finished = matched.length === COLOPHON_PAIRS.length || done.done;

  const pickTerm = (id: string) => {
    if (matched.includes(id)) return;
    sfx("paper");
    setSel(id === sel ? null : id);
  };

  const pickGloss = (id: string) => {
    if (matched.includes(id) || !sel) return;
    if (sel === id) {
      sfx("ink");
      const next = [...matched, id];
      setMatched(next);
      setSel(null);
      if (next.length === COLOPHON_PAIRS.length) finish(next.length, mistakes);
    } else {
      sfx("seal");
      setWrong(id);
      setMistakes((m) => m + 1);
      setTimeout(() => setWrong(null), 360);
    }
  };

  const finish = (_n: number, m: number) => {
    discover(COLOPHON_FULL.passageIds);
    const outcome = Math.max(0.2, 1 - m * 0.15);
    score("translate", outcome);
    complete(Math.max(0, COLOPHON_PAIRS.length - m));
    if (m === 0) earnSeal("fragment");
  };

  return (
    <div>
      <p className="mb-4 font-body text-sm text-ink-soft">
        {lang === "hi"
          ? "पत्र के अंत की पुष्पिका। हर पद को उसके अर्थ से जोड़िए।"
          : "The closing colophon of the leaf. Join each phrase to its meaning."}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {terms.map((p) => (
            <button
              key={p.id}
              onClick={() => pickTerm(p.id)}
              data-hot
              disabled={finished}
              className={clsx(
                "block w-full border px-3 py-2 text-left font-deva text-[15px] transition-colors",
                matched.includes(p.id)
                  ? "border-terreverte/60 bg-terreverte/10 text-ink/60 line-through"
                  : sel === p.id
                    ? "border-hingula bg-hingula/10 text-ink"
                    : "border-ink/25 text-ink hover:border-ink/45",
              )}
            >
              {p.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {glosses.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => pickGloss(p.id)}
              data-hot
              disabled={finished}
              animate={wrong === p.id ? { x: [0, -6, 6, -4, 0] } : {}}
              transition={{ duration: 0.34 }}
              className={clsx(
                "block w-full border px-3 py-2 text-left font-body text-[13px] transition-colors",
                matched.includes(p.id)
                  ? "border-terreverte/60 bg-terreverte/10 text-ink/60"
                  : "border-ink/25 text-ink-soft hover:border-ink/45 hover:text-ink",
              )}
            >
              {p.gloss[lang]}
            </motion.button>
          ))}
        </div>
      </div>

      {finished && (
        <div className="mt-5 border-l-2 border-hingula/40 pl-4">
          <p className="font-body text-[14px] leading-relaxed text-ink">{COLOPHON_FULL[lang]}</p>
          <p className="mt-2 font-body text-xs text-ink-soft">
            {lang === "hi" ? "त्रुटियाँ" : "Mistakes"}: {mistakes}
          </p>
          <div className="mt-3">
            <WaxButton onClick={onDone}>{t("mission.done", lang)}</WaxButton>
          </div>
        </div>
      )}
    </div>
  );
}

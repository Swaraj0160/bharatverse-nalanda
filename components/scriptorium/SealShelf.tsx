"use client";

import { useGame } from "@/lib/store";
import { SealBadge } from "@/components/chrome/SealBadge";

export const SEALS: { id: string; glyph: string; label: { en: string; hi: string } }[] = [
  { id: "healer", glyph: "☙", label: { en: "Saved the healer's hand", hi: "वैद्य का हाथ बचाया" } },
  { id: "chest", glyph: "⚷", label: { en: "Opened the locked chest", hi: "बंद संदूक खोला" } },
  { id: "fragment", glyph: "✒", label: { en: "Read the fragment whole", hi: "खंडित पत्र पूरा पढ़ा" } },
  { id: "refusal", glyph: "∅", label: { en: "Asked what cannot be known", hi: "अज्ञेय पूछा" } },
  { id: "tibet", glyph: "⛰", label: { en: "Sent word north to Tibet", hi: "तिब्बत की ओर भेजा" } },
  { id: "keeper", glyph: "❖", label: { en: "Keeper of the Dharmaganja", hi: "धर्मगंज का रक्षक" } },
];

export function SealShelf() {
  const seals = useGame((s) => s.seals);
  const lang = useGame((s) => s.lang);
  return (
    <div className="mt-16 border-t border-ink/20 pt-8">
      <h3 className="mb-5 font-display text-lg text-ink">
        {lang === "hi" ? "अंकित मुहरें" : "Seals pressed"}
      </h3>
      <div className="flex flex-wrap gap-6">
        {SEALS.map((s) => (
          <SealBadge key={s.id} glyph={s.glyph} label={s.label[lang]} earned={!!seals[s.id]} />
        ))}
      </div>
    </div>
  );
}

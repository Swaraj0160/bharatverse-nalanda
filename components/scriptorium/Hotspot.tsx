"use client";

import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";

export function Hotspot({
  label,
  kind,
  done,
  onOpen,
}: {
  label: string;
  kind: "mission" | "lore";
  done?: boolean;
  onOpen: () => void;
}) {
  const lang = useGame((s) => s.lang);
  return (
    <button
      onClick={onOpen}
      data-hot
      className="group mt-4 inline-flex items-center gap-3 border border-ink/25 bg-leaf-deep/40 py-2 pl-2 pr-4 text-left transition-colors hover:border-hingula/50"
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center">
        {!done && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-hingula/50"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span
          className={clsx(
            "grid h-9 w-9 place-items-center rounded-full border-2 font-display text-sm",
            done
              ? "border-terreverte/60 bg-terreverte/15 text-terreverte"
              : "border-hingula bg-hingula/10 text-hingula",
          )}
        >
          {done ? "✓" : kind === "mission" ? "✎" : "✦"}
        </span>
      </span>
      <span>
        <span className="block font-display text-[15px] text-ink group-hover:text-hingula">
          {label}
        </span>
        <span className="block font-body text-[11px] uppercase tracking-widest text-ink-soft">
          {done
            ? t("mission.done", lang)
            : kind === "mission"
              ? t("mission.begin", lang)
              : lang === "hi"
                ? "पढ़ें"
                : "Examine"}
        </span>
      </span>
    </button>
  );
}

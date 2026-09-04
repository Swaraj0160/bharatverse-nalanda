"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

/** A pressed wax seal — used for achievements, never a generic "badge". */
export function SealBadge({
  label,
  glyph,
  earned,
  className,
}: {
  label: string;
  glyph: string;
  earned: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={clsx("flex flex-col items-center gap-1.5 text-center", className)}
      initial={false}
    >
      <motion.div
        className={clsx(
          "relative grid h-16 w-16 place-items-center rounded-full border-2 font-display text-2xl",
          earned
            ? "border-ink/50 bg-hingula text-leaf"
            : "border-ink/15 bg-leaf-deep/60 text-ink/25",
        )}
        animate={
          earned
            ? { scale: [0.6, 1.08, 1], rotate: [-14, 3, 0], opacity: 1 }
            : { opacity: 0.6 }
        }
        transition={{ duration: 0.55, ease: [0.16, 0.84, 0.44, 1] }}
      >
        <span aria-hidden>{glyph}</span>
        {earned && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full ring-1 ring-inset ring-leaf/40"
          />
        )}
      </motion.div>
      <span
        className={clsx(
          "max-w-[9rem] text-[11px] leading-tight",
          earned ? "text-ink-soft" : "text-ink/30",
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}

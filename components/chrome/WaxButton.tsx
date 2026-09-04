"use client";

import { clsx } from "clsx";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"button"> & {
  children: ReactNode;
  tone?: "seal" | "quiet" | "leaf";
};

/** A pressable wax-seal button. Press = a stamp-down, not a spring bounce. */
export function WaxButton({ children, tone = "seal", className, ...rest }: Props) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.94, y: 1 }}
      transition={{ duration: 0.16, ease: [0.16, 0.84, 0.44, 1] }}
      className={clsx(
        "relative inline-flex select-none items-center gap-2 px-5 py-2.5 font-display text-sm tracking-wide",
        "border transition-colors duration-200",
        tone === "seal" &&
          "border-ink/40 bg-hingula text-leaf shadow-[0_6px_0_-2px_rgba(27,23,18,0.35)] hover:bg-redochre",
        tone === "leaf" &&
          "border-ink/30 bg-leaf-deep text-ink hover:bg-tala/70",
        tone === "quiet" &&
          "border-ink/25 bg-transparent text-ink-soft hover:text-ink hover:border-ink/50",
        "before:absolute before:inset-0 before:-z-10 before:translate-x-1 before:translate-y-1 before:border before:border-ink/15",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";

export function MissionOverlay({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const lang = useGame((s) => s.lang);
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: -78, y: -30, scaleY: 0.8 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, rotateX: reduce ? 0 : -60, y: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.16, 0.84, 0.44, 1] }}
            style={{ transformOrigin: "top center", transformPerspective: 1200 }}
            className="relative z-10 max-h-[86vh] w-full max-w-2xl overflow-y-auto border border-ink/40 bg-leaf shadow-leaf"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/20 bg-leaf px-5 py-4">
              <div>
                <h2 className="font-display text-2xl text-ink">{title}</h2>
                {subtitle && (
                  <p className="mt-1 max-w-[52ch] font-body text-sm italic text-ink-soft">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 border border-ink/30 px-3 py-1 font-display text-xs text-ink-soft hover:text-ink"
              >
                {t("mission.close", lang)}
              </button>
            </div>
            <div className="px-5 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

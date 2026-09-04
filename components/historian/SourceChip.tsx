"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PASSAGE_BY_ID } from "@/content/passages";
import { NODE_BY_ID } from "@/content/graph";
import { sfx } from "@/lib/audio";

export function SourceChip({ passageId, index }: { passageId: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const p = PASSAGE_BY_ID[passageId];
  if (!p) return null;

  return (
    <span className="relative inline-block align-baseline">
      <button
        onClick={() => {
          setOpen((v) => !v);
          sfx("paper");
        }}
        data-hot
        className="mx-0.5 inline-flex -translate-y-0.5 items-center gap-1 border border-hingula/50 bg-hingula/10 px-1.5 py-px font-display text-[10px] leading-none text-hingula transition-colors hover:bg-hingula/20"
        title={p.source}
      >
        <span className="tabular-nums">{index + 1}</span>
        <span className="max-w-[12ch] truncate">{p.title}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: -85, y: -6 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: reduce ? 0 : -85, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.32, ease: [0.16, 0.84, 0.44, 1] }}
            style={{ transformOrigin: "top center", transformPerspective: 700 }}
            className="absolute left-0 top-[calc(100%+6px)] z-30 block w-72 border border-ink/30 bg-leaf p-3 text-left shadow-leaf"
          >
            <span className="mb-1 block font-display text-xs text-ink">{p.title}</span>
            <span className="block font-body text-[13px] leading-snug text-ink-soft">
              {p.text}
            </span>
            <span className="mt-2 block border-t border-ink/15 pt-1.5 font-body text-[11px] italic text-ink/60">
              {p.source}
            </span>
            {p.nodes.length > 0 && (
              <span className="mt-1.5 flex flex-wrap gap-1">
                {p.nodes.map((n) => (
                  <span
                    key={n}
                    className="border border-ink/20 px-1 py-px font-display text-[9px] text-ink-soft"
                  >
                    {NODE_BY_ID[n]?.label ?? n}
                  </span>
                ))}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

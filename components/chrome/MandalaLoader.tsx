"use client";

import { motion } from "framer-motion";

/** A mandala that draws itself open — used for every transition/loading state. */
export function MandalaLoader({
  label = "unrolling the manuscript",
  size = 120,
}: {
  label?: string;
  size?: number;
}) {
  const petals = Array.from({ length: 8 });
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        initial="hidden"
        animate="shown"
        className="text-ink"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.1, ease: [0.7, 0, 0.2, 1], repeat: Infinity, repeatType: "reverse" },
            },
          }}
        />
        {petals.map((_, i) => (
          <motion.path
            key={i}
            d="M50 16 C58 30 58 40 50 50 C42 40 42 30 50 16 Z"
            fill="none"
            stroke={i % 2 ? "var(--hingula)" : "currentColor"}
            strokeWidth="1"
            transform={`rotate(${i * 45} 50 50)`}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              shown: {
                pathLength: 1,
                opacity: 0.85,
                transition: {
                  duration: 0.9,
                  delay: 0.06 * i,
                  ease: [0.16, 0.84, 0.44, 1],
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.4,
                },
              },
            }}
          />
        ))}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="var(--hingula)"
          variants={{
            hidden: { scale: 0 },
            shown: { scale: 1, transition: { delay: 0.5, type: "spring", stiffness: 200 } },
          }}
        />
      </motion.svg>
      <p className="font-hand text-sm tracking-wide text-ink-soft">{label}…</p>
    </div>
  );
}

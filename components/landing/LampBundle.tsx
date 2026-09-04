"use client";

import { motion } from "framer-motion";

/** Line-art: a hanging oil lamp over three tied palm-leaf bundles on a desk. */
export function LampBundle() {
  return (
    <svg
      viewBox="0 0 760 260"
      className="w-full text-ink"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      {/* hanging cord + lamp */}
      <line x1="380" y1="0" x2="380" y2="54" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M352 54 q28 26 56 0 q-6 18 -28 18 q-22 0 -28 -18Z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="var(--tala)"
        fillOpacity="0.5"
      />
      <path d="M404 60 q16 2 20 12" stroke="currentColor" strokeWidth="1.4" />
      <motion.path
        d="M424 70 q10 -18 0 -30 q-4 12 -12 12 q10 6 12 18Z"
        fill="var(--hingula)"
        animate={{ opacity: [0.85, 1, 0.7, 0.95], scaleY: [1, 1.08, 0.94, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "424px 70px" }}
      />

      {/* desk */}
      <line x1="60" y1="212" x2="700" y2="212" stroke="currentColor" strokeWidth="1.6" />
      <line x1="96" y1="212" x2="120" y2="252" stroke="currentColor" strokeWidth="1.4" />
      <line x1="664" y1="212" x2="640" y2="252" stroke="currentColor" strokeWidth="1.4" />

      {/* three palm-leaf bundles */}
      {[
        { x: 150, w: 150, tilt: -3 },
        { x: 320, w: 170, tilt: 1 },
        { x: 510, w: 140, tilt: 4 },
      ].map((b, i) => (
        <g key={i} transform={`rotate(${b.tilt} ${b.x + b.w / 2} 196)`}>
          <rect
            x={b.x}
            y={172}
            width={b.w}
            height={40}
            rx={3}
            fill="var(--leaf-deep)"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          {[0.28, 0.5, 0.72].map((f, j) => (
            <line
              key={j}
              x1={b.x}
              y1={172 + b.w * 0 + 40 * f}
              x2={b.x + b.w}
              y2={172 + 40 * f}
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          ))}
          {/* binding cord */}
          <rect
            x={b.x + b.w * 0.5 - 8}
            y={168}
            width={16}
            height={48}
            fill="var(--hingula)"
            fillOpacity="0.85"
          />
          <circle cx={b.x + b.w * 0.5} cy={192} r={4} fill="var(--ink)" />
        </g>
      ))}

      {/* a single loose leaf with a stylus */}
      <rect x={224} y={150} width={150} height={18} rx={2} fill="var(--leaf)" stroke="currentColor" strokeWidth="1.2" transform="rotate(-4 299 159)" />
      <line x1={360} y1={132} x2={392} y2={150} stroke="currentColor" strokeWidth="2" />
      <circle cx={393} cy={151} r={2.6} fill="var(--hingula)" />
    </svg>
  );
}

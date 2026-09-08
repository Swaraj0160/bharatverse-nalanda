"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import {
  spokes,
  minutesToAngle,
  pt,
  fmt,
  TOTAL_BEADS,
  MINUTES_PER_MAJOR,
} from "@/lib/konark";

/**
 * An authored SVG rendering of a Konark chariot wheel, drawn from the real
 * proportions: eight major spokes, eight minor spokes at the midpoints, and a
 * beaded rim of 480 beads (30 per half-sector).
 *
 * The bead ring is a single stroked circle with a dash pattern rather than 480
 * elements — perfectly even spacing, one node in the DOM.
 *
 * Deliberately SVG, not WebGL: the game must run on any device, offline, with
 * no GPU. The 3D wheel lives in the Lens.
 */

const VB = 500;
const C = VB / 2;
const R_RIM_OUT = 190;
const R_RIM_IN = 168;
const R_BEAD = 182;
const R_SPOKE_OUT = 166;
const R_HUB = 34;

export type Scaffold = "major" | "all" | "none";

export function SundialWheel({
  minutes,
  scaffold = "major",
  reading,
  hideShadow = false,
  className,
  onPickAngle,
}: {
  /** true time the gnomon shadow shows */
  minutes: number;
  scaffold?: Scaffold;
  /** the player's current stated reading, in minutes */
  reading?: number;
  hideShadow?: boolean;
  className?: string;
  onPickAngle?: (minutes: number) => void;
}) {
  const sp = useMemo(() => spokes(), []);
  const shadowAngle = minutesToAngle(minutes);
  const beadCirc = 2 * Math.PI * R_BEAD;
  const beadStep = beadCirc / TOTAL_BEADS;

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className={clsx("block h-auto w-full select-none", className)}
      role="img"
      aria-label={`Konark sundial wheel, shadow at ${fmt(minutes)}`}
    >
      <defs>
        <radialGradient id="k-stone" cx="42%" cy="34%">
          <stop offset="0%" stopColor="#C9AE84" />
          <stop offset="62%" stopColor="#B2966E" />
          <stop offset="100%" stopColor="#8C7355" />
        </radialGradient>
        <filter id="k-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.25, 0 0 0 0 0.19, 0 0 0 0 0.12, 0 0 0 0.16 0"
            result="g"
          />
          <feComposite in="g" in2="SourceGraphic" operator="atop" />
        </filter>
        <linearGradient id="k-shadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1B1712" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#1B1712" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* stone disc */}
      <circle cx={C} cy={C} r={R_RIM_OUT} fill="url(#k-stone)" filter="url(#k-grain)" />
      <circle cx={C} cy={C} r={R_RIM_OUT} fill="none" stroke="#5E4B33" strokeWidth="3" />
      <circle cx={C} cy={C} r={R_RIM_IN} fill="none" stroke="#5E4B33" strokeWidth="2" opacity="0.7" />

      {/* the beaded rim — 480 beads as one dashed circle */}
      <circle
        cx={C}
        cy={C}
        r={R_BEAD}
        fill="none"
        stroke="#4A3B26"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(beadStep * 0.42).toFixed(3)} ${(beadStep * 0.58).toFixed(3)}`}
        opacity="0.85"
      />

      {/* spokes */}
      {sp.map((s) => {
        const w = s.major ? 11 : 5;
        const [x1, y1] = pt(C, C, R_HUB - 2, s.angle);
        const [x2, y2] = pt(C, C, R_SPOKE_OUT, s.angle);
        return (
          <g key={s.index}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6B573C"
              strokeWidth={w + 4}
              strokeLinecap="round"
              opacity="0.55"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#A98A5F"
              strokeWidth={w}
              strokeLinecap="round"
            />
            {/* medallion on major spokes — the instrument is also sculpture */}
            {s.major && (
              <circle
                {...(() => {
                  const [mx, my] = pt(C, C, R_SPOKE_OUT * 0.62, s.angle);
                  return { cx: mx, cy: my };
                })()}
                r="9"
                fill="#8C7355"
                stroke="#5E4B33"
                strokeWidth="1.5"
              />
            )}
          </g>
        );
      })}

      {/* hour labels — scaffolding that fades out as levels rise */}
      {scaffold !== "none" &&
        sp
          .filter((s) => (scaffold === "all" ? true : s.major))
          .map((s) => {
            const [lx, ly] = pt(C, C, R_RIM_OUT + 22, s.angle);
            return (
              <text
                key={`l${s.index}`}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-display"
                fontSize={s.major ? 15 : 11}
                fill={s.major ? "#B23A2E" : "#6B573C"}
              >
                {fmt(s.minutes)}
              </text>
            );
          })}

      {/* the shadow cast by the axle gnomon */}
      {!hideShadow && (
        <g transform={`rotate(${shadowAngle} ${C} ${C})`}>
          <path
            d={`M ${C} ${C - 9} L ${C + R_SPOKE_OUT + 12} ${C - 3} L ${C + R_SPOKE_OUT + 12} ${C + 3} L ${C} ${C + 9} Z`}
            fill="url(#k-shadow)"
          />
        </g>
      )}

      {/* the player's stated reading */}
      {reading != null && (
        <g transform={`rotate(${minutesToAngle(reading)} ${C} ${C})`}>
          <line
            x1={C + R_HUB}
            y1={C}
            x2={C + R_RIM_OUT + 6}
            y2={C}
            stroke="#B23A2E"
            strokeWidth="2.5"
            strokeDasharray="7 5"
          />
          <circle cx={C + R_RIM_OUT + 6} cy={C} r="5" fill="#B23A2E" />
        </g>
      )}

      {/* hub + gnomon */}
      <circle cx={C} cy={C} r={R_HUB} fill="#9E8259" stroke="#5E4B33" strokeWidth="3" />
      <circle cx={C} cy={C} r={R_HUB * 0.55} fill="#7A6244" stroke="#5E4B33" strokeWidth="2" />
      <circle cx={C} cy={C} r="7" fill="#D9A63F" stroke="#5E4B33" strokeWidth="2" />

      {/* invisible scrub ring */}
      {onPickAngle && (
        <circle
          cx={C}
          cy={C}
          r={R_RIM_OUT}
          fill="transparent"
          className="cursor-crosshair"
          onPointerDown={(e) => {
            const svg = e.currentTarget.ownerSVGElement;
            if (!svg) return;
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * VB - C;
            const y = ((e.clientY - rect.top) / rect.height) * VB - C;
            const deg = (Math.atan2(y, x) * 180) / Math.PI;
            const mins = ((-90 - deg) / (360 / 1440) + 1440) % 1440;
            onPickAngle(mins);
          }}
        />
      )}
    </svg>
  );
}

export const SECTOR_MINUTES = MINUTES_PER_MAJOR;

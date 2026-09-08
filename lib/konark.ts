/**
 * The Konark sundial — geometry and the time relation.
 *
 * Sourced reading procedure (see content/heritage.ts → k-sundial / k-beads /
 * k-anticlockwise):
 *   · 8 MAJOR spokes            → 24h / 8   = 3 h apart
 *   · 8 MINOR spokes at midpoints → 1 h 30 m from each neighbour
 *   · 30 BEADS between a minor and a major spoke → 3 min per bead
 *   · beads elongated into sub-zones → ~1 min resolution
 *   · read ANTICLOCKWISE; the top-centre major spoke is 12 midnight
 *
 * Everything below derives from those five facts, so the game cannot drift from
 * the monument.
 */

export const MAJOR_SPOKES = 8;
export const MINOR_SPOKES = 8;
export const HOURS_PER_MAJOR = 24 / MAJOR_SPOKES; // 3
export const MINUTES_PER_MAJOR = HOURS_PER_MAJOR * 60; // 180
export const BEADS_PER_HALF_SECTOR = 30;
export const MINUTES_PER_BEAD = MINUTES_PER_MAJOR / 2 / BEADS_PER_HALF_SECTOR; // 3
/** 16 half-sectors around the wheel, 30 beads each */
export const TOTAL_BEADS = MINOR_SPOKES * 2 * BEADS_PER_HALF_SECTOR; // 480
export const DEGREES_PER_MINUTE = 360 / (24 * 60); // 0.25

/**
 * Minutes-since-midnight → angle in SVG screen space (degrees, clockwise from
 * +x axis, y down — i.e. what an SVG rotate() wants).
 *
 * Top-centre is midnight and the dial runs anticlockwise on the wheel face. In
 * SVG's y-down space, "up" is -90deg and visual anticlockwise is *decreasing*
 * degrees, so the mapping is: -90 - (minutes * 0.25).
 */
export function minutesToAngle(minutes: number): number {
  return -90 - ((minutes % 1440) * DEGREES_PER_MINUTE);
}

/** Inverse of minutesToAngle, normalised to [0, 1440). */
export function angleToMinutes(angleDeg: number): number {
  const m = ((-90 - angleDeg) / DEGREES_PER_MINUTE) % 1440;
  return (m + 1440) % 1440;
}

export const fmt = (minutes: number): string => {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** Point on a circle, SVG space (y down), for a given angle in degrees. */
export function pt(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export type SpokeDef = { index: number; major: boolean; angle: number; minutes: number };

/** All 16 spokes with their angle and the time each one marks. */
export function spokes(): SpokeDef[] {
  const out: SpokeDef[] = [];
  for (let i = 0; i < MAJOR_SPOKES * 2; i++) {
    const minutes = i * (MINUTES_PER_MAJOR / 2); // every 90 min
    out.push({
      index: i,
      major: i % 2 === 0,
      angle: minutesToAngle(minutes),
      minutes,
    });
  }
  return out;
}

/** Bead centres around the rim, one every 3 minutes. */
export function beads(): { angle: number; minutes: number }[] {
  const out = [];
  for (let i = 0; i < TOTAL_BEADS; i++) {
    const minutes = i * MINUTES_PER_BEAD;
    out.push({ angle: minutesToAngle(minutes), minutes });
  }
  return out;
}

/** Signed shortest difference between two clock times, in minutes. */
export function clockDelta(a: number, b: number): number {
  let d = (a - b) % 1440;
  if (d > 720) d -= 1440;
  if (d < -720) d += 1440;
  return d;
}

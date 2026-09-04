import type { LevelResult } from "@/lib/games/types";

/** Elo outcome in [0,1] from a star rating — feeds lib/elo.ts updateRating. */
export function outcomeFromStars(stars: 0 | 1 | 2 | 3): number {
  return [0.2, 0.55, 0.8, 1][stars];
}

/** XP awarded for a run. First clear of a level pays a one-time bonus. */
export function xpForResult(result: LevelResult, firstClear: boolean): number {
  if (!result.cleared) return 5;
  return 40 * result.stars + (firstClear ? 30 : 0) + 10;
}

/**
 * Generic star award for time/accuracy games. `thresholds` are the score needed
 * for 1/2/3 stars (ascending). Games with bespoke conditions can ignore this.
 */
export function starsFromScore(
  score: number,
  thresholds: [number, number, number],
): 0 | 1 | 2 | 3 {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

export const XP_PER_RANK = 400;

/** Cosmetic level from total XP (distinct from the Elo Scribe's Rank). */
export function xpLevel(xp: number): number {
  return 1 + Math.floor(xp / XP_PER_RANK);
}
export function xpIntoLevel(xp: number): { into: number; span: number } {
  return { into: xp % XP_PER_RANK, span: XP_PER_RANK };
}

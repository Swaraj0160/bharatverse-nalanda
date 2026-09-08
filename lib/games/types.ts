/**
 * Phase 2 campaign model. A "level" is one playable node on the world map.
 * Games are skill-based; a run produces a LevelResult that awards 0–3 stars and
 * XP, which is fed through the existing Elo model (lib/elo.ts).
 */

export type GameId =
  | "sorting" // Triage → The Sorting
  | "reconstruction" // The Fragment → The Reconstruction
  | "road" // The Courier → The Road
  | "shadow" // Shadow & Stone (Konark sundial)
  | "rebuild" // Rebuild India
  | "ashtapada"
  | "gillidanda" // → The Strike
  | "capstone"; // The Library Restored

export type LevelResult = {
  /** true if the level's win condition was met at all */
  cleared: boolean;
  stars: 0 | 1 | 2 | 3;
  /** raw in-game score, game-specific units */
  score: number;
  timeMs: number;
  mistakes: number;
  /** optional game-specific payload the mission wants to persist */
  meta?: Record<string, unknown>;
};

export type LevelDef = {
  id: string; // stable, e.g. "sorting-1"
  game: GameId;
  index: number; // 1-based level number within its game
  arc: string; // grouping on the world map, e.g. "The Night's Work"
  title: { en: string; hi: string };
  blurb: { en: string; hi: string };
  /** ids of levels that must be cleared (>=1 star) before this unlocks */
  requires: string[];
  /** map coordinates on the 0..100 campaign map viewBox */
  x: number;
  y: number;
  /** opponent rating for the Elo update on completion */
  rating: number;
  /** whether the game is actually implemented yet (false → shows "coming soon") */
  playable: boolean;
  /** free-form tuning the game component reads (timer, grid size, decoys, …) */
  params: Record<string, number | string | boolean>;
};

export type CampaignEntry = {
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
  bestTimeMs: number;
  cleared: boolean;
  plays: number;
};

export const EMPTY_ENTRY: CampaignEntry = {
  stars: 0,
  bestScore: 0,
  bestTimeMs: 0,
  cleared: false,
  plays: 0,
};

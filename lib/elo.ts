/**
 * A small Elo-style mastery model. The player has a rating; each mission (and
 * each Historian exchange) is an "opponent" with a fixed rating. Outcome in
 * [0,1] nudges the player's rating. Rank generosity of hints keys off this.
 */

export const START_RATING = 1000;
const K = 32;

export function expectedScore(player: number, opponent: number): number {
  return 1 / (1 + 10 ** ((opponent - player) / 400));
}

export function updateRating(
  player: number,
  opponent: number,
  outcome: number, // 1 win / 0.5 draw / 0 loss (partials allowed)
): number {
  const next = player + K * (outcome - expectedScore(player, opponent));
  return Math.round(Math.max(600, Math.min(1600, next)));
}

export const MISSION_RATING: Record<string, number> = {
  triage: 1000,
  translate: 1120,
  courier: 1060,
  historian_in_scope: 990,
  historian_probe: 1080, // asking something that (correctly) gets refused = curiosity, small credit
  pachisi: 1040,
};

export type RankTier = {
  min: number;
  title: { en: string; hi: string };
};

export const RANK_TIERS: RankTier[] = [
  { min: 0, title: { en: "Novice Copyist", hi: "नवसिखुआ प्रतिलिपिक" } },
  { min: 960, title: { en: "Junior Scribe", hi: "कनिष्ठ लिपिक" } },
  { min: 1060, title: { en: "Hall Scribe", hi: "कक्ष लिपिक" } },
  { min: 1160, title: { en: "Keeper of the Dharmaganja", hi: "धर्मगंज का रक्षक" } },
];

export function rankTier(rating: number): RankTier {
  let tier = RANK_TIERS[0];
  for (const t of RANK_TIERS) if (rating >= t.min) tier = t;
  return tier;
}

/** More generous hints when the player is behind the mission's difficulty. */
export function hintGenerosity(rating: number, missionRating: number): "full" | "some" | "spare" {
  const gap = rating - missionRating;
  if (gap < -60) return "full";
  if (gap < 60) return "some";
  return "spare";
}

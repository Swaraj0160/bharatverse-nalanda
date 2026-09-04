/**
 * Maps for "The Road". Hand-authored grids — legend:
 *   .  road (move cost 1)      ,  rough (cost 2)
 *   f  forest (cost 2, hides you, blocks line of sight)
 *   #  ridge (impassable, blocks line of sight)
 *   ~  river (impassable)      =  ford (crossing ends your turn)
 *   S  start                   X  the safe monastery (exit)
 *
 * Patrol routes ping-pong along their waypoint list; the NEXT step and the
 * squares it will watch are always shown before you commit — nothing is hidden.
 */

export type RoadMap = {
  grid: string[];
  patrols: { route: [number, number][]; sight: number; start?: number }[];
  /** turns you're expected to need — beats this for 3 stars */
  par: number;
  weatherTurn?: number;
  weatherDur?: number;
  shrinkStart?: number;
  shrinkEvery?: number;
};

export const ROAD_MAPS: Record<string, RoadMap> = {
  "road-1": {
    // 7 wide x 9 tall — north to the passes, one watch pacing the open corridor
    grid: [
      "..f.X..",
      "..f.f..",
      ".......",
      ".#####.",
      ".......",
      "..f.f..",
      ".f...f.",
      "...f...",
      "...S...",
    ],
    patrols: [{ route: [[1, 4], [5, 4]], sight: 2 }],
    par: 12,
  },

  "road-2": {
    // 9 wide x 11 tall — the great road west, a river with two fords,
    // a short exposed lane vs a long covered one
    grid: [
      "....X....",
      ".f.....f.",
      ".f..#..f.",
      "....#....",
      "~~=~~~=~~",
      ".........",
      ".f.###.f.",
      ".f.....f.",
      "....,....",
      ".f.....f.",
      "....S....",
    ],
    patrols: [
      { route: [[1, 5], [7, 5]], sight: 2 },
      { route: [[4, 1], [4, 3], [4, 0]], sight: 2 },
    ],
    par: 18,
  },

  "road-3": {
    // 11 wide x 12 tall — three watches closing, and the safe ground shrinks
    grid: [
      ".....X.....",
      ".f.f...f.f.",
      "...#...#...",
      ".....f.....",
      ".#.......#.",
      "...=.....=.",
      "~~~~~.~~~~~",
      ".....=.....",
      ".f.#...#.f.",
      "...f...f...",
      ".f.......f.",
      ".....S.....",
    ],
    patrols: [
      { route: [[1, 3], [9, 3]], sight: 2 },
      { route: [[1, 8], [9, 8]], sight: 2 },
      { route: [[5, 1], [5, 5], [5, 10]], sight: 3 },
    ],
    par: 24,
    weatherTurn: 6,
    weatherDur: 3,
    shrinkStart: 5,
    shrinkEvery: 3,
  },
};

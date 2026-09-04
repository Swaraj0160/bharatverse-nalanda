/**
 * Pachisi — a faithful-in-spirit engine. Two tokens a side, six cowrie shells,
 * grace throws to enter and to play again, capture on shared squares, exact
 * throw to bring a token home. Board geometry is the classic cross (15x15 grid).
 */

export type Player = "you" | "ai";

export type PEventKind = "enter" | "move" | "capture" | "home" | "grace" | "pass" | "win";
export type PEvent = { kind: PEventKind; by: Player; detail?: string };

export type PState = {
  turn: Player;
  tokens: Record<Player, number[]>; // each 0..57  (0 = in the tray, 57 = home centre)
  faces: boolean[] | null; // last cowrie throw, true = mouth up
  value: number | null; // steps from the throw
  grace: boolean;
  throwsThisTurn: number;
  awaitingMove: boolean;
  winner: Player | null;
  difficulty: 1 | 2;
  log: PEvent[];
};

export const FINISH = 57;

/* 52-cell outer ring, clockwise, as [col,row] on a 15x15 grid. */
export const LOOP: [number, number][] = [
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0],
  [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7],
  [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14],
  [6, 14], [6, 13], [6, 12], [6, 11], [6, 10], [6, 9],
  [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7],
  [0, 6],
];

const ENTRY: Record<Player, number> = { you: 0, ai: 26 };

export const HOME_COL: Record<Player, [number, number][]> = {
  you: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  ai: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
};

/** entry cells + the four "star" squares — capture-proof. */
export const SAFE_RING = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

/** Grid cell for a token position, or null if in tray / at centre. */
export function cellFor(player: Player, pos: number): [number, number] | null {
  if (pos <= 0 || pos >= FINISH) return null;
  if (pos <= 51) return LOOP[(ENTRY[player] + pos - 1) % 52];
  return HOME_COL[player][pos - 52];
}

function ringIndex(player: Player, pos: number): number | null {
  if (pos < 1 || pos > 51) return null;
  return (ENTRY[player] + pos - 1) % 52;
}

export function newGame(difficulty: 1 | 2): PState {
  return {
    turn: "you",
    tokens: { you: [0, 0], ai: [0, 0] },
    faces: null,
    value: null,
    grace: false,
    throwsThisTurn: 0,
    awaitingMove: false,
    winner: null,
    difficulty,
    log: [],
  };
}

export function rollCowries(): { faces: boolean[]; value: number; grace: boolean } {
  const faces = Array.from({ length: 6 }, () => Math.random() < 0.5);
  const up = faces.filter(Boolean).length;
  let value: number;
  if (up === 0) value = 8;
  else if (up === 1) value = 10;
  else if (up === 6) value = 12;
  else value = up;
  const grace = value === 8 || value === 10 || value === 12;
  return { faces, value, grace };
}

export type Move = {
  token: number;
  from: number;
  to: number;
  enter: boolean;
  capture: boolean;
  captured?: { player: Player; token: number };
};

export function legalMoves(s: PState, player: Player = s.turn): Move[] {
  if (s.value == null) return [];
  const v = s.value;
  const mine = s.tokens[player];
  const opp: Player = player === "you" ? "ai" : "you";
  const moves: Move[] = [];

  mine.forEach((pos, token) => {
    if (pos === 0) {
      // A token enters on any throw (grace still grants the extra turn). This
      // keeps pieces moving from the first cast — closer to chaupar house rules
      // than to strict Pachisi, and far better for a short demo.
      const to = 1;
      const ri = ringIndex(player, to)!;
      let capture = false;
      let captured: Move["captured"];
      if (!SAFE_RING.has(ri)) {
        s.tokens[opp].forEach((op, oi) => {
          if (ringIndex(opp, op) === ri) {
            capture = true;
            captured = { player: opp, token: oi };
          }
        });
      }
      moves.push({ token, from: 0, to, enter: true, capture, captured });
      return;
    }
    if (pos >= FINISH) return;
    const to = pos + v;
    if (to > FINISH) return; // must be exact
    let capture = false;
    let captured: Move["captured"];
    const ri = ringIndex(player, to);
    if (ri != null && !SAFE_RING.has(ri)) {
      s.tokens[opp].forEach((op, oi) => {
        if (ringIndex(opp, op) === ri) {
          capture = true;
          captured = { player: opp, token: oi };
        }
      });
    }
    moves.push({ token, from: pos, to, enter: false, capture, captured });
  });

  return moves;
}

export function applyMove(s: PState, mv: Move): PState {
  const next: PState = structuredClone(s);
  const player = s.turn;
  const opp: Player = player === "you" ? "ai" : "you";

  next.tokens[player][mv.token] = mv.to;
  const log: PEvent[] = [];

  if (mv.enter) log.push({ kind: "enter", by: player });
  else if (mv.to === FINISH) log.push({ kind: "home", by: player });
  else log.push({ kind: "move", by: player, detail: String(s.value) });

  if (mv.capture && mv.captured) {
    next.tokens[mv.captured.player][mv.captured.token] = 0;
    log.push({
      kind: "capture",
      by: player,
      detail: mv.captured.player === "ai" ? "the merchant" : "the scribe",
    });
  }

  if (next.tokens[player].every((p) => p === FINISH)) {
    next.winner = player;
    next.awaitingMove = false;
    next.value = null;
    next.faces = null;
    log.push({ kind: "win", by: player });
    next.log = [...s.log, ...log];
    return next;
  }

  const extra = s.grace || mv.capture;
  next.awaitingMove = false;
  next.value = null;
  next.faces = null;
  next.grace = false;
  if (extra) {
    log.push({ kind: "grace", by: player });
  } else {
    next.turn = opp;
    next.throwsThisTurn = 0;
    log.push({ kind: "pass", by: player });
  }
  next.log = [...s.log, ...log];
  return next;
}

/** A throw with no legal move: re-throw on grace (capped), else pass. */
export function throwDice(s: PState): PState {
  const next: PState = structuredClone(s);
  const { faces, value, grace } = rollCowries();
  next.faces = faces;
  next.value = value;
  next.grace = grace;
  next.throwsThisTurn = s.throwsThisTurn + 1;

  const moves = legalMoves(next);
  if (moves.length > 0) {
    next.awaitingMove = true;
    return next;
  }
  // no move
  if (grace && next.throwsThisTurn < 3) {
    next.awaitingMove = false;
    return next; // caller throws again
  }
  next.awaitingMove = false;
  next.value = null;
  next.faces = faces; // keep for a beat so the player sees the throw
  next.grace = false;
  next.turn = s.turn === "you" ? "ai" : "you";
  next.throwsThisTurn = 0;
  next.log = [...s.log, { kind: "pass", by: s.turn, detail: "no move" }];
  return next;
}

/** Heuristic AI move choice. difficulty 1 = random. */
export function aiChooseMove(s: PState): Move | null {
  const moves = legalMoves(s, "ai");
  if (moves.length === 0) return null;
  if (s.difficulty === 1) return moves[Math.floor(Math.random() * moves.length)];

  const scored = moves.map((m) => {
    let score = 0;
    if (m.capture) score += 120;
    if (m.to === FINISH) score += 90;
    if (m.enter) score += 45;
    score += m.to * 1.6; // progress
    const ri = ringIndex("ai", m.to);
    if (ri != null && SAFE_RING.has(ri)) score += 22;
    // exposure: an enemy token 1..12 behind on the same ring index
    if (ri != null && !SAFE_RING.has(ri)) {
      for (const op of s.tokens.you) {
        const ori = ringIndex("you", op);
        if (ori == null) continue;
        const gap = (ri - ori + 52) % 52;
        if (gap >= 1 && gap <= 12) score -= 26;
      }
    }
    return { m, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].m;
}

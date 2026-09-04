"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { ROAD_MAPS, type RoadMap } from "@/content/road";
import { useGame } from "@/lib/store";
import { sfx } from "@/lib/audio";
import { juice } from "@/lib/juice";
import { WaxButton } from "@/components/chrome/WaxButton";
import type { GameProps } from "@/components/campaign/LevelShell";

type XY = [number, number];
const key = (x: number, y: number) => `${x},${y}`;
const eq = (a: XY, b: XY) => a[0] === b[0] && a[1] === b[1];

type Patrol = { cells: XY[]; sight: number; i: number; dir: 1 | -1 };

/** walk orthogonally between consecutive waypoints to a full per-cell path */
function expand(route: XY[]): XY[] {
  const out: XY[] = [route[0]];
  for (let k = 1; k < route.length; k++) {
    let [cx, cy] = out[out.length - 1];
    const [tx, ty] = route[k];
    while (cx !== tx) {
      cx += Math.sign(tx - cx);
      out.push([cx, cy]);
    }
    while (cy !== ty) {
      cy += Math.sign(ty - cy);
      out.push([cx, cy]);
    }
  }
  return out;
}
function advance(p: Patrol): { i: number; dir: 1 | -1 } {
  let ni = p.i + p.dir;
  let nd = p.dir;
  if (ni >= p.cells.length) {
    ni = p.cells.length - 2;
    nd = -1;
  } else if (ni < 0) {
    ni = 1;
    nd = 1;
  }
  return { i: Math.max(0, Math.min(p.cells.length - 1, ni)), dir: nd };
}

export function RoadGame({ level, onComplete }: GameProps) {
  const lang = useGame((s) => s.lang);
  const map: RoadMap = ROAD_MAPS[level.id] ?? ROAD_MAPS["road-1"];
  const rows = map.grid.length;
  const cols = map.grid[0].length;
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= cols || y >= rows ? "#" : map.grid[y][x];
  const passable = (x: number, y: number) => !"#~".includes(at(x, y));
  const blocksLOS = (x: number, y: number) => "#f".includes(at(x, y));
  const cost = (x: number, y: number) => (at(x, y) === "," || at(x, y) === "f" ? 2 : 1);

  const start = useMemo<XY>(() => {
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) if (map.grid[y][x] === "S") return [x, y];
    return [0, 0];
  }, [map, rows, cols]);
  const exit = useMemo<XY>(() => {
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) if (map.grid[y][x] === "X") return [x, y];
    return [cols - 1, 0];
  }, [map, rows, cols]);

  const baseRegen = 3;
  const staminaMax = 4;

  const [phase, setPhase] = useState<"intro" | "play" | "resolving" | "won" | "lost">(
    "intro",
  );
  const [pos, setPos] = useState<XY>(start);
  const [stamina, setStamina] = useState(staminaMax);
  const [turn, setTurn] = useState(1);
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [fordLock, setFordLock] = useState(false);
  const [seenEver, setSeenEver] = useState(false);
  const [weatherLeft, setWeatherLeft] = useState(0);
  const [caughtBy, setCaughtBy] = useState<number | null>(null);
  const [undo, setUndo] = useState<{ pos: XY; stamina: number; fordLock: boolean }[]>([]);
  const busy = useRef(false);
  const startedAt = useRef(0);

  const begin = () => {
    setPatrols(
      map.patrols.map((p) => ({
        cells: expand(p.route),
        sight: p.sight,
        i: p.start ?? 0,
        dir: 1 as const,
      })),
    );
    setPos(start);
    setStamina(staminaMax);
    setTurn(1);
    setFordLock(false);
    setSeenEver(false);
    setWeatherLeft(0);
    setCaughtBy(null);
    setUndo([]);
    busy.current = false;
    startedAt.current = Date.now();
    setPhase("play");
  };

  /** orthogonal line of sight from (sx,sy), returns the set of watched cells */
  const rayCells = useCallback(
    (sx: number, sy: number, sight: number): Set<string> => {
      const s = new Set<string>();
      s.add(key(sx, sy));
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        for (let d = 1; d <= sight; d++) {
          const x = sx + dx * d;
          const y = sy + dy * d;
          if (x < 0 || y < 0 || x >= cols || y >= rows) break;
          s.add(key(x, y));
          if (blocksLOS(x, y)) break;
        }
      }
      return s;
    },
    [cols, rows],
  );

  const exposedInset = (t: number) =>
    map.shrinkStart != null && t >= map.shrinkStart
      ? 1 + Math.floor((t - map.shrinkStart) / (map.shrinkEvery ?? 3))
      : 0;
  const isExposed = (x: number, y: number, t: number) => {
    const inset = exposedInset(t);
    return inset > 0 && Math.min(x, cols - 1 - x, y, rows - 1 - y) < inset;
  };

  /** where each patrol will be next turn, and what it will then watch */
  const telegraph = useMemo(() => {
    const nextCells: XY[] = [];
    const watched = new Set<string>();
    patrols.forEach((p) => {
      const { i } = advance(p);
      const [nx, ny] = p.cells[i];
      nextCells.push([nx, ny]);
      rayCells(nx, ny, p.sight).forEach((c) => watched.add(c));
    });
    return { nextCells, watched };
  }, [patrols, rayCells]);

  const inForest = at(pos[0], pos[1]) === "f";
  const willBeSeen = telegraph.watched.has(key(pos[0], pos[1])) && !inForest;

  const reachable = useMemo(() => {
    if (phase !== "play" || fordLock) return new Set<string>();
    const s = new Set<string>();
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const x = pos[0] + dx;
      const y = pos[1] + dy;
      if (passable(x, y) && cost(x, y) <= stamina) s.add(key(x, y));
    }
    return s;
  }, [phase, pos, stamina, fordLock]);

  const win = useCallback(
    (t: number, seen: boolean) => {
      let stars: 0 | 1 | 2 | 3 = 1;
      if (t <= map.par + 4 || !seen) stars = 2;
      if (t <= map.par && !seen) stars = 3;
      const score = Math.max(0, 320 - t * 8 + (seen ? 0 : 80));
      setPhase("won");
      sfx("unlock");
      juice.good(innerWidth / 2, innerHeight / 3);
      setTimeout(
        () =>
          onComplete({
            cleared: true,
            stars,
            score,
            timeMs: Date.now() - startedAt.current,
            mistakes: seen ? 1 : 0,
          }),
        700,
      );
    },
    [map.par, onComplete],
  );

  const lose = useCallback(
    (patrolIdx: number, t: number) => {
      setCaughtBy(patrolIdx);
      setPhase("lost");
      sfx("fail");
      juice.shake(360);
      juice.flash("rgba(178,58,46,0.3)", 420);
      setTimeout(
        () =>
          onComplete({
            cleared: false,
            stars: 0,
            score: Math.max(0, 120 - t * 4),
            timeMs: Date.now() - startedAt.current,
            mistakes: 1,
          }),
        900,
      );
    },
    [onComplete],
  );

  const step = (x: number, y: number) => {
    if (phase !== "play" || fordLock || !reachable.has(key(x, y))) return;
    setUndo((u) => [...u, { pos, stamina, fordLock }]);
    const c = cost(x, y);
    const isFord = at(x, y) === "=";
    setStamina((s) => (isFord ? 0 : s - c));
    setPos([x, y]);
    if (isFord) setFordLock(true);
    sfx("paper");
    if (telegraph.watched.has(key(x, y)) && at(x, y) !== "f") {
      setSeenEver(true);
      juice.flash("rgba(217,166,63,0.16)", 180);
    }
    if (x === exit[0] && y === exit[1]) win(turn, seenEver || (telegraph.watched.has(key(x, y)) && at(x, y) !== "f"));
  };

  const undoStep = () => {
    if (phase !== "play" || undo.length === 0) return;
    const last = undo[undo.length - 1];
    setUndo((u) => u.slice(0, -1));
    setPos(last.pos);
    setStamina(last.stamina);
    setFordLock(last.fordLock);
    sfx("tick");
  };

  const endTurn = () => {
    if (phase !== "play" || busy.current) return;
    busy.current = true;
    setPhase("resolving");
    setUndo([]);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = reduce ? 90 : 220;
    const preBeat = reduce ? 120 : 300;

    // move patrols one at a time for a readable "the watch moves" beat
    const moved: Patrol[] = patrols.map((p) => {
      const { i, dir } = advance(p);
      return { ...p, i, dir };
    });

    setTimeout(() => {
      moved.forEach((_, idx) => {
        setTimeout(() => {
          setPatrols((cur) => cur.map((p, j) => (j === idx ? moved[idx] : p)));
          sfx("tick");
        }, idx * stepDelay);
      });

      const resolveAt = preBeat + moved.length * stepDelay + (reduce ? 120 : 360);
      setTimeout(() => {
        const nextTurn = turn + 1;

        // detection
        let caught = -1;
        moved.forEach((p, idx) => {
          const [px, py] = p.cells[p.i];
          if (px === pos[0] && py === pos[1]) caught = idx;
          if (caught < 0 && at(pos[0], pos[1]) !== "f") {
            if (rayCells(px, py, p.sight).has(key(pos[0], pos[1]))) caught = idx;
          }
        });
        const stormCaught = isExposed(pos[0], pos[1], nextTurn);

        if (caught >= 0) return lose(caught, turn);
        if (stormCaught) return lose(-1, turn);

        const limit = Number(level.params.turnLimit ?? map.par + 12);
        if (nextTurn > limit) return lose(-1, nextTurn);

        // weather
        let wLeft = weatherLeft;
        if (map.weatherTurn && nextTurn === map.weatherTurn) wLeft = map.weatherDur ?? 2;
        const regen = wLeft > 0 ? baseRegen - 1 : baseRegen;
        if (wLeft > 0) wLeft -= 1;

        setWeatherLeft(wLeft);
        setStamina((s) => Math.min(staminaMax, s + regen));
        setFordLock(false);
        setTurn(nextTurn);
        setPhase("play");
        busy.current = false;
      }, resolveAt);
    }, preBeat);
  };

  /* ---------- render ---------- */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
          {level.arc} · {lang === "hi" ? `स्तर ${level.index}` : `Level ${level.index}`}
        </p>
        <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
          {lang === "hi"
            ? "एक चाल में गति-बिंदु ख़र्च कर के चलो, फिर बारी समाप्त करो। गश्तें दिखाए गए ख़ाने में जाएँगी और चारों ओर देखेंगी — बारी के अंत में उनकी नज़र में मत रहो। जंगल छुपाता है। मठ तक पहुँचो।"
            : "Spend stamina to move, then end your turn. Each watch will step to the marked square and look around it — don't end a turn in its line of sight. Forest hides you. Reach the monastery."}
        </p>
        <div className="mt-6">
          <WaxButton onClick={begin}>{lang === "hi" ? "निकलो" : "Set out"}</WaxButton>
        </div>
      </div>
    );
  }

  const cell = `min(8.2vw, ${cols > 9 ? 38 : 46}px)`;

  return (
    <div className="mx-auto max-w-fit">
      {/* HUD */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-[12px] text-ink-soft">
        <span>
          {lang === "hi" ? "चाल" : "Turn"}{" "}
          <span className={clsx(turn > map.par && "text-hingula")}>
            {turn}
          </span>
          <span className="text-ink/40"> / {map.par} {lang === "hi" ? "लक्ष्य" : "par"}</span>
        </span>
        <span className="flex items-center gap-1">
          {lang === "hi" ? "दम" : "Stamina"}
          {Array.from({ length: staminaMax }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "inline-block h-2.5 w-2.5 rounded-full border border-ink/40",
                i < stamina ? "bg-hingula" : "bg-transparent",
              )}
            />
          ))}
        </span>
        {willBeSeen && phase === "play" && (
          <span className="font-display text-hingula">
            {lang === "hi" ? "◎ नज़र में — हटो" : "◎ in the next watch — move"}
          </span>
        )}
        {weatherLeft > 0 && (
          <span className="text-lapis">
            {lang === "hi" ? "❄ कड़ा जाड़ा — दम कम" : "❄ hard winter — less stamina"}
          </span>
        )}
        {seenEver && (
          <span className="text-ink/40">{lang === "hi" ? "देखा गया" : "spotted once"}</span>
        )}
      </div>

      {/* board */}
      <div
        className="relative border border-ink/40 bg-leaf-deep/40 p-1"
        style={{ width: `calc(${cols} * (${cell} + 2px))` }}
      >
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${cols}, ${cell})` }}
        >
          {map.grid.flatMap((row, y) =>
            row.split("").map((ch, x) => {
              const kx = key(x, y);
              const watched = telegraph.watched.has(kx);
              const isNext = telegraph.nextCells.some((c) => c[0] === x && c[1] === y);
              const canGo = reachable.has(kx);
              const exposed = isExposed(x, y, turn);
              return (
                <button
                  key={kx}
                  data-hot
                  onClick={() => step(x, y)}
                  disabled={!canGo}
                  aria-label={kx}
                  className={clsx(
                    "relative flex items-center justify-center font-display text-[11px] transition-colors",
                    ch === "#" && "bg-ink/75 text-leaf/30",
                    ch === "~" && "bg-lapis/35",
                    ch === "=" && "bg-lapis/15 text-lapis",
                    ch === "f" && "bg-terreverte/25 text-terreverte",
                    ch === "," && "bg-tala/25 text-ink/50",
                    ch === "X" && "bg-haritala/70 text-ink",
                    (ch === "." || ch === "S") && "bg-leaf",
                    watched && "outline outline-1 -outline-offset-1 outline-hingula/50",
                    canGo && "ring-2 ring-inset ring-hingula/70 hover:bg-hingula/10",
                    exposed && "bg-hingula/15",
                  )}
                  style={{ height: cell }}
                >
                  {ch === "f" && "♣"}
                  {ch === "X" && "⌂"}
                  {ch === "=" && "="}
                  {ch === "#" && "▲"}
                  {watched && !isNext && (
                    <span className="pointer-events-none absolute inset-0 bg-hingula/10" />
                  )}
                  {isNext && (
                    <span className="pointer-events-none absolute inset-1 rounded-full border border-dashed border-hingula/70" />
                  )}
                </button>
              );
            }),
          )}
        </div>

        {/* player token */}
        <Token
          x={pos[0]}
          y={pos[1]}
          cell={cell}
          className={clsx(
            "bg-ink text-leaf",
            phase === "won" && "bg-terreverte",
            phase === "lost" && "bg-hingula",
          )}
          glyph="❦"
        />

        {/* patrols */}
        {patrols.map((p, idx) => {
          const [px, py] = p.cells[p.i];
          return (
            <Token
              key={idx}
              x={px}
              y={py}
              cell={cell}
              delayMs={phase === "resolving" ? idx * 220 : 0}
              className={clsx(
                "bg-hingula text-leaf",
                caughtBy === idx && "ring-2 ring-hingula ring-offset-1",
              )}
              glyph="✕"
            />
          );
        })}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WaxButton onClick={endTurn} disabled={phase !== "play"}>
          {phase === "resolving"
            ? lang === "hi"
              ? "पहरा चल रहा…"
              : "the watch moves…"
            : lang === "hi"
              ? "बारी समाप्त"
              : "End turn"}
        </WaxButton>
        <WaxButton onClick={undoStep} tone="quiet" disabled={phase !== "play" || !undo.length}>
          {lang === "hi" ? "वापस" : "Undo step"}
        </WaxButton>
        {phase === "lost" && (
          <span className="font-display text-sm text-hingula">
            {caughtBy === -1
              ? lang === "hi"
                ? "खुले में पकड़े गए।"
                : "Caught in the open."
              : lang === "hi"
                ? "पहरे ने देख लिया।"
                : "The watch saw you."}
          </span>
        )}
        {phase === "won" && (
          <span className="font-display text-sm text-terreverte">
            {lang === "hi" ? "मठ पहुँच गए।" : "You reach the monastery."}
          </span>
        )}
      </div>
    </div>
  );
}

function Token({
  x,
  y,
  cell,
  glyph,
  className,
  delayMs = 0,
}: {
  x: number;
  y: number;
  cell: string;
  glyph: string;
  className?: string;
  delayMs?: number;
}) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dur = reduce ? 1 : 320;
  return (
    <span
      aria-hidden
      className={clsx(
        "pointer-events-none absolute grid place-items-center rounded-full border border-ink/50 font-display text-[12px] shadow-leaf",
        className,
      )}
      style={{
        width: `calc(${cell} - 8px)`,
        height: `calc(${cell} - 8px)`,
        left: `calc(4px + ${x} * (${cell} + 2px) + 4px)`,
        top: `calc(4px + ${y} * (${cell} + 2px) + 4px)`,
        transition: `left ${dur}ms var(--ease-step) ${delayMs}ms, top ${dur}ms var(--ease-step) ${delayMs}ms, background-color 200ms ease`,
      }}
    >
      {glyph}
    </span>
  );
}

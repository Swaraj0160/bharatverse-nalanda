"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GameId } from "@/lib/games/types";
import type { GameProps } from "@/components/campaign/LevelShell";

/**
 * Each mini-game is code-split by route so /play/[level] only ships the one
 * game being played. A level whose game is absent here falls back to the
 * "coming soon" screen.
 */
const Loading = () => (
  <div className="py-20 text-center font-body text-sm text-ink-soft">
    <span className="mandala-spin inline-block">◈</span>
  </div>
);

export const GAME_REGISTRY: Partial<Record<GameId, ComponentType<GameProps>>> = {
  sorting: dynamic(
    () => import("@/components/games/sorting/SortingGame").then((m) => m.SortingGame),
    { loading: Loading },
  ),
  reconstruction: dynamic(
    () =>
      import("@/components/games/reconstruction/ReconstructionGame").then(
        (m) => m.ReconstructionGame,
      ),
    { loading: Loading },
  ),
  road: dynamic(
    () => import("@/components/games/road/RoadGame").then((m) => m.RoadGame),
    { loading: Loading },
  ),
};

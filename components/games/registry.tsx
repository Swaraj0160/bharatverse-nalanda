"use client";

import type { ReactNode } from "react";
import type { GameId } from "@/lib/games/types";
import type { GameProps } from "@/components/campaign/LevelShell";

/**
 * Maps a GameId to its playable component. Filled in phase by phase; a level
 * whose game is absent here falls back to the "coming soon" screen.
 */
export const GAME_REGISTRY: Partial<Record<GameId, (p: GameProps) => ReactNode>> = {
  // sorting:        added in phase 2B
  // reconstruction: added in phase 2C
  // road:           added in phase 2D
};

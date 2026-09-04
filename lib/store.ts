"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang } from "@/content/i18n";
import {
  START_RATING,
  updateRating,
  MISSION_RATING,
  rankTier,
  type RankTier,
} from "@/lib/elo";
import type { HistorianAnswer } from "@/lib/historian-types";
import type { CampaignEntry, LevelResult } from "@/lib/games/types";
import { EMPTY_ENTRY } from "@/lib/games/types";
import { LEVELS_BY_ID } from "@/lib/games/levels";
import { outcomeFromStars, xpForResult } from "@/lib/games/scoring";

type MissionState = {
  triage: { done: boolean; kept: string[] };
  translate: { done: boolean; score: number };
  courier: { done: boolean; routeId: string | null; grade: string | null };
};

export type HistoryEntry = {
  id: number;
  q: string;
  answer: HistorianAnswer;
};

/** original mission id → its first campaign level */
export const MISSION_LEVEL: Record<keyof MissionState, string> = {
  triage: "sorting-1",
  translate: "reconstruction-1",
  courier: "road-1",
};

type State = {
  _hydrated: boolean;
  lang: Lang;
  audioOn: boolean;
  demoPref: boolean | null;
  apiHasKey: boolean | null;

  rating: number;
  xp: number;
  discovered: string[];
  litNodes: string[];
  historyLog: HistoryEntry[];
  missions: MissionState;
  campaign: Record<string, CampaignEntry>;
  seals: Record<string, boolean>;

  setHydrated: () => void;
  setLang: (l: Lang) => void;
  toggleAudio: () => void;
  setDemoPref: (v: boolean | null) => void;
  setApiHasKey: (v: boolean) => void;

  discover: (ids: string[]) => void;
  setLitNodes: (ids: string[]) => void;
  pushHistory: (q: string, answer: HistorianAnswer) => void;
  score: (missionKey: keyof typeof MISSION_RATING, outcome: number) => void;

  /** Phase 2: record a skill-game run. Updates campaign, Elo, XP. */
  recordLevel: (levelId: string, result: LevelResult) => void;

  completeTriage: (kept: string[]) => void;
  completeTranslate: (score: number) => void;
  completeCourier: (routeId: string, grade: string) => void;
  earnSeal: (id: string) => void;
  resetAll: () => void;
};

const freshMissions = (): MissionState => ({
  triage: { done: false, kept: [] },
  translate: { done: false, score: 0 },
  courier: { done: false, routeId: null, grade: null },
});

export const useGame = create<State>()(
  persist(
    (set) => ({
      _hydrated: false,
      lang: "en",
      audioOn: false,
      demoPref: null,
      apiHasKey: null,

      rating: START_RATING,
      xp: 0,
      discovered: [],
      litNodes: [],
      historyLog: [],
      missions: freshMissions(),
      campaign: {},
      seals: {},

      setHydrated: () => set({ _hydrated: true }),
      setLang: (l) => set({ lang: l }),
      toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
      setDemoPref: (v) => set({ demoPref: v }),
      setApiHasKey: (v) => set({ apiHasKey: v }),

      discover: (ids) =>
        set((s) => {
          const next = new Set(s.discovered);
          ids.forEach((i) => next.add(i));
          return { discovered: [...next] };
        }),
      setLitNodes: (ids) => set({ litNodes: ids }),
      pushHistory: (q, answer) =>
        set((s) => ({
          historyLog: [...s.historyLog, { id: Date.now(), q, answer }],
          discovered: [...new Set([...s.discovered, ...answer.citations])],
        })),
      score: (missionKey, outcome) =>
        set((s) => ({
          rating: updateRating(s.rating, MISSION_RATING[missionKey], outcome),
        })),

      recordLevel: (levelId, result) =>
        set((s) => {
          const def = LEVELS_BY_ID[levelId];
          const prev = s.campaign[levelId] ?? EMPTY_ENTRY;
          const firstClear = result.cleared && !prev.cleared;

          const entry: CampaignEntry = {
            stars: Math.max(prev.stars, result.stars) as 0 | 1 | 2 | 3,
            bestScore: Math.max(prev.bestScore, result.score),
            bestTimeMs:
              result.cleared && result.timeMs > 0
                ? prev.bestTimeMs > 0
                  ? Math.min(prev.bestTimeMs, result.timeMs)
                  : result.timeMs
                : prev.bestTimeMs,
            cleared: prev.cleared || result.cleared,
            plays: prev.plays + 1,
          };

          const opponent = def?.rating ?? 1050;
          const rating = updateRating(
            s.rating,
            opponent,
            outcomeFromStars(result.stars),
          );
          const xp = s.xp + xpForResult(result, firstClear);

          // mirror the three original nodes onto the legacy mission flags so the
          // Journal and Pachisi unlock keep working unchanged.
          let missions = s.missions;
          for (const key of Object.keys(MISSION_LEVEL) as (keyof MissionState)[]) {
            if (MISSION_LEVEL[key] === levelId && result.cleared && !missions[key].done) {
              missions = {
                ...missions,
                [key]: { ...missions[key], done: true },
              };
            }
          }

          return { campaign: { ...s.campaign, [levelId]: entry }, rating, xp, missions };
        }),

      completeTriage: (kept) =>
        set((s) => ({ missions: { ...s.missions, triage: { done: true, kept } } })),
      completeTranslate: (sc) =>
        set((s) => ({
          missions: { ...s.missions, translate: { done: true, score: sc } },
        })),
      completeCourier: (routeId, grade) =>
        set((s) => ({
          missions: { ...s.missions, courier: { done: true, routeId, grade } },
        })),
      earnSeal: (id) => set((s) => ({ seals: { ...s.seals, [id]: true } })),
      resetAll: () =>
        set({
          rating: START_RATING,
          xp: 0,
          discovered: [],
          litNodes: [],
          historyLog: [],
          missions: freshMissions(),
          campaign: {},
          seals: {},
        }),
    }),
    {
      name: "bharatverse-nalanda-v1",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, from) => {
        const p = (persisted ?? {}) as Record<string, unknown>;
        if (from < 2) {
          if (typeof p.xp !== "number") p.xp = 0;
          if (typeof p.campaign !== "object" || p.campaign === null) p.campaign = {};
        }
        return p;
      },
      partialize: (s) => ({
        lang: s.lang,
        audioOn: s.audioOn,
        demoPref: s.demoPref,
        rating: s.rating,
        xp: s.xp,
        discovered: s.discovered,
        historyLog: s.historyLog,
        missions: s.missions,
        campaign: s.campaign,
        seals: s.seals,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

/* ---- selectors / helpers ---- */

export function useDemoMode(): boolean {
  return useGame((s) =>
    s.demoPref !== null ? s.demoPref : s.apiHasKey === true ? false : true,
  );
}

export function usePachisiUnlocked(): boolean {
  return useGame(
    (s) =>
      s.missions.triage.done &&
      s.missions.translate.done &&
      s.missions.courier.done,
  );
}

export function useRankTier(): RankTier {
  return useGame((s) => rankTier(s.rating));
}

export function useLevelEntry(id: string): CampaignEntry {
  return useGame((s) => s.campaign[id] ?? EMPTY_ENTRY);
}

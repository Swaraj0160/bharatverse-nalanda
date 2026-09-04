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

type State = {
  _hydrated: boolean;
  lang: Lang;
  audioOn: boolean;
  /** null = auto (follow API health); true/false = user override */
  demoPref: boolean | null;
  apiHasKey: boolean | null;

  rating: number;
  discovered: string[];
  litNodes: string[];
  historyLog: HistoryEntry[];
  missions: MissionState;
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
    (set, get) => ({
      _hydrated: false,
      lang: "en",
      audioOn: false,
      demoPref: null,
      apiHasKey: null,

      rating: START_RATING,
      discovered: [],
      litNodes: [],
      historyLog: [],
      missions: freshMissions(),
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
          discovered: [],
          litNodes: [],
          historyLog: [],
          missions: freshMissions(),
          seals: {},
        }),
    }),
    {
      name: "bharatverse-nalanda-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        lang: s.lang,
        audioOn: s.audioOn,
        demoPref: s.demoPref,
        rating: s.rating,
        discovered: s.discovered,
        historyLog: s.historyLog,
        missions: s.missions,
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

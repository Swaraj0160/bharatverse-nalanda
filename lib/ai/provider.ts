import type { HistorianAnswer } from "@/lib/historian-types";

export type GuideContext = {
  query: string;
  lang: "en" | "hi";
  /** the site the user is currently looking at, if any */
  siteId?: string;
  /** which screen the question was asked from — lens, site, game, map */
  screen?: string;
  /** the x-ray element currently focused, if any */
  focusedElement?: string;
  /** learner band, drives how much the guide assumes */
  level?: "beginner" | "intermediate" | "advanced" | "expert";
};

export interface AIProvider {
  readonly name: "mock" | "gemini";
  answer(ctx: GuideContext): Promise<HistorianAnswer>;
}

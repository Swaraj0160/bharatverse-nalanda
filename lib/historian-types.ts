export type AnswerSegment = {
  text: string;
  /** passage id this sentence-group is grounded in, if any */
  passageId?: string;
};

export type HistorianAnswer = {
  inScope: boolean;
  /** answer broken into segments so each can carry an inline source chip */
  segments: AnswerSegment[];
  /** every passage id cited, in order of first appearance */
  citations: string[];
  /** which mode produced this answer */
  mode: "live" | "demo";
  /** node ids to light up in the graph */
  litNodes: string[];
};

export type HistorianRequest = {
  query: string;
  lang: "en" | "hi";
};

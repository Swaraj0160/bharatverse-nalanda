/**
 * MockAIProvider — the default. Fully grounded, fully offline, needs no key.
 *
 * It does not "pretend" to be an LLM: it composes an answer out of the retrieved
 * passages verbatim and cites every one. That means it can never hallucinate,
 * which is exactly the property we want to demonstrate to judges. The Gemini
 * provider improves phrasing; it does not improve truthfulness.
 */

import type { AIProvider, GuideContext } from "@/lib/ai/provider";
import type { HistorianAnswer, AnswerSegment } from "@/lib/historian-types";
import { ground, litNodesFor } from "@/lib/ai/ground";
import { SITE_BY_ID } from "@/content/heritage";

const REFUSAL = {
  en: "I could not verify that from the available heritage sources, so I will not invent it. No source, no answer.",
  hi: "उपलब्ध धरोहर-स्रोतों से मैं इसकी पुष्टि नहीं कर सका, इसलिए मैं इसे गढ़ूँगा नहीं। स्रोत नहीं, तो उत्तर नहीं।",
};

const LEAD = {
  en: "From the records held for this site: ",
  hi: "इस स्थल के लिए रखे गए अभिलेखों से: ",
};

const HI_NOTE = {
  en: "",
  hi: " (मूल स्रोत-पाठ अंग्रेज़ी में है; ऊपर का सार अनुवादित नहीं किया गया।)",
};

export const MockAIProvider: AIProvider = {
  name: "mock",
  async answer(ctx: GuideContext): Promise<HistorianAnswer> {
    const hits = ground(ctx.query, ctx.siteId, 3);

    if (hits.length === 0) {
      return {
        inScope: false,
        segments: [{ text: REFUSAL[ctx.lang] }],
        citations: [],
        mode: "demo",
        litNodes: [],
      };
    }

    const site = ctx.siteId ? SITE_BY_ID[ctx.siteId] : undefined;
    const opener =
      site && ctx.lang === "en"
        ? `On ${site.name.en}, from the records held: `
        : LEAD[ctx.lang];

    const segments: AnswerSegment[] = hits.map((h, i) => ({
      text: (i === 0 ? opener : "") + h.passage.text,
      passageId: h.passage.id,
    }));
    if (ctx.lang === "hi") segments.push({ text: HI_NOTE.hi.trim() });

    const citations = hits.map((h) => h.passage.id);
    return {
      inScope: true,
      segments,
      citations,
      mode: "demo",
      litNodes: litNodesFor(citations),
    };
  },
};

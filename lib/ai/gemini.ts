/**
 * GeminiAIProvider — optional. Server-only; the key is never sent to a client.
 *
 * It receives the retrieved passages and may ONLY rephrase them. It cannot add
 * facts, and its citations are validated against what was actually retrieved
 * before we return them — a model that cites a passage we did not give it has
 * its citation dropped. On any error, timeout, or missing key the caller falls
 * back to MockAIProvider, so this path can never break the demo.
 *
 * Uses the REST endpoint directly rather than the SDK: one fewer dependency and
 * a smaller server bundle.
 */

import type { AIProvider, GuideContext } from "@/lib/ai/provider";
import type { HistorianAnswer, AnswerSegment } from "@/lib/historian-types";
import { ground, litNodesFor } from "@/lib/ai/ground";
import { SITE_BY_ID } from "@/content/heritage";

const MODEL = "gemini-2.0-flash";
const ENDPOINT = (m: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

const SYSTEM = `You are the Bharat Guide inside BHARATVERSE, a heritage game about Indian monuments.

You answer ONLY from the PASSAGES supplied to you. Rules, without exception:
- Every factual statement must be supported by one of the supplied passages.
- If the passages do not answer the question, set inScope=false and say you could not verify it from the available heritage sources, ending with exactly: "No source, no answer." Do NOT use knowledge beyond the passages.
- Never invent dates, names, measurements, UNESCO status, ASI status, or any government endorsement or partnership.
- If a passage flags something as disputed or uncertain, carry that caution into your answer. Do not resolve a dispute the sources leave open.
- Speak plainly, warmly, 50-90 words. No headings, no bullet lists.
- Put in "citations" the ids of exactly the passages you used.

Reply with ONLY a JSON object, no code fence:
{"inScope": boolean, "answer": string, "citations": string[]}`;

type GeminiOut = { inScope: boolean; answer: string; citations: string[] };

export const GeminiAIProvider: AIProvider = {
  name: "gemini",
  async answer(ctx: GuideContext): Promise<HistorianAnswer> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("no key");

    const hits = ground(ctx.query, ctx.siteId, 4);
    const site = ctx.siteId ? SITE_BY_ID[ctx.siteId] : undefined;

    const passages =
      hits.length > 0
        ? hits
            .map(
              (h) =>
                `[${h.passage.id}] ${h.passage.title}\n${h.passage.text}\n(source: ${h.passage.source})`,
            )
            .join("\n\n")
        : "(no passages matched — you are out of scope)";

    const situation = [
      site ? `The visitor is looking at ${site.name.en}, ${site.state}.` : "",
      ctx.screen ? `They are on the ${ctx.screen} screen.` : "",
      ctx.focusedElement ? `They have focused the element: ${ctx.focusedElement}.` : "",
      ctx.level ? `Pitch the answer at a ${ctx.level} learner.` : "",
      ctx.lang === "hi" ? "Answer in Hindi (Devanagari)." : "Answer in English.",
    ]
      .filter(Boolean)
      .join(" ");

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    let res: Response;
    try {
      res = await fetch(`${ENDPOINT(MODEL)}?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${situation}\n\nQuestion: ${ctx.query}\n\nPASSAGES:\n${passages}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        }),
      });
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) throw new Error(`gemini ${res.status}`);
    const json = await res.json();
    const raw: string =
      json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
      "";
    const out = JSON.parse(raw) as GeminiOut;

    // A model may only cite what it was actually given.
    const allowed = new Set(hits.map((h) => h.passage.id));
    const citations = (out.citations ?? []).filter((c) => allowed.has(c));

    if (!out.inScope || citations.length === 0) {
      return {
        inScope: false,
        segments: [{ text: out.answer?.trim() || "No source, no answer." }],
        citations: [],
        mode: "live",
        litNodes: [],
      };
    }

    const segments: AnswerSegment[] = [
      { text: out.answer.trim(), passageId: citations[0] },
    ];
    return {
      inScope: true,
      segments,
      citations,
      mode: "live",
      litNodes: litNodesFor(citations),
    };
  },
};

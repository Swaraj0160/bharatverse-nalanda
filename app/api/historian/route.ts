import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { retrieve, answerOffline, PASSAGE_BY_ID } from "@/lib/retrieval";
import type { HistorianAnswer } from "@/lib/historian-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live Mode uses Claude Haiku 4.5 deliberately — the Historian must answer in a
 * couple of seconds during a live demo, and every path here also has an offline
 * fallback (`answerOffline`) so a slow or failed call never blocks the room.
 */
const MODEL = "claude-haiku-4-5";

const SYSTEM = `You are Ratna, the last scribe-archivist on duty in the manuscript hall of Nalanda, in the year 1202 CE. Khalji's forces are three days away.

You answer ONLY from the PASSAGES supplied in the user's message. Rules, without exception:
- Every factual statement you make must be supported by one of the supplied passages.
- If the passages do not contain what is asked, you are out of scope: set inScope=false and say, in your own voice, that the manuscripts here cannot tell it — end with "No source, no answer." Do NOT use any knowledge beyond the passages.
- Never invent names, numbers, or dates. If a passage flags something as uncertain or as later tradition, carry that caution into your answer.
- Speak plainly and briefly — 55 to 90 words. First person, in period. No headings, no lists.
- Put the ids of every passage you actually used in "citations".

Respond by calling the emit_answer tool once.`;

const TOOL: Anthropic.Tool = {
  name: "emit_answer",
  description: "Return the Historian's grounded answer.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      inScope: {
        type: "boolean",
        description: "true only if the supplied passages actually answer the question",
      },
      answer: { type: "string", description: "the Historian's reply, 55-90 words, in voice" },
      citations: {
        type: "array",
        items: { type: "string" },
        description: "ids of the passages actually used (empty if out of scope)",
      },
    },
    required: ["inScope", "answer", "citations"],
  },
};

function litNodesFor(citations: string[]): string[] {
  const s = new Set<string>();
  for (const id of citations) for (const n of PASSAGE_BY_ID[id]?.nodes ?? []) s.add(n);
  return [...s];
}

export async function GET() {
  return NextResponse.json({ hasKey: Boolean(process.env.ANTHROPIC_API_KEY) });
}

export async function POST(req: Request) {
  let query = "";
  let lang: "en" | "hi" = "en";
  try {
    const body = await req.json();
    query = String(body?.query ?? "").slice(0, 400);
    lang = body?.lang === "hi" ? "hi" : "en";
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!query.trim()) {
    return NextResponse.json({ error: "empty query" }, { status: 400 });
  }

  const hits = retrieve(query, 4);

  // No key → serve the fully offline answer (still grounded, still cited).
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(answerOffline(query, lang));
  }

  try {
    const client = new Anthropic({ timeout: 9000, maxRetries: 1 });
    const passagesBlock =
      hits.length > 0
        ? hits
            .map(
              (h) =>
                `[${h.passage.id}] ${h.passage.title}\n${h.passage.text}\n(source: ${h.passage.source})`,
            )
            .join("\n\n")
        : "(no passages matched — you are out of scope)";

    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM,
      tool_choice: { type: "tool", name: "emit_answer" },
      tools: [TOOL],
      messages: [
        {
          role: "user",
          content: `Question (${lang}): ${query}\n\nPASSAGES:\n${passagesBlock}`,
        },
      ],
    });

    const block = msg.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") throw new Error("no tool_use");
    const out = block.input as { inScope: boolean; answer: string; citations: string[] };

    const validIds = new Set(hits.map((h) => h.passage.id));
    const citations = (out.citations ?? []).filter((c) => validIds.has(c));
    const inScope = Boolean(out.inScope) && citations.length > 0 && out.answer.trim().length > 0;

    if (!inScope) {
      const answer: HistorianAnswer = {
        inScope: false,
        segments: [
          {
            text:
              out.answer?.trim() ||
              (lang === "hi"
                ? "यह इन दीवारों की पांडुलिपियों से परे है। स्रोत नहीं, तो उत्तर नहीं।"
                : "That lies beyond the manuscripts within these walls. No source, no answer."),
          },
        ],
        citations: [],
        mode: "live",
        litNodes: [],
      };
      return NextResponse.json(answer);
    }

    const answer: HistorianAnswer = {
      inScope: true,
      segments: [{ text: out.answer.trim(), passageId: citations[0] }],
      citations,
      mode: "live",
      litNodes: litNodesFor(citations),
    };
    return NextResponse.json(answer);
  } catch {
    // Any failure — timeout, rate limit, parse — falls back to the offline answer.
    const fallback = answerOffline(query, lang);
    return NextResponse.json(fallback, { headers: { "x-historian-fallback": "1" } });
  }
}

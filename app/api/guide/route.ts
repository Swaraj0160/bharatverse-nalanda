import { NextResponse } from "next/server";
import { MockAIProvider } from "@/lib/ai/mock";
import { GeminiAIProvider } from "@/lib/ai/gemini";
import type { GuideContext } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Advertise capability so the client can label Live vs Demo honestly. */
export async function GET() {
  return NextResponse.json({
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    provider: process.env.GEMINI_API_KEY ? "gemini" : "mock",
  });
}

export async function POST(req: Request) {
  let ctx: GuideContext;
  try {
    const body = await req.json();
    ctx = {
      query: String(body?.query ?? "").slice(0, 400),
      lang: body?.lang === "hi" ? "hi" : "en",
      siteId: body?.siteId ? String(body.siteId).slice(0, 40) : undefined,
      screen: body?.screen ? String(body.screen).slice(0, 40) : undefined,
      focusedElement: body?.focusedElement
        ? String(body.focusedElement).slice(0, 60)
        : undefined,
      level: body?.level,
    };
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!ctx.query.trim()) {
    return NextResponse.json({ error: "empty query" }, { status: 400 });
  }

  // Live path is best-effort only. Any failure — no key, timeout, bad JSON,
  // rate limit — falls through to the grounded offline answer, so the demo
  // cannot be broken by the network.
  const wantLive = Boolean(process.env.GEMINI_API_KEY) && req.headers.get("x-demo") !== "1";
  if (wantLive) {
    try {
      return NextResponse.json(await GeminiAIProvider.answer(ctx));
    } catch {
      /* fall through */
    }
  }

  return NextResponse.json(await MockAIProvider.answer(ctx));
}

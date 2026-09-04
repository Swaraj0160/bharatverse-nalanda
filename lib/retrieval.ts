import { PASSAGES, PASSAGE_BY_ID, type Passage } from "@/content/passages";
import { NODE_BY_ID } from "@/content/graph";
import { CANNED } from "@/content/historianCanned";
import type { HistorianAnswer, AnswerSegment } from "@/lib/historian-types";
import { t, type Lang } from "@/content/i18n";

const STOP = new Set([
  "the", "a", "an", "of", "to", "in", "on", "at", "and", "or", "is", "was", "were",
  "did", "do", "does", "what", "who", "how", "why", "when", "where", "which", "that",
  "this", "it", "its", "for", "with", "as", "by", "be", "been", "are", "about", "tell",
  "me", "you", "i", "they", "them", "their", "there", "here", "from", "into", "over",
  "can", "could", "would", "should", "will", "shall", "may", "might", "please",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function stem(w: string): string {
  return w.replace(/(ies|es|s)$/, "").replace(/(ing|ed)$/, "");
}

export type Hit = { passage: Passage; score: number };

/** Deterministic keyword/term-overlap retrieval over the curated corpus. */
export function retrieve(query: string, k = 4): Hit[] {
  const qToks = tokenize(query);
  if (qToks.length === 0) return [];
  const qStems = new Set(qToks.map(stem));

  const scored: Hit[] = PASSAGES.map((p) => {
    let score = 0;
    const kw = p.keywords;
    for (const qt of qToks) {
      if (kw.includes(qt)) score += 2.2;
      else if (kw.some((k) => k.includes(qt) || qt.includes(k))) score += 1.1;
      if (p.title.toLowerCase().includes(qt)) score += 1.2;
      if (p.text.toLowerCase().includes(qt)) score += 0.5;
    }
    for (const qs of qStems) {
      if (kw.some((k) => stem(k) === qs)) score += 0.8;
    }
    for (const nid of p.nodes) {
      const label = NODE_BY_ID[nid]?.label.toLowerCase() ?? "";
      if (qToks.some((qt) => label.includes(qt))) score += 1.0;
    }
    return { passage: p, score };
  })
    .filter((h) => h.score >= 2.4)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
}

function matchCanned(query: string) {
  const qset = new Set(tokenize(query).flatMap((w) => [w, stem(w)]));
  let best: { entry: (typeof CANNED)[number]; hits: number } | null = null;
  for (const entry of CANNED) {
    let hits = 0;
    for (const trg of entry.triggers) {
      if (qset.has(trg) || qset.has(stem(trg))) hits += 1;
    }
    if (hits < entry.minHits) continue;
    if (!best || hits > best.hits || (hits === best.hits && entry.inScope && !best.entry.inScope)) {
      best = { entry, hits };
    }
  }
  return best;
}

function litNodesFor(passageIds: string[]): string[] {
  const set = new Set<string>();
  for (const id of passageIds) {
    for (const n of PASSAGE_BY_ID[id]?.nodes ?? []) set.add(n);
  }
  return [...set];
}

/** Build a fully offline answer (Demo Mode, or Live Mode fallback). */
export function answerOffline(query: string, lang: Lang): HistorianAnswer {
  const canned = matchCanned(query);
  if (canned) {
    const { entry } = canned;
    if (!entry.inScope) {
      return {
        inScope: false,
        segments: [{ text: entry[lang] }],
        citations: [],
        mode: "demo",
        litNodes: [],
      };
    }
    return {
      inScope: true,
      segments: [{ text: entry[lang], passageId: entry.citations[0] }],
      citations: entry.citations,
      mode: "demo",
      litNodes: litNodesFor(entry.citations),
    };
  }

  const hits = retrieve(query, 3);
  if (hits.length === 0) {
    return {
      inScope: false,
      segments: [
        {
          text:
            lang === "hi"
              ? "यह इन दीवारों के भीतर रखी पांडुलिपियों से परे है। मैं कुछ गढ़ूँगा नहीं। स्रोत नहीं, तो उत्तर नहीं।"
              : "That lies beyond the manuscripts kept within these walls. I will not invent it for you. No source, no answer.",
        },
      ],
      citations: [],
      mode: "demo",
      litNodes: [],
    };
  }

  const lead =
    lang === "hi"
      ? "जो यहाँ के पत्रों में अभिलिखित है, उससे: "
      : "From what these leaves record: ";
  const segments: AnswerSegment[] = hits.map((h, i) => ({
    text: (i === 0 ? lead : "") + h.passage.text,
    passageId: h.passage.id,
  }));
  if (lang === "hi") {
    segments.push({ text: t("hist.translationNote", "hi") });
  }
  const citations = hits.map((h) => h.passage.id);
  return {
    inScope: true,
    segments,
    citations,
    mode: "demo",
    litNodes: litNodesFor(citations),
  };
}

export { PASSAGE_BY_ID };

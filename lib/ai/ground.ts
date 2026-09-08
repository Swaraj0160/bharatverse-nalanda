/**
 * Grounding layer for the Bharat AI Guide.
 *
 * The corpus is the union of every site's curated passages. Retrieval is a
 * deterministic keyword/term-overlap scorer — no vector service, no network, so
 * it works identically offline and on the server. Facts only ever come from
 * here; a model may rephrase what this returns but may never add to it.
 */

import { PASSAGES, type Passage } from "@/content/passages";
import { SITE_PASSAGES } from "@/content/heritage";
import { NODE_BY_ID } from "@/content/graph";

export type SitedPassage = Passage & { site: string };

/** Nalanda's original corpus is tagged onto its site; the rest carry their own. */
export const CORPUS: SitedPassage[] = [
  ...PASSAGES.map((p) => ({ ...p, site: "nalanda" })),
  ...SITE_PASSAGES,
];

export const CORPUS_BY_ID: Record<string, SitedPassage> = Object.fromEntries(
  CORPUS.map((p) => [p.id, p]),
);

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

const stem = (w: string) => w.replace(/(ies|es|s)$/, "").replace(/(ing|ed)$/, "");

export type Hit = { passage: SitedPassage; score: number };

/**
 * Retrieve the best-matching passages. `site` biases (does not restrict) —
 * a question asked while looking at Konark prefers Konark passages but can
 * still surface a Nalanda one if that is genuinely the better match.
 */
export function ground(query: string, site?: string, k = 4): Hit[] {
  const qToks = tokenize(query);
  if (qToks.length === 0) return [];
  const qStems = new Set(qToks.map(stem));

  const scored: Hit[] = CORPUS.map((p) => {
    let score = 0;
    for (const qt of qToks) {
      if (p.keywords.includes(qt)) score += 2.2;
      else if (p.keywords.some((k2) => stem(k2) === stem(qt))) score += 1.5;
    }
    const hay = new Set(tokenize(p.title + " " + p.text).map(stem));
    for (const s of qStems) if (hay.has(s)) score += 0.55;
    // phrase bonus: a multi-word keyword appearing verbatim is a strong signal
    const q = query.toLowerCase();
    for (const k2 of p.keywords) if (k2.includes(" ") && q.includes(k2)) score += 2.6;
    return { passage: p, score };
  })
    .filter((h) => h.score >= 2)
    .sort((a, b) => b.score - a.score);

  // If a site is in view, answer from that site's records when it has any real
  // match; only fall back cross-site when the site itself has nothing.
  if (site) {
    const onSite = scored.filter((h) => h.passage.site === site);
    if (onSite.length > 0) return onSite.slice(0, k);
  }
  return scored.slice(0, k);
}

export function litNodesFor(citations: string[]): string[] {
  const s = new Set<string>();
  for (const id of citations) {
    for (const n of CORPUS_BY_ID[id]?.nodes ?? []) if (NODE_BY_ID[n]) s.add(n);
  }
  return [...s];
}

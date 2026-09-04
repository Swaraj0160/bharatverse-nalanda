# BHARATVERSE — The Lost Library of Nalanda

A grounded heritage game for **Smart India Hackathon (PS SIH26208 · Heritage & Culture)**.

It is 1202 CE. Bakhtiyar Khalji's riders are three days from Nalanda. You are the
last scribe on duty in the manuscript hall. What you save tonight — through
**triage**, **deciphering**, and **choosing a courier's road** — is what the next
age gets to read. Then the merchant lays out the cloth for a game of **Pachisi**.

The spine of the project is **"Ask the Historian"**: a conversational panel where
**every factual claim shows the source it rests on**, and any question outside the
grounded corpus is refused in character — *"No source, no answer."* A live
**knowledge graph** lights the exact nodes an answer depends on. This is the
anti‑hallucination guarantee, demonstrated on screen rather than claimed on a slide.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Demo Mode vs Live Mode

| | Demo Mode (default) | Live Mode |
|---|---|---|
| Network | **none** — fully offline | one call to the Claude API per question |
| Source of answers | curated, pre‑written, still cited & graph‑linked | `claude-haiku-4-5`, constrained by RAG over the same corpus |
| How to get it | nothing to configure | set `ANTHROPIC_API_KEY` (see `.env.example`) |
| Fallback | — | any timeout / error / missing key silently falls back to the Demo answer |

The HUD toggle cycles **auto → Demo → Live**. In `auto`, the app probes
`/api/historian` on load and uses Live only if the server reports a key.
**The 5‑minute judge demo runs entirely in Demo Mode with the wifi unplugged.**

To enable Live Mode on Vercel: Project → Settings → Environment Variables →
`ANTHROPIC_API_KEY` → redeploy.

---

## What's in the build

- **The Scriptorium** — a scroll‑driven manuscript hall, 6 hotspots: 3 missions
  (*The Triage*, *The Fragment*, *The Courier*) and 3 reading stations that feed
  the Historian's corpus.
- **Ask the Historian** — offline retrieval scorer + inline source cards +
  in‑character refusal. `app/api/historian/route.ts` adds the optional Claude path.
- **Knowledge graph** — ~50 hand‑authored nodes / ~75 edges (`content/graph.ts`),
  force‑directed, pulses on citation.
- **Adaptive layer** — an Elo‑style *Scribe's Rank* (`lib/elo.ts`) that every
  mission and Historian exchange nudges.
- **Pachisi** — playable cross board, six cowries, grace throws, capture, exact
  finish, a 2‑level AI opponent, and an in‑character chronicle of the match.
- **Scribe's Journal** — a colophon recap, exportable as a PNG.
- **Roadmap panel** — future regions/eras greyed on a stylised map (the
  *future progression* story).
- Language toggle **EN / हिन्दी**, synthesised ambient drone (Web Audio, no
  assets), reduced‑motion safe, minimal offline service worker.

## Content & sourcing

Every passage in `content/passages.ts` is written in plain words from general
historical knowledge and tagged with a **plain‑language source label** (e.g.
"Xuanzang's 7th‑century travel record", "Tabaqat‑i‑Nasiri, c. 1260 CE",
"Archaeological Survey of India excavation reports") — not fabricated page
citations. Passages deliberately flag uncertainty where the record is thin
(e.g. the tradition that the library "burned for months" is *not* in the
contemporary chronicle).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind · Framer Motion ·
Zustand · `react-force-graph-2d` · `@anthropic-ai/sdk`. Deploys as a single
project on Vercel; no database.

## Tuning knobs

- `lib/retrieval.ts` — retrieval threshold, canned‑answer matching
- `content/historianCanned.ts` — the polished answers judges are most likely to hit
- `lib/elo.ts` — `MISSION_RATING`, rank tiers, hint generosity
- `lib/pachisi/engine.ts` — cowrie values, grace set, AI heuristic weights

🤖 Generated with [Claude Code](https://claude.com/claude-code)

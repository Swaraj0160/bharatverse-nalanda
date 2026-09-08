# BHARATVERSE — Master Build Spec
**SIH 2026 · PS SIH26208 · AICTE · Software · Student Innovation · Theme: Toys & Games**

Single source of truth. Written before the build; the build executes this.

---

## 1. Product vision

> **BHARATVERSE — India isn't just history. Play it.**

Most heritage products **show information**. BharatVerse is an **interactive heritage game world**. The user is not reading about history; they are *playing with* it — reading a 13th-century sundial, rebuilding a collapsed temple, running a manuscript out of a burning library.

**Core loop:** DISCOVER → SEE → INTERACT → QUESTION → PLAY → LEARN → COLLECT → PROGRESS

### 1.1 Why this is not another AR heritage app

Three defensible differentiators, in order of strength:

1. **Monuments are game mechanics, not backdrops.** The Konark chariot wheel *is* a working sundial, so we built a game where you read the time off it using its real geometry (8 major spokes = 3h each, 8 minor spokes at the 1.5h midpoints, 30 rim beads of 3 minutes each, read anticlockwise from the top). The monument teaches by being played, not by being captioned. Competitors render a mesh and attach a quiz.
2. **Grounded AI that refuses.** Facts are *retrieved* from a curated, source-labelled corpus; the model may only rephrase. Ask it something the corpus cannot support and it says so — **"No source, no answer."** Every claim renders an inline source card. This is a demonstrated behaviour in Judge Mode, not a slide.
3. **It plays offline, with no key and no signup.** The entire product — every game, the AI guide, the 3D — runs with zero network. Conference wifi cannot break the demo.

### 1.2 Positioning vs the reference (smarak-ar.vercel.app)

Observed honestly and with a stated limit: the site is a fully client-rendered Next.js/shadcn SPA — its served HTML contains an **empty** app shell (Navbar, ModeProvider, Toaster, no content), so it paints nothing until JS hydrates, and I could not load its running UI in my sandboxed browser. My analysis is therefore of its **served shell and stack**, not of its live screens.

| | Smarak AR (as observed) | BharatVerse |
|---|---|---|
| Thesis | Monument **viewing**-led | **Play**-led |
| Server-rendered content | None (blank until JS) | Full SSR; content visible immediately |
| Component language | shadcn/ui defaults | Authored system (pigment tokens, Devanagari-derived display face) |
| Games | Not evident in the shell | 6 playable games / 14 levels at P0 |
| AI | Not evident | Grounded RAG + explicit refusal + source cards |
| Offline | Unknown | Full PWA, service worker, zero-network demo |
| 3D provenance | Unknown | 100% procedurally authored from published measurements — zero licensing debt |

**Positioning line:** *they built a viewer; we built a game world.*

---

## 2. Users & journeys

| Persona | Need | Primary surface |
|---|---|---|
| **Student (10–18)** | Heritage that is not a textbook | Games, Passport, Lens |
| **Teacher** | A 20-minute classroom activity with assessment | Educator Mode (P1) |
| **Curious adult / tourist** | Understand what they are looking at | Lens, X-Ray, AI Guide |
| **SIH judge** | Grasp it in 60s, feel the best of it in 3 min | Demo Mode, Judge Mode |

**Judge journey (the one that must be perfect):**
Landing → ENTER → Konark → Lens (3D) → Architecture X-Ray → ask the AI Guide → watch it *refuse* an unverifiable question → play **Shadow & Stone** → earn a **passport stamp**. Target 3 minutes, zero network, zero signup.

---

## 3. Strategic decision: absorb, do not demolish

The existing repo is a polished, working Nalanda experience: 3 skill games × 3 levels, Pachisi, a 44-passage grounded RAG corpus with a 50-node knowledge graph, Elo mastery, EN/हिन्दी, PWA, reduced-motion handling, synth audio.

**Nalanda is a real Indian heritage site** (Bihar; UNESCO World Heritage, 2016). So it is not an obstacle to a pan-India product — it is **the first fully-built site node in it.** Decision: BharatVerse becomes the pan-India shell; the Nalanda work becomes one site inside it, re-parented, not deleted.

| Existing asset | Becomes |
|---|---|
| Knowledge graph + RAG + "No source, no answer" | The factual backbone for **all** sites (§7) |
| `lib/elo.ts` | The mastery / adaptive-difficulty engine (§6.4) |
| Pachisi | First entry in the **Traditional Games Arcade** |
| Sorting / Reconstruction / Road (9 levels) | **Nalanda** site games |
| Demo Mode, PWA, i18n, reduced-motion, audio | Kept wholesale |
| Manuscript / paper-grain visual language | Evolved to sandstone / stone / ink (§8) |

**No dead routes.** `/scriptorium`, `/atlas`, `/pachisi`, `/journal`, `/play/*` are re-parented under the new information architecture, not orphaned.

---

## 4. Flagship monument: Konark Sun Temple — and why

Scored against the brief's criteria:

| Criterion | Konark | Note |
|---|---|---|
| **Game potential** | ★★★★★ | The wheel is a *literally functioning sundial* — a complete, sourced game mechanic sitting in the archaeology. Nothing else on the shortlist has this. |
| Asset feasibility | ★★★★★ | Radially symmetric, parametric geometry: hub, 8 major + 8 minor spokes, beaded rim. Ideal for procedural authoring; a Hampi bazaar is not. |
| Visual impact | ★★★★★ | Instantly recognisable; on the ₹10 note and the Odisha state emblem. |
| Educational value | ★★★★★ | Astronomy + engineering + art history in one object (STEM, not just heritage). |
| Source availability | ★★★★☆ | UNESCO World Heritage Site, ASI-protected, extensively published. |

Runners-up and why not: **Rani ki Vav** has an equally strong built-in mechanic (water / structural) — kept as site #3 and the Stepwell Engineer game (P1). **Hampi** is a landscape, not an object — poor procedural fit at this scope. **Taj Mahal** is over-exposed and has weak game affordance.

**Sites at P0:** Konark (deep), Nalanda (deep, carried forward), Rani ki Vav (breadth).

---

## 5. Information architecture

```
/                     Landing — cinematic, SSR, fast
/explore              Site browser: region + category filters
/site/[id]            Site hub: overview, timeline, architecture, sources, games
/lens/[id]            HERITAGE LENS — 3D viewer, X-Ray, hotspots, day/night
/games                Game hub, grouped by arc
/play/[level]         Level runner (existing shell, generalised)
/map                  India map, region nodes, time-scrubber
/passport             Collection, stamps, badges, mastery
/judge                Judge Mode — guided 8-step sequence
/toy-kit              Printable papercraft + AR marker
/api/guide            AI Guide endpoint (Mock | Gemini)
```

Nav: **Explore · Lens · Games · Map · Passport.** AI Guide is a global floating command surface, never a nav slot.

---

## 6. Game system — the spine

Every game publishes its **GAME → MECHANIC → LEARNING OUTCOME** mapping in-app.

### 6.1 P0 games

| Game | Mechanic | Learning outcome | Levels |
|---|---|---|---|
| **SHADOW & STONE** | Read the Konark wheel as a sundial: shadow against major spokes (3h), minor spokes (1.5h) and rim beads (3 min), anticlockwise from top-centre = midnight | Astronomy, monument-as-instrument | 3 |
| **REBUILD INDIA** | Reconstruct a collapsed monument from components — correct course order, orientation, structural validity | Architectural structure & logic | 3 |
| **THE SORTING** (Nalanda) | Timed triage of manuscripts under a cart limit, with decoys and a forgery | Prioritisation, source scepticism | 3 |
| **THE RECONSTRUCTION** (Nalanda) | Reassemble a torn leaf; pieces must fit *and* read in order | Pattern-match, reading comprehension | 3 |
| **THE ROAD** (Nalanda) | Turn-based tactical escape past fully-telegraphed patrols | Spatial planning, risk/reward | 3 |
| **PACHISI** (Arcade) | Real cowrie board game vs AI | Traditional games literacy | 2 AI tiers |

### 6.2 P1 games (specced, built if time allows)
Ashtapada · Gilli-Danda · Stepwell Engineer · Kolam symmetry · Script Decoder · Trade Winds · Conservation Watch · Who Am I? · Heritage Memory.

### 6.3 SHADOW & STONE — full mechanic

Sourced geometry:
- 8 **major** spokes → 24h / 8 = **3 h** apart
- 8 **minor** spokes → exactly midway → **1 h 30 m** from each neighbour
- **30 beads** between a minor and a major spoke → **3 min** each
- Beads elongated into readable sub-zones → ~**1 min** resolution
- Read **anticlockwise**; top-centre major spoke = **12 midnight**

Loop: a target time is given → the player rotates the gnomon shadow to that time (or, inverted, reads a shown shadow and enters the time) → scored on error in minutes.
- **L1 "Noon and Midnight"** — major spokes only; generous tolerance.
- **L2 "Between the Spokes"** — minor spokes in play; tighter tolerance.
- **L3 "The Bead Count"** — full bead resolution; a passing cloud briefly hides the shadow.

3★ requires reading to bead precision. This is a real skill, learned from a real monument, and it is the most defensible "toy/game from our civilisation" artefact in the submission.

### 6.4 Progression
Mastery ladder **Discovered → Explored → Practiced → Mastered**, earned by interaction and challenge completion — never by time spent. Driven by the existing Elo model (`lib/elo.ts`); level results feed `recordLevel`.

Adaptive difficulty bands: Beginner (*what is this?*) → Intermediate (*which feature?*) → Advanced (*why this structural system?*) → Expert (*compare traditions*).

---

## 7. AI architecture

```
lib/ai/provider.ts     AIProvider interface
lib/ai/mock.ts         MockAIProvider   — grounded, offline, zero-key (DEFAULT)
lib/ai/gemini.ts       GeminiAIProvider — server-only, key-gated
lib/ai/ground.ts       retrieval over the per-site corpus (generalised)
app/api/guide/route.ts single endpoint; selects provider; always falls back
```

**Hard rules**
- `GEMINI_API_KEY` is read **server-side only**, never shipped to the client, never committed. Absent key ⇒ MockAIProvider ⇒ full functionality.
- **Facts are retrieved; only phrasing is generated.** The model receives the retrieved passages and may not introduce facts outside them.
- Never invent dates, attributions, UNESCO status, or government partnerships.
- On uncertainty: `inScope=false` plus *"I could not verify that from the available heritage sources."* plus **"No source, no answer."** Shown visibly; demoed deliberately in Judge Mode.
- Every answer renders inline **source cards**.
- Context-aware: the request carries `{siteId, screen, focusedElement, lang, level}` so the guide already knows what you are looking at.

---

## 8. Design system → `docs/DESIGN_SYSTEM.md`

**Evolve, do not replace.** The existing pigment tokens are already authored and distinctive (named for real pigments, not `primary-500`). We widen them from a manuscript interior to a pan-India stone-and-sky palette.

| Token | Hex | Role |
|---|---|---|
| `--sandstone` | `#D9C29A` | new primary ground (Konark khondalite / laterite) |
| `--stone-deep` | `#8C7355` | weathered stone, panels |
| `--ink` | `#1B1712` | text, linework |
| `--hingula` | `#B23A2E` | vermilion — action, active state |
| `--haritala` | `#D9A63F` | orpiment gold — unlocked, reward |
| `--indigo` | `#26406B` | deep indigo — night, sky, water |
| `--terreverte` | `#5B7B5A` | success, verified |
| `--leaf` | `#E8D6B0` | palm-leaf — retained for Nalanda interiors |

**Type:** Yatra One (display, Devanagari-derived Latin) · Gentium Book Plus (body, multi-script) · Kalam (hand) · Tiro Devanagari Sanskrit (Devanagari).

**Motion:** named, authored easings only — `--ease-stone` `cubic-bezier(.32,0,.24,1)` (weight, settling mass) · `--ease-ink` `cubic-bezier(.22,1,.36,1)` (ink spreading) · `--ease-step` `cubic-bezier(.5,0,.2,1)` (deliberate footfall). No untouched Framer defaults. Everything staggered and sequenced.

**In-world feedback:** stone dust and ink splatter (not sparkles); wax seals (not star widgets); temple-bell and stone-scrape cues (not UI blips); grain via SVG turbulence (not a texture PNG).

**Banned:** default shadcn look, generic gradient hero, stock icon packs as the primary visual language, default progress bars, motif overload.

---

## 9. Data model

```ts
HeritageSite {
  id, name{en,hi}, state, region, coords{lat,lng}, period, dynasty,
  categories[], summary{en,hi}, timeline[], architecture[], stories[],
  assets{model, hotspots[]}, games[], sources[],
  verification: "verified" | "curated" | "demo"
}
```

DB-ready normalised tables (not created tonight): `users · heritage_sites · heritage_assets · heritage_sources · heritage_stories · games · game_levels · challenges · user_progress · passport_stamps · badges · ai_sessions · saved_sites`.

**Trust system:** every fact carries a source label and one of **Verified / Curated / Demo**. Demo/conceptual reconstruction is visually distinct (dashed border + explicit label) and never mixed with verified content.

---

## 10. AR strategy — capability-tiered, honest

| Tier | Condition | Experience | Label shown |
|---|---|---|---|
| L3 | `navigator.xr` + `immersive-ar` supported | True WebXR placement | **AR Ready** |
| L2 | `getUserMedia` available | Camera-composited placement | **AR (camera)** |
| L1 | always | Full interactive 3D viewer | **3D Experience** |
| L0 | WebGL unavailable | Illustrated fallback, X-Ray as 2D diagram | **Illustrated** |

The user never sees a broken camera. The entry point is labelled truthfully per device. **No fake AR, no fake computer vision.** Monument-in-the-wild recognition is explicitly *not* claimed; the printed marker (`/toy-kit`) is the reliable path.

---

## 11. Performance budgets

| Route | Budget (First Load JS) |
|---|---|
| `/` landing | ≤ 175 kB |
| `/explore`, `/games`, `/passport` | ≤ 185 kB |
| `/play/[level]` | ≤ 185 kB (each game dynamically imported) |
| `/lens/[id]` | ≤ 450 kB (three.js, dynamically imported, route-isolated) |

Rules: every 3D scene and every game is `next/dynamic`-imported. `three` must never appear in the shared chunk. No model loads on initial page load.

---

## 12. Demo & judging

**Demo Mode** — default ON, no auth, no network. Every game and the AI Guide are fully playable offline via the service worker + Mock provider.

**Judge Mode** (`/judge`, keyboard `J`) — 8 steps with a visible counter and a **Reset demo state** button so it can be run repeatedly for successive judges: `01 Discovery · 02 3D Model · 03 AR tier · 04 AI Guide · 05 The refusal · 06 Game · 07 Learning · 08 Passport & Impact`.

---

## 13. Acceptance criteria

- [ ] Production build type-clean; deployed to the existing Vercel project
- [ ] No new **required** env vars; app fully functional with zero keys
- [ ] Demo Mode works offline end to end
- [ ] AI Guide refuses an out-of-scope question, visibly, with no citations
- [ ] Every answer shows source cards
- [ ] ≥ 6 games playable; ≥ 14 levels total
- [ ] Konark 3D loads, orbits, X-Rays, and shows hotspots
- [ ] Shadow & Stone is winnable at 3★ using the real bead geometry
- [ ] Passport stamp earned and visible
- [ ] Every new surface tested with `prefers-reduced-motion` ON **and** OFF
- [ ] No dead routes; no half-built game live

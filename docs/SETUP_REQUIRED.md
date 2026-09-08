# ⚠️ MANUAL SETUP REQUIRED FROM SWARAJ

Nothing here blocks tonight's build. Every item has a working fallback already in
the code. Each one flips to real capability the moment you supply it.

---

## 1. `GEMINI_API_KEY` — **deferred, not blocking**

**What it is:** a Google AI Studio API key so the Bharat AI Guide generates
conversational phrasing instead of serving pre-composed grounded answers.

**Steps:**
1. Go to <https://aistudio.google.com/apikey> and sign in with a Google account.
2. Click **Create API key** → **Create API key in new project** (the free tier is
   enough for judging: Gemini 2.0/2.5 Flash free tier is rate-limited per minute
   but has no card requirement). Copy the key.
3. Go to <https://vercel.com/swaraj0160s-projects/bharatverse-nalanda/settings/environment-variables>
4. **Key:** `GEMINI_API_KEY`  **Value:** *(paste)*  **Environments:** tick
   Production, Preview, Development. Click **Save**.
5. Redeploy (Vercel → Deployments → ⋯ → Redeploy), or just push a commit.

**Until then:** `MockAIProvider` serves grounded, cited, fully offline answers
from the curated corpus. The app is 100% functional with no key. The key only
changes *phrasing*, never *facts* — facts are always retrieved, never generated.

> **Do not paste the key into chat, a file, or a commit.** Vercel's env var UI only.

---

## 2. Database — **no action needed**

Decision: **localStorage-first with a DB-ready schema.** All progress
(passport, stamps, mastery, collection, Elo rating) persists client-side through
the existing versioned Zustand store. The schema in the master spec is normalised
and ready to lift into Postgres/Supabase later, but nothing tonight requires a
database, a connection string, or an action from you.

Rationale: a judge must be able to use the product with zero signup. Adding a DB
tonight would add a failure mode and buy nothing demonstrable.

---

## 3. 3D assets & licensing — **resolved, no action needed**

Decision: **all geometry is authored procedurally in code** (React Three Fiber +
`three`), driven by real published measurements. Nothing is downloaded.

- Zero licensing risk — we own every vertex.
- It is a *stronger* SIH story: "we modelled it from the archaeological record,
  we didn't download it."
- The Konark chariot wheel is genuinely parametric (hub, 8 major + 8 minor
  spokes, beaded rim), so code-authoring is the *right* tool, not a compromise.

No CC0/CC-BY assets are used, so there is no attribution debt. If we later add
scanned meshes, `CREDITS.md` is already stubbed for it.

**You do not need to download or upload anything.**

---

## 4. Fonts — **no action needed**

All open-licensed, already installed via `next/font/google`:

| Role | Face | Licence | Why |
|---|---|---|---|
| Display | **Yatra One** | OFL | Latin letterforms constructed from Devanagari strokes — a real Devanagari↔Latin pairing, not a generic serif |
| Body | **Gentium Book Plus** | OFL | Designed alongside Indic scripts; reads as a scholarly book face |
| Hand / marginalia | **Kalam** | OFL | Indian Type Foundry; a scribe's hand |
| Devanagari / Sanskrit | **Tiro Devanagari Sanskrit** | OFL | Manuscript-accurate Devanagari |

---

## 5. Vercel — **no action needed**

Deploying to the existing project `swaraj0160s-projects/bharatverse-nalanda`
(alias `bharatverse-nalanda.vercel.app`). CLI is authenticated as `swaraj0160`.
No new build settings, no region or runtime changes.

**New env vars introduced:** `GEMINI_API_KEY` only, and it is optional.
(`ANTHROPIC_API_KEY` remains supported for the legacy Historian path; also optional.)

---

## 6. Everything else — **no action needed**

| Item | Decision |
|---|---|
| TTS / STT | Browser-native Web Speech API. No service, no key, no cost. Capability-detected; degrades to text. |
| Map tiles | None. The India map is authored SVG — no tile provider, no API key, works offline. |
| Geolocation | Browser-native, permission-gated, with a clearly-labelled demo location fallback. |
| Analytics | Local-only event counters powering the in-app Impact Dashboard. No third party, no PII, no consent banner needed. |
| Domain | None needed; the `.vercel.app` alias is fine for judging. |
| AR | WebXR where supported, camera-composite where not, 3D viewer everywhere. No SDK, no key. |

---

## Optional, if you have five spare minutes

Print `/toy-kit` (the papercraft AR marker) on plain A4 and bring it to the demo.
It is the physical "toy" half of *Toys & Games* and costs nothing but paper.

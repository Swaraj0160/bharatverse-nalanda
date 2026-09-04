"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { LEVELS_BY_ID } from "@/lib/games/levels";
import { GAME_REGISTRY } from "@/components/games/registry";
import { LevelShell } from "@/components/campaign/LevelShell";
import { WaxButton } from "@/components/chrome/WaxButton";
import { HudBar } from "@/components/chrome/HudBar";

export function PlayClient({ levelId }: { levelId: string }) {
  const lang = useGame((s) => s.lang);
  const level = LEVELS_BY_ID[levelId];

  if (!level) {
    return (
      <div className="min-h-screen">
        <HudBar />
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-ink">
            {lang === "hi" ? "यह पृष्ठ नहीं मिला" : "No such level"}
          </h1>
          <div className="mt-4">
            <Link href="/atlas">
              <WaxButton>{lang === "hi" ? "मानचित्र" : "Atlas"}</WaxButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // external node (Pachisi lives on its own route)
  const external = level.params.external as string | undefined;
  if (external) {
    return (
      <div className="min-h-screen">
        <HudBar />
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-ink">{level.title[lang]}</h1>
          <p className="mt-2 font-body text-sm text-ink-soft">{level.blurb[lang]}</p>
          <div className="mt-5">
            <Link href={external}>
              <WaxButton>{lang === "hi" ? "खोलें" : "Open"}</WaxButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const Game = GAME_REGISTRY[level.game];

  if (!level.playable || !Game) {
    return (
      <div className="min-h-screen">
        <HudBar />
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-hingula">
            {level.arc}
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">{level.title[lang]}</h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
            {level.blurb[lang]}
          </p>
          <p className="mt-6 border border-dashed border-ink/30 bg-leaf-deep/40 px-4 py-3 font-body text-sm text-ink-soft">
            {lang === "hi"
              ? "यह स्तर अगले चरण में आ रहा है।"
              : "This level arrives in a later build pass."}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/atlas">
              <WaxButton tone="leaf">{lang === "hi" ? "मानचित्र" : "Atlas"}</WaxButton>
            </Link>
            <Link href="/scriptorium">
              <WaxButton tone="quiet">
                {lang === "hi" ? "लिपि-कक्ष" : "Scriptorium"}
              </WaxButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <LevelShell level={level} render={(p) => <Game {...p} />} />;
}

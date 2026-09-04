"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LevelDef, LevelResult } from "@/lib/games/types";
import { useGame, useRankTier } from "@/lib/store";
import { rankTier } from "@/lib/elo";
import { xpForResult } from "@/lib/games/scoring";
import { nextLevel, levelUnlocked, LEVELS_BY_ID } from "@/lib/games/levels";
import { t } from "@/content/i18n";
import { LevelCompleteScreen } from "@/components/campaign/LevelCompleteScreen";

export type GameProps = {
  level: LevelDef;
  /** call once when the run ends (win or lose) */
  onComplete: (result: LevelResult) => void;
  /** changes on Replay — use as React key to fully remount game state */
  runKey: number;
};

/**
 * Owns the campaign plumbing around a mini-game: records the run, computes
 * rank/XP deltas, shows the celebration, and wires Replay / Next / Map.
 */
export function LevelShell({
  level,
  render,
}: {
  level: LevelDef;
  render: (props: GameProps) => ReactNode;
}) {
  const router = useRouter();
  const lang = useGame((s) => s.lang);
  const recordLevel = useGame((s) => s.recordLevel);
  const tier = useRankTier();

  const [runKey, setRunKey] = useState(1);
  const [done, setDone] = useState<{
    result: LevelResult;
    xpGained: number;
    rankBefore: string;
    rankAfter: string;
  } | null>(null);
  const busy = useRef(false);

  const onComplete = useCallback(
    (result: LevelResult) => {
      if (busy.current) return;
      busy.current = true;

      const s = useGame.getState();
      const firstClear = result.cleared && !s.campaign[level.id]?.cleared;
      const rankBefore = rankTier(s.rating).title[lang];

      recordLevel(level.id, result);

      const after = useGame.getState();
      setDone({
        result,
        xpGained: xpForResult(result, firstClear),
        rankBefore,
        rankAfter: rankTier(after.rating).title[lang],
      });
    },
    [level.id, lang, recordLevel],
  );

  const replay = () => {
    setDone(null);
    busy.current = false;
    setRunKey((k) => k + 1);
  };

  const nxt = nextLevel(level.id);
  const nextIsOpen =
    !!nxt && (done?.result.cleared ?? false) &&
    levelUnlocked(nxt, { ...useGame.getState().campaign });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/20 bg-leaf/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-2 text-xs">
          <Link href="/" className="font-display text-sm tracking-wide text-ink hover:text-hingula">
            BHARATVERSE
          </Link>
          <span className="hidden text-ink/40 sm:inline">·</span>
          <span className="hidden font-body italic text-ink-soft sm:inline">
            {level.arc} — {level.title[lang]}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="border border-ink/25 px-2 py-1 font-display text-hingula">
              {tier.title[lang]}
            </span>
            <Link
              href="/atlas"
              className="border border-ink/25 px-2 py-1 font-display tracking-wide text-ink-soft hover:text-ink"
            >
              {lang === "hi" ? "मानचित्र" : "Atlas"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-6">
        <div key={runKey}>{render({ level, onComplete, runKey })}</div>
      </main>

      {done && LEVELS_BY_ID[level.id] && (
        <LevelCompleteScreen
          open
          level={level}
          result={done.result}
          xpGained={done.xpGained}
          rankBefore={done.rankBefore}
          rankAfter={done.rankAfter}
          onReplay={replay}
          onMap={() => router.push("/atlas")}
          onNext={nxt && nextIsOpen ? () => router.push(`/play/${nxt.id}`) : null}
        />
      )}

      <p className="pb-8 text-center font-body text-[11px] text-ink/40">
        {t("hud.demoOn", lang)}
      </p>
    </div>
  );
}

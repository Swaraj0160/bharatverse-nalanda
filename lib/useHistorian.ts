"use client";

import { useState, useCallback } from "react";
import { useGame, useDemoMode } from "@/lib/store";
import { answerOffline } from "@/lib/retrieval";
import type { HistorianAnswer } from "@/lib/historian-types";

export function useHistorian() {
  const lang = useGame((s) => s.lang);
  const demo = useDemoMode();
  const pushHistory = useGame((s) => s.pushHistory);
  const setLitNodes = useGame((s) => s.setLitNodes);
  const score = useGame((s) => s.score);
  const earnSeal = useGame((s) => s.earnSeal);
  const [pending, setPending] = useState(false);

  const ask = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query || pending) return;
      setPending(true);

      let answer: HistorianAnswer;
      try {
        if (demo) {
          // hint of latency so the "consulting the shelves" state is legible
          await new Promise((r) => setTimeout(r, 420));
          answer = answerOffline(query, lang);
        } else {
          const res = await fetch("/api/historian", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ query, lang }),
          });
          answer = (await res.json()) as HistorianAnswer;
        }
      } catch {
        answer = answerOffline(query, lang);
      }

      pushHistory(query, answer);
      setLitNodes(answer.litNodes);
      if (answer.inScope) {
        score("historian_in_scope", 1);
      } else {
        score("historian_probe", 0.6);
        earnSeal("refusal");
      }
      setPending(false);
      return answer;
    },
    [demo, lang, pending, pushHistory, setLitNodes, score, earnSeal],
  );

  return { ask, pending };
}

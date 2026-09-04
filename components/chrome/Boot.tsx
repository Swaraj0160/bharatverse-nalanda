"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { startDrone, stopDrone, isDroneRunning } from "@/lib/audio";

/** Runs once on the client: probes API health, wires the ambient drone. */
export function Boot() {
  const setApiHasKey = useGame((s) => s.setApiHasKey);
  const audioOn = useGame((s) => s.audioOn);
  const hydrated = useGame((s) => s._hydrated);

  useEffect(() => {
    let alive = true;
    fetch("/api/historian", { method: "GET" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setApiHasKey(Boolean(d?.hasKey));
      })
      .catch(() => {
        if (alive) setApiHasKey(false);
      });
    return () => {
      alive = false;
    };
  }, [setApiHasKey]);

  useEffect(() => {
    if (!hydrated) return;
    if (audioOn && !isDroneRunning()) startDrone();
    if (!audioOn && isDroneRunning()) stopDrone();
  }, [audioOn, hydrated]);

  return null;
}

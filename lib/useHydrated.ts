"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";

/** True once the persisted store has rehydrated on the client. */
export function useHydrated(): boolean {
  const hydrated = useGame((s) => s._hydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && hydrated;
}

"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wrap the app so that when a viewer prefers reduced motion, Framer snaps every
 * transform/opacity animation straight to its target — content is never left
 * hidden behind an entrance animation that won't play.
 */
export function Motion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

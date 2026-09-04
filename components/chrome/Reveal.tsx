"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-reveal that degrades safely. Server and first client render are plain
 * (visible, no animation) so there is no hydration mismatch; after mount, if the
 * viewer allows motion, it upgrades to an in-view fade/rise. Reduced-motion
 * viewers keep the plain version — content is never hidden behind an entrance
 * that will not play.
 */
export function Reveal({
  children,
  y = 24,
  blur = false,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  y?: number;
  blur?: boolean;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "p" | "li" | "article";
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => setMounted(true), []);

  const Tag = as;

  if (!mounted || reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  const M = motion[as] as typeof motion.div;
  return (
    <M
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, ease: [0.16, 0.84, 0.44, 1], delay }}
      className={className}
    >
      {children}
    </M>
  );
}

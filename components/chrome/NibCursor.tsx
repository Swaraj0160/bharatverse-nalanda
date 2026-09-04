"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A calligraphic ink-nib cursor that trails the pointer. Purely decorative:
 * pointer-events are never intercepted, and it disables itself for coarse
 * pointers and reduced-motion so it can never harm the live demo.
 */
export function NibCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [down, setDown] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-armed");

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as HTMLElement | null;
      setHot(!!el?.closest("button, a, [data-hot], input, textarea, select"));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    const tick = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      if (ref.current) {
        ref.current.style.transform = `translate(${x - 3}px, ${y - 2}px) rotate(${
          -18 + (tx - x) * 0.6
        }deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("cursor-armed");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className="nib-cursor"
      aria-hidden
      style={{ opacity: down ? 1 : 0.9 }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 19 L11 4 L14 6 Z"
          fill={hot ? "var(--hingula)" : "var(--ink)"}
        />
        <path d="M11 4 L13 2.5 L15.5 4.5 L14 6 Z" fill="var(--tala)" />
        <circle
          cx="6.4"
          cy="16.2"
          r={down ? 2.6 : 1.4}
          fill="var(--hingula)"
          opacity={down ? 0.9 : 0.5}
        />
      </svg>
    </div>
  );
}

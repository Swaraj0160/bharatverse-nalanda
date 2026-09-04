"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { subscribeJuice, type JuiceEvent } from "@/lib/juice";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
};

type Pop = { id: number; x: number; y: number; text: string; color: string };

/**
 * One instance, mounted in the root layout. Draws particle bursts on a canvas,
 * floating score pops as DOM, and applies shake / colour-flash. Reduced-motion
 * viewers get the pops (instant, no drift) and nothing else.
 */
export function JuiceLayer() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const [flash, setFlash] = useState<{ color: string } | null>(null);
  const popId = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const alive: Particle[] = [];
      for (const p of particles.current) {
        p.life += 1;
        p.vy += 0.12;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const k = 1 - p.life / p.max;
        if (k <= 0) continue;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, k * 1.6);
        ctx.fillStyle = p.color;
        // a torn-paper fleck
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
        alive.push(p);
      }
      particles.current = alive;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onEvent = (e: JuiceEvent) => {
      if (e.t === "burst" && !reduce) {
        const n = e.count ?? 16;
        for (let i = 0; i < n; i++) {
          const a = (Math.PI * 2 * i) / n + Math.random() * 0.6;
          const sp = (2 + Math.random() * 4) * (e.spread ?? 1);
          particles.current.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 2,
            life: 0,
            max: 32 + Math.random() * 26,
            size: 4 + Math.random() * 5,
            color: e.color ?? "#D9A63F",
            rot: Math.random() * 6,
            vr: (Math.random() - 0.5) * 0.4,
          });
        }
      } else if (e.t === "pop") {
        const id = popId.current++;
        setPops((cur) => [...cur, { id, x: e.x, y: e.y, text: e.text, color: e.color ?? "#1B1712" }]);
        setTimeout(() => setPops((cur) => cur.filter((p) => p.id !== id)), 1100);
      } else if (e.t === "shake" && !reduce) {
        const el = document.documentElement;
        el.classList.remove("juice-shake");
        void el.offsetWidth;
        el.style.setProperty("--juice-shake-ms", `${e.ms ?? 260}ms`);
        el.classList.add("juice-shake");
        setTimeout(() => el.classList.remove("juice-shake"), (e.ms ?? 260) + 30);
      } else if (e.t === "flash") {
        setFlash({ color: e.color ?? "rgba(178,58,46,0.16)" });
        setTimeout(() => setFlash(null), e.ms ?? 220);
      }
    };

    const unsub = subscribeJuice(onEvent);
    return () => {
      unsub();
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[85]"
      />
      {flash && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[84] transition-opacity"
          style={{ background: flash.color }}
        />
      )}
      {pops.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="pointer-events-none fixed z-[86] font-display text-lg font-bold [animation:juice-pop_1s_cubic-bezier(0.16,0.84,0.44,1)_forwards]"
          style={{ left: p.x, top: p.y, color: p.color, transform: "translate(-50%,-50%)" }}
        >
          {p.text}
        </span>
      ))}
    </>
  );
}

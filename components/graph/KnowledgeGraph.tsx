"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { NODES, LINKS, NODE_TYPE_COLOR } from "@/content/graph";
import { useGame } from "@/lib/store";
import { t } from "@/content/i18n";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type FGNode = {
  id: string;
  label: string;
  type: keyof typeof NODE_TYPE_COLOR;
  val: number;
};

export function KnowledgeGraph() {
  const lang = useGame((s) => s.lang);
  const lit = useGame((s) => s.litNodes);
  const litSet = useMemo(() => new Set(lit), [lit]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [size, setSize] = useState({ w: 320, h: 300 });
  const pulse = useRef(0);

  const data = useMemo(() => {
    const degree: Record<string, number> = {};
    LINKS.forEach((l) => {
      degree[l.source] = (degree[l.source] ?? 0) + 1;
      degree[l.target] = (degree[l.target] ?? 0) + 1;
    });
    return {
      nodes: NODES.map<FGNode>((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        val: 1 + (degree[n.id] ?? 0) * 0.6,
      })),
      links: LINKS.map((l) => ({ ...l })),
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // keep repainting while something is lit, so the ring can pulse
  useEffect(() => {
    if (litSet.size === 0) return;
    let raf = 0;
    const loop = () => {
      pulse.current += 0.05;
      fgRef.current?.refresh?.();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [litSet]);

  useEffect(() => {
    if (litSet.size === 0 || !fgRef.current) return;
    const first = NODES.find((n) => litSet.has(n.id));
    if (first) {
      const t = setTimeout(() => fgRef.current?.centerAt?.(undefined, undefined, 600), 60);
      return () => clearTimeout(t);
    }
  }, [litSet]);

  return (
    <section className="flex h-full flex-col border border-ink/25 bg-ink/[0.03]">
      <div className="flex items-baseline justify-between border-b border-ink/20 px-4 py-2">
        <h2 className="font-display text-base text-ink">{t("graph.title", lang)}</h2>
        <span className="font-body text-[10px] text-ink-soft">{t("graph.hint", lang)}</span>
      </div>
      <div ref={wrapRef} className="relative min-h-[260px] flex-1">
        <ForceGraph2D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={120}
          d3VelocityDecay={0.32}
          nodeRelSize={4}
          linkColor={(l: any) => {
            const s = typeof l.source === "object" ? l.source.id : l.source;
            const tg = typeof l.target === "object" ? l.target.id : l.target;
            return litSet.has(s) && litSet.has(tg)
              ? "rgba(178,58,46,0.9)"
              : litSet.has(s) || litSet.has(tg)
                ? "rgba(178,58,46,0.35)"
                : "rgba(27,23,18,0.14)";
          }}
          linkWidth={(l: any) => {
            const s = typeof l.source === "object" ? l.source.id : l.source;
            const tg = typeof l.target === "object" ? l.target.id : l.target;
            return litSet.has(s) && litSet.has(tg) ? 2 : 0.6;
          }}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, scale: number) => {
            const isLit = litSet.has(node.id);
            const r = (2 + node.val) / 1.4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = isLit ? "#B23A2E" : NODE_TYPE_COLOR[node.type as FGNode["type"]];
            ctx.globalAlpha = isLit ? 1 : 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;

            if (isLit) {
              const ring = r + 3 + Math.sin(pulse.current) * 2.4;
              ctx.beginPath();
              ctx.arc(node.x, node.y, ring, 0, 2 * Math.PI);
              ctx.strokeStyle = "rgba(178,58,46,0.7)";
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }

            if (isLit || scale > 2.2) {
              const fs = Math.max(3.5, 11 / scale);
              ctx.font = `${fs}px Georgia, serif`;
              ctx.fillStyle = "#1B1712";
              ctx.textAlign = "center";
              ctx.textBaseline = "top";
              ctx.fillText(node.label, node.x, node.y + r + 2);
            }
          }}
        />
        {litSet.size === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="max-w-[22ch] text-center font-body text-xs text-ink/40">
              {t("graph.hint", lang)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

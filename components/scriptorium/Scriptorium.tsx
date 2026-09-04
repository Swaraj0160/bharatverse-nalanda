"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGame, usePachisiUnlocked } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { t } from "@/content/i18n";
import { LORE } from "@/content/lore";
import { PASSAGE_BY_ID } from "@/content/passages";
import { HudBar } from "@/components/chrome/HudBar";
import { Boot } from "@/components/chrome/Boot";
import { Reveal } from "@/components/chrome/Reveal";
import { HistorianDock } from "@/components/historian/HistorianDock";
import { KnowledgeGraph } from "@/components/graph/KnowledgeGraph";
import { Hotspot } from "@/components/scriptorium/Hotspot";
import { MissionOverlay } from "@/components/scriptorium/MissionOverlay";
import { TriageMission } from "@/components/scriptorium/missions/TriageMission";
import { TranslateMission } from "@/components/scriptorium/missions/TranslateMission";
import { CourierMission } from "@/components/scriptorium/missions/CourierMission";
import { RoadmapPanel } from "@/components/scriptorium/RoadmapPanel";
import { SealShelf } from "@/components/scriptorium/SealShelf";
import { WaxButton } from "@/components/chrome/WaxButton";

type Overlay =
  | { kind: "mission"; id: "triage" | "translate" | "courier" }
  | { kind: "lore"; id: string }
  | null;

function Station({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" y={28} className="relative mb-16 pl-8">
      <span className="absolute left-0 top-1 font-display text-xs text-hingula">{n}</span>
      <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
      <div className="mt-3 max-w-[58ch] space-y-3 font-body text-[15px] leading-relaxed text-ink-soft sm:text-base">
        {children}
      </div>
    </Reveal>
  );
}

export function Scriptorium() {
  const hydrated = useHydrated();
  const router = useRouter();
  const lang = useGame((s) => s.lang);
  const missions = useGame((s) => s.missions);
  const discovered = useGame((s) => s.discovered);
  const discover = useGame((s) => s.discover);
  const setLitNodes = useGame((s) => s.setLitNodes);
  const rating = useGame((s) => s.rating);
  const earnSeal = useGame((s) => s.earnSeal);
  const seals = useGame((s) => s.seals);
  const unlocked = usePachisiUnlocked();

  const [overlay, setOverlay] = useState<Overlay>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: hallRef, offset: ["start 0.2", "end 0.8"] });
  const rule = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (rating >= 1160 && !seals.keeper) earnSeal("keeper");
  }, [rating, seals.keeper, earnSeal]);

  const openLore = (id: string) => {
    const st = LORE.find((l) => l.id === id)!;
    discover(st.passageIds);
    const nodes = new Set<string>();
    st.passageIds.forEach((p) => PASSAGE_BY_ID[p]?.nodes.forEach((n) => nodes.add(n)));
    setLitNodes([...nodes]);
    setOverlay({ kind: "lore", id });
  };

  const loreStation = overlay?.kind === "lore" ? LORE.find((l) => l.id === overlay.id) : null;
  const allDone = missions.triage.done && missions.translate.done && missions.courier.done;

  return (
    <div className="min-h-screen">
      <Boot />
      <HudBar />

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 lg:grid-cols-[1fr_minmax(360px,430px)]">
        {/* ---- the hall (scroll-driven) ---- */}
        <div ref={hallRef} className="relative">
          <span
            aria-hidden
            className="absolute left-[3px] top-0 h-full w-px bg-ink/15"
          />
          <motion.span
            aria-hidden
            style={{ height: rule }}
            className="absolute left-[2px] top-0 w-[3px] bg-hingula/70"
          />

          <header className="mb-14 pl-8">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
              1202 CE · {t("nav.scriptorium", lang)}
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {t("app.title", lang)}
            </h1>
            <p className="mt-4 max-w-[56ch] font-body text-base italic leading-relaxed text-ink-soft">
              {t("app.tagline", lang)}
            </p>
          </header>

          <Station n="i" title={lang === "hi" ? "द्वार" : "The Entryway"}>
            <p>
              {lang === "hi"
                ? "आप गीली मिट्टी की गंध वाले गलियारे से भीतर आते हैं। दीवार पर मठ की मुहर — पहिया, दो हिरण। सात सौ वर्षों से यहाँ प्रवेश द्वार पर शास्त्रार्थ जीतने के बाद ही किसी को भीतर आने दिया जाता रहा है।"
                : "You come in through the passage that always smells of wet earth. On the wall, the monastery's seal — a wheel, two deer. For seven hundred years no one has passed this gate without first winning an argument at it."}
            </p>
          </Station>

          <Station n="ii" title={LORE[0].title[lang]}>
            <p>{LORE[0].intro[lang]}</p>
            <Hotspot
              label={LORE[0].title[lang]}
              kind="lore"
              done={hydrated && LORE[0].passageIds.every((p) => discovered.includes(p))}
              onOpen={() => openLore("archway")}
            />
          </Station>

          <Station n="iii" title={t("m.triage.name", lang)}>
            <p>{t("m.triage.desc", lang)}</p>
            <p>
              {lang === "hi"
                ? "अलमारियाँ छत तक जाती हैं। समय कम है। पढ़ो, चुनो, रखो।"
                : "The shelves run to the ceiling and the time is short. Read, choose, keep."}
            </p>
            <Hotspot
              label={
                missions.triage.done
                  ? t("m.triage.name", lang)
                  : lang === "hi"
                    ? "छँटाई खेलें"
                    : "Play the Sorting"
              }
              kind="mission"
              done={missions.triage.done}
              onOpen={() => router.push("/play/sorting-1")}
            />
          </Station>

          <Station n="iv" title={t("m.translate.name", lang)}>
            <p>{t("m.translate.desc", lang)}</p>
            <Hotspot
              label={
                missions.translate.done
                  ? t("m.translate.name", lang)
                  : lang === "hi"
                    ? "पुनर्रचना खेलें"
                    : "Play the Reconstruction"
              }
              kind="mission"
              done={missions.translate.done}
              onOpen={() => router.push("/play/reconstruction-1")}
            />
          </Station>

          <Station n="v" title={LORE[1].title[lang]}>
            <p>{LORE[1].intro[lang]}</p>
            <Hotspot
              label={LORE[1].title[lang]}
              kind="lore"
              done={hydrated && LORE[1].passageIds.every((p) => discovered.includes(p))}
              onOpen={() => openLore("window")}
            />
          </Station>

          <Station n="vi" title={LORE[2].title[lang]}>
            <p>{LORE[2].intro[lang]}</p>
            <Hotspot
              label={LORE[2].title[lang]}
              kind="lore"
              done={hydrated && LORE[2].passageIds.every((p) => discovered.includes(p))}
              onOpen={() => openLore("chest")}
            />
          </Station>

          <Station n="vii" title={t("m.courier.name", lang)}>
            <p>{t("m.courier.desc", lang)}</p>
            <Hotspot
              label={t("m.courier.name", lang)}
              kind="mission"
              done={missions.courier.done}
              onOpen={() => setOverlay({ kind: "mission", id: "courier" })}
            />
          </Station>

          {hydrated && allDone && (
            <section className="mb-8 ml-8 border border-ink/30 bg-leaf-deep/40 p-5">
              <h2 className="font-display text-2xl text-ink">
                {lang === "hi" ? "रात का काम पूरा हुआ" : "The night's work is done"}
              </h2>
              <p className="mt-2 max-w-[52ch] font-body text-sm text-ink-soft">
                {lang === "hi"
                  ? "जो जाना था, चला गया। भोर से पहले कुछ देर है — व्यापारी वस्त्र बिछाता है।"
                  : "What was going has gone. There is an hour before dawn — the merchant lays out the cloth."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/pachisi">
                  <WaxButton>{t("nav.pachisi", lang)}</WaxButton>
                </Link>
                <Link href="/journal">
                  <WaxButton tone="quiet">{t("nav.journal", lang)}</WaxButton>
                </Link>
              </div>
            </section>
          )}

          <div className="pl-8">
            <RoadmapPanel />
            <SealShelf />
          </div>
        </div>

        {/* ---- the dock ---- */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[57px] lg:h-[calc(100vh-73px)]">
          <div className="h-[460px] lg:h-auto lg:flex-1 lg:min-h-0">
            <HistorianDock />
          </div>
          <div className="h-[320px] lg:h-[38%] lg:shrink-0">
            <KnowledgeGraph />
          </div>
        </aside>
      </div>

      {/* ---- overlays ---- */}
      <MissionOverlay
        open={overlay?.kind === "mission" && overlay.id === "triage"}
        onClose={() => setOverlay(null)}
        title={t("m.triage.name", lang)}
        subtitle={t("m.triage.desc", lang)}
      >
        <TriageMission onDone={() => setOverlay(null)} />
      </MissionOverlay>

      <MissionOverlay
        open={overlay?.kind === "mission" && overlay.id === "translate"}
        onClose={() => setOverlay(null)}
        title={t("m.translate.name", lang)}
        subtitle={t("m.translate.desc", lang)}
      >
        <TranslateMission onDone={() => setOverlay(null)} />
      </MissionOverlay>

      <MissionOverlay
        open={overlay?.kind === "mission" && overlay.id === "courier"}
        onClose={() => setOverlay(null)}
        title={t("m.courier.name", lang)}
        subtitle={t("m.courier.desc", lang)}
      >
        <CourierMission onDone={() => setOverlay(null)} />
      </MissionOverlay>

      <MissionOverlay
        open={overlay?.kind === "lore"}
        onClose={() => setOverlay(null)}
        title={loreStation?.title[lang] ?? ""}
        subtitle={loreStation?.intro[lang]}
      >
        <div className="space-y-4">
          {loreStation?.passageIds.map((pid) => {
            const p = PASSAGE_BY_ID[pid];
            if (!p) return null;
            return (
              <div key={pid} className="border-l-2 border-hingula/30 pl-4">
                <h3 className="font-display text-[15px] text-ink">{p.title}</h3>
                <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-soft">{p.text}</p>
                <p className="mt-1.5 font-body text-[11px] italic text-ink/55">{p.source}</p>
              </div>
            );
          })}
          <p className="pt-2 font-body text-xs text-ink-soft">
            {lang === "hi"
              ? "ये अंश अब इतिहासकार के पास उपलब्ध हैं और सारणी में प्रकाशित हैं।"
              : "These passages are now available to the Historian and lit in the graph."}
          </p>
        </div>
      </MissionOverlay>
    </div>
  );
}

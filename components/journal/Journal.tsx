"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useGame, useRankTier } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { t } from "@/content/i18n";
import { BUNDLES, ROUTES } from "@/content/missions";
import { PASSAGE_BY_ID } from "@/content/passages";
import { HudBar } from "@/components/chrome/HudBar";
import { Boot } from "@/components/chrome/Boot";
import { WaxButton } from "@/components/chrome/WaxButton";
import { SEALS } from "@/components/scriptorium/SealShelf";

export function Journal() {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const router = useRouter();
  const lang = useGame((s) => s.lang);
  const missions = useGame((s) => s.missions);
  const discovered = useGame((s) => s.discovered);
  const seals = useGame((s) => s.seals);
  const rating = useGame((s) => s.rating);
  const resetAll = useGame((s) => s.resetAll);
  const tier = useRankTier();
  const cardRef = useRef<HTMLDivElement>(null);

  const kept = BUNDLES.filter((b) => missions.triage.kept.includes(b.id));
  const route = ROUTES.find((r) => r.id === missions.courier.routeId);
  const learned = discovered
    .map((id) => PASSAGE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 8);
  const earnedSeals = SEALS.filter((s) => seals[s.id]);

  const savePng = async () => {
    const el = cardRef.current;
    if (!el) return;
    const W = 1200;
    const H = 1500;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#E8D6B0";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1B1712";
    ctx.font = "600 58px Georgia, serif";
    ctx.fillText("The Lost Library of Nalanda", 80, 130);
    ctx.strokeStyle = "rgba(27,23,18,0.4)";
    ctx.beginPath();
    ctx.moveTo(80, 165);
    ctx.lineTo(760, 165);
    ctx.stroke();
    ctx.font = "italic 30px Georgia, serif";
    ctx.fillText("a colophon — 1202 CE", 80, 210);

    let y = 300;
    const line = (s: string, size = 30, color = "#4A3F33") => {
      ctx.fillStyle = color;
      ctx.font = `${size}px Georgia, serif`;
      ctx.fillText(s, 80, y);
      y += size + 22;
    };
    line("Carried out of the hall:", 34, "#B23A2E");
    kept.forEach((b) => line("· " + b.title.en));
    y += 20;
    line("The courier's road:", 34, "#B23A2E");
    line("· " + (route ? route.name.en : "—"));
    y += 20;
    line("Set down in this hand:", 34, "#B23A2E");
    line(`· ${discovered.length} grounded passages consulted`);
    line(`· ${learned.map((p) => p.title).slice(0, 4).join("; ")}`);
    y += 20;
    line("Seals pressed:", 34, "#B23A2E");
    line("· " + (earnedSeals.map((s) => s.label.en).join("  ·  ") || "none"));
    y += 30;
    line(`Scribe's rank: ${tier.title.en} (${Math.round(rating)})`, 34, "#1B1712");
    ctx.font = "22px Georgia, serif";
    ctx.fillStyle = "rgba(27,23,18,0.5)";
    ctx.fillText("BHARATVERSE · grounded heritage play · no source, no answer", 80, H - 80);

    await new Promise<void>((res) =>
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "nalanda-colophon.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        res();
      }, "image/png"),
    );
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen">
        <HudBar />
        <p className="p-8 font-body text-sm text-ink-soft">…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Boot />
      <HudBar back={{ href: "/scriptorium", label: t("nav.scriptorium", lang) }} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <motion.div
          ref={cardRef}
          initial={reduce ? false : { opacity: 0, rotateX: -40, y: -20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
          style={{ transformOrigin: "top center", transformPerspective: 1200 }}
          className="border border-ink/30 bg-leaf p-8 shadow-leaf"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
            {t("journal.title", lang)} · 1202 CE
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">{t("app.title", lang)}</h1>
          <div className="my-5 h-px w-40 bg-ink/40" />

          <Section label={t("journal.saved", lang)}>
            {kept.length ? (
              <ul className="space-y-1">
                {kept.map((b) => (
                  <li key={b.id} className="font-body text-[15px] text-ink">
                    · {b.title[lang]}{" "}
                    <span className="text-ink-soft">— {b.subject[lang]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-sm italic text-ink-soft">
                {lang === "hi" ? "अभी कुछ नहीं" : "nothing yet"}
              </p>
            )}
            {route && (
              <p className="mt-2 font-body text-sm text-ink-soft">
                {lang === "hi" ? "मार्ग: " : "Road: "}
                <span className="text-ink">{route.name[lang]}</span>
              </p>
            )}
          </Section>

          <Section label={t("journal.learned", lang)}>
            <p className="font-body text-sm text-ink-soft">
              {lang === "hi"
                ? `${discovered.length} आधारित अंश देखे गए।`
                : `${discovered.length} grounded passages consulted.`}
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {learned.map((p) => (
                <li
                  key={p.id}
                  className="border border-ink/20 px-1.5 py-0.5 font-body text-[11px] text-ink-soft"
                >
                  {p.title}
                </li>
              ))}
            </ul>
          </Section>

          <Section label={t("journal.seals", lang)}>
            <div className="flex flex-wrap gap-2">
              {earnedSeals.length ? (
                earnedSeals.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 border border-ink/30 bg-hingula/10 px-2 py-1 font-body text-[12px] text-ink"
                  >
                    <span aria-hidden>{s.glyph}</span>
                    {s.label[lang]}
                  </span>
                ))
              ) : (
                <span className="font-body text-sm italic text-ink-soft">
                  {lang === "hi" ? "कोई नहीं" : "none"}
                </span>
              )}
            </div>
          </Section>

          <div className="mt-6 border-t border-ink/20 pt-4">
            <span className="font-body text-xs uppercase tracking-widest text-ink-soft">
              {t("hud.rank", lang)}
            </span>
            <p className="font-display text-xl text-hingula">
              {tier.title[lang]}{" "}
              <span className="tabular-nums text-ink-soft">{Math.round(rating)}</span>
            </p>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-3">
          <WaxButton onClick={savePng}>{t("journal.export", lang)}</WaxButton>
          <Link href="/pachisi">
            <WaxButton tone="leaf">{t("nav.pachisi", lang)}</WaxButton>
          </Link>
          <WaxButton
            tone="quiet"
            onClick={() => {
              resetAll();
              router.push("/");
            }}
          >
            {t("journal.restart", lang)}
          </WaxButton>
        </div>
      </main>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="mb-1.5 font-display text-sm uppercase tracking-widest text-ink">{label}</h2>
      {children}
    </div>
  );
}

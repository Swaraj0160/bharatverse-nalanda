"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import { SITE_BY_ID } from "@/content/heritage";
import { ShellNav } from "@/components/shell/ShellNav";
import { BharatGuide } from "@/components/guide/BharatGuide";
import { fmt } from "@/lib/konark";

const WheelScene = dynamic(
  () => import("@/components/lens/WheelScene").then((m) => m.WheelScene),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center font-body text-sm text-stone-deep">
        <span className="animate-spin text-2xl">◈</span>
      </div>
    ),
  },
);

type ArTier = "ar" | "camera" | "3d" | "none";

function detectTier(): ArTier {
  if (typeof window === "undefined") return "3d";
  
  // Relaxed the WebGL check to prevent false positives on desktop
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
  if (!gl) return "none";
  
  const xr = (navigator as unknown as { xr?: unknown }).xr;
  if (typeof xr !== "undefined" && xr) return "ar";
  if (typeof navigator.mediaDevices?.getUserMedia === "function") return "camera";
  
  return "3d"; // Default fallback is now 3D, not 'none'
}

const TIER_LABEL: Record<ArTier, { en: string; hi: string }> = {
  ar: { en: "AR Ready", hi: "एआर तैयार" },
  camera: { en: "AR (camera)", hi: "एआर (कैमरा)" },
  "3d": { en: "3D Experience", hi: "त्रि-आयामी" },
  none: { en: "Illustrated", hi: "चित्रित" },
};

export function LensPage({ siteId }: { siteId: string }) {
  const lang = useGame((s) => s.lang);
  const site = SITE_BY_ID[siteId];
  const [tier, setTier] = useState<ArTier>("3d");
  const [minutes, setMinutes] = useState(9 * 60 + 40);
  const [layer, setLayer] = useState("all");
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => setTier(detectTier()), []);

  // Removed the strict `hasWheel` boolean that was blocking other sites

  if (!site) {
    return (
      <div>
        <ShellNav />
        <p className="p-10 text-center font-body text-sm text-stone-deep">No such site.</p>
      </div>
    );
  }

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[1100px] px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/site/${site.id}`} className="font-body text-xs text-stone-deep hover:text-ink">
            ← {site.name[lang]}
          </Link>
          <span
            className={clsx(
              "ml-auto border px-2 py-0.5 font-display text-[11px] uppercase tracking-wide",
              tier === "ar"
                ? "border-terreverte/60 text-terreverte"
                : tier === "none"
                  ? "border-hingula/60 text-hingula"
                  : "border-stone-deep/50 text-stone-deep",
            )}
          >
            {TIER_LABEL[tier][lang]}
          </span>
        </div>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* stage */}
          <div className="relative aspect-[4/3] border border-stone-deep/40 bg-sandstone-deep/40">
            {/* Forced rendering of the 3D scene as long as the device isn't strictly 'none' */}
            {tier !== "none" ? (
              <WheelScene minutes={minutes} layer={layer} />
            ) : (
              <div className="grid h-full place-items-center p-6 text-center font-body text-sm text-ink-soft">
                {lang === "hi"
                  ? "इस उपकरण पर त्रि-आयामी दृश्य उपलब्ध नहीं — नीचे स्थापत्य-एक्स-रे 2D आरेख के रूप में देखें।"
                  : "3D is unavailable on this device — see the architecture X-Ray below as a 2D diagram."}
              </div>
            )}
            {tier === "camera" && (
              <p className="absolute bottom-2 left-2 right-2 bg-ink/70 px-2 py-1 text-center font-body text-[11px] text-sandstone">
                {lang === "hi"
                  ? "इस उपकरण पर सच्चा WebXR नहीं; कैमरा-संयोजन विधा प्रदर्शन हेतु। कोई नकली एआर नहीं।"
                  : "No true WebXR on this device; camera-composite is shown for the demo. No fake AR."}
              </p>
            )}
          </div>

          {/* controls / x-ray */}
          <div>
            <h2 className="font-display text-lg text-ink">
              {lang === "hi" ? "स्थापत्य एक्स-रे" : "Architecture X-Ray"}
            </h2>
            <p className="font-body text-[12px] text-stone-deep">
              {lang === "hi" ? "एक परत चुनें" : "Isolate a layer"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <LayerBtn id="all" label={{ en: "Whole structure", hi: "पूरा ढांचा" }} cur={layer} set={setLayer} />
              {site.layers?.map((l) => (
                <LayerBtn key={l.id} id={l.id} label={l.label} cur={layer} set={setLayer} />
              ))}
            </div>

            <div className="mt-4">
              <p className="font-body text-[12px] text-stone-deep">
                {lang === "hi" ? "सूर्य को घुमाएँ — छाया चलती है" : "Move the sun — the shadow follows"}
              </p>
              <input
                type="range"
                min={0}
                max={1439}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full accent-hingula"
              />
              <p className="font-display text-sm text-ink">{fmt(minutes)}</p>
            </div>

            <div className="mt-4 space-y-2">
              {site.hotspots?.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setFocused(focused === h.id ? null : h.id)}
                  className={clsx(
                    "block w-full border p-2 text-left transition-colors",
                    focused === h.id
                      ? "border-hingula bg-hingula/10"
                      : "border-stone-deep/25 hover:border-hingula/40",
                  )}
                >
                  <span className="font-display text-[13px] text-ink">{h.label[lang]}</span>
                  {focused === h.id && (
                    <div className="mt-1.5 space-y-1 font-body text-[12px] leading-snug">
                      <p>
                        <b className="text-stone-deep">{lang === "hi" ? "क्या" : "What"}:</b>{" "}
                        {h.what[lang]}
                      </p>
                      <p>
                        <b className="text-stone-deep">{lang === "hi" ? "क्यों" : "Why"}:</b>{" "}
                        {h.why[lang]}
                      </p>
                      <p>
                        <b className="text-stone-deep">{lang === "hi" ? "कैसे" : "How"}:</b>{" "}
                        {h.how[lang]}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Link
              href={site.games && site.games[0] ? `/play/${site.games[0]}` : "/games"}
              className="mt-4 inline-block border border-ink/40 bg-hingula px-4 py-2 font-display text-sm text-sandstone"
            >
              {lang === "hi" ? "अब इसे खेलें →" : "Now play it →"}
            </Link>
          </div>
        </div>
      </main>

      <BharatGuide
        siteId={site.id}
        screen="lens"
        focusedElement={
          focused ? site.hotspots?.find((h) => h.id === focused)?.label.en : undefined
        }
      />
    </div>
  );
}

function LayerBtn({
  id,
  label,
  cur,
  set,
}: {
  id: string;
  label: { en: string; hi: string };
  cur: string;
  set: (s: string) => void;
}) {
  const lang = useGame((s) => s.lang);
  return (
    <button
      onClick={() => set(id)}
      className={clsx(
        "border px-2 py-1 font-display text-[12px] transition-colors",
        cur === id
          ? "border-hingula bg-hingula/10 text-ink"
          : "border-stone-deep/30 text-ink-soft hover:text-ink",
      )}
    >
      {label[lang]}
    </button>
  );
}
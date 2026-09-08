"use client";

import Link from "next/link";
import { useGame } from "@/lib/store";
import { SITES } from "@/content/heritage";
import { ShellNav } from "@/components/shell/ShellNav";
import { WaxButton } from "@/components/chrome/WaxButton";

const STEPS = [
  { n: 1, en: "Discover", hi: "खोजें" },
  { n: 2, en: "See", hi: "देखें" },
  { n: 3, en: "Interact", hi: "छुएँ" },
  { n: 4, en: "Play", hi: "खेलें" },
  { n: 5, en: "Learn", hi: "सीखें" },
  { n: 6, en: "Collect", hi: "संचित करें" },
];


function merge(r: { className: string; style: React.CSSProperties }, extra: string) {
  return { className: `${r.className} ${extra}`, style: r.style };
}

export function BharatLanding() {
  const lang = useGame((s) => s.lang);
  const rise = (d: number) => ({
    className: "rise-in",
    style: { animationDelay: `${d}s` } as React.CSSProperties,
  });

  return (
    <div>
      <ShellNav />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-stone-deep/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #E7D3AC 0%, #D9C29A 45%, #C4A97B 100%)",
          }}
        />
        {/* authored wheel-spoke motif, not a stock gradient blob */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-16 -top-16 -z-10 h-[420px] w-[420px] opacity-[0.14]"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2="4"
              stroke="#1B1712"
              strokeWidth={i % 2 ? 1.5 : 4}
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="96" fill="none" stroke="#1B1712" strokeWidth="3" />
          <circle cx="100" cy="100" r="14" fill="#1B1712" />
        </svg>

        <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
          <p
            {...rise(0)}
            className="font-body text-xs uppercase tracking-[0.34em] text-hingula"
          >
            {lang === "hi" ? "भारत की विरासत, खेली जाने वाली" : "India's heritage, made playable"}
          </p>
          <h1
            {...rise(0.06)}
            className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl"
          >
            {lang === "hi" ? "भारत केवल इतिहास नहीं है।" : "India isn't just history."}
            <br />
            <span className="text-hingula">
              {lang === "hi" ? "इसे खेलिए।" : "Play it."}
            </span>
          </h1>
          <p
            {...rise(0.12)}
            className="mt-5 max-w-xl font-body text-lg leading-relaxed text-ink-soft"
          >
            {lang === "hi"
              ? "एक अंतःक्रियात्मक विरासत-खेल जगत। कोणार्क के पहिये से समय पढ़िए, ढहे शिखर को फिर खड़ा कीजिए, नालंदा की एक रात जिएँ। हर उत्तर का स्रोत दिखता है — स्रोत नहीं, तो उत्तर नहीं।"
              : "An interactive heritage game world. Read the time off the Konark wheel, rebuild a fallen tower, live one night at Nalanda. Every answer shows its source — and when there is no source, there is no answer."}
          </p>
          <div {...merge(rise(0.18), "mt-8 flex flex-wrap gap-3")}>
            <Link href="/explore">
              <WaxButton>{lang === "hi" ? "भारतवर्स में प्रवेश" : "Enter BharatVerse"}</WaxButton>
            </Link>
            <Link href="/judge">
              <WaxButton tone="quiet">{lang === "hi" ? "जज मोड" : "Judge mode"}</WaxButton>
            </Link>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-[1180px] px-6 py-14">
        <h2 {...merge(rise(0), "font-display text-2xl text-ink")}>
          {lang === "hi" ? "यह कैसे चलता है" : "How it works"}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              {...merge(rise(0.04 * i), "border border-stone-deep/25 bg-sandstone/50 p-3")}
            >
              <span className="font-display text-2xl text-hingula">{s.n}</span>
              <p className="mt-1 font-display text-sm text-ink">
                {lang === "hi" ? s.hi : s.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* featured sites */}
      <section className="mx-auto max-w-[1180px] px-6 pb-16">
        <h2 {...merge(rise(0), "font-display text-2xl text-ink")}>
          {lang === "hi" ? "विरासत स्थल" : "Featured heritage"}
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {SITES.map((site, i) => (
            <div key={site.id} {...rise(0.05 * i)}>
              <Link
                href={`/site/${site.id}`}
                className="group block h-full border border-stone-deep/25 bg-sandstone/40 p-5 transition-colors hover:border-hingula/50"
              >
                <span
                  className="inline-block h-1.5 w-10"
                  style={{ background: site.accent }}
                />
                <h3 className="mt-3 font-display text-xl text-ink">{site.name[lang]}</h3>
                <p className="font-body text-xs italic text-stone-deep">
                  {site.epithet[lang]}
                </p>
                <p className="mt-2 line-clamp-4 font-body text-[13px] leading-snug text-ink-soft">
                  {site.summary[lang]}
                </p>
                <p className="mt-3 font-body text-[11px] uppercase tracking-wide text-hingula">
                  {site.state} · {site.games.length} {lang === "hi" ? "खेल" : "games"} →
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-deep/20 px-6 py-8 text-center font-body text-[11px] text-stone-deep">
        SIH 2026 · PS SIH26208 · built for the Toys &amp; Games theme · every fact is
        source-labelled, every game runs offline
      </footer>
    </div>
  );
}

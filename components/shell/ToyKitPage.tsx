"use client";

import { useGame } from "@/lib/store";
import { ShellNav } from "@/components/shell/ShellNav";

/**
 * PAPER TOY KIT — the physical "toy" half of Toys & Games.
 *
 * A printable cut-and-fold Konark chariot wheel whose printed face doubles as a
 * scannable marker. It is browser-printable (window.print on an A4-styled
 * sheet) — no PDF dependency, no asset to license. The marker pattern is the
 * same authored spoke geometry used everywhere else.
 */
export function ToyKitPage() {
  const lang = useGame((s) => s.lang);

  return (
    <div>
      <div className="print:hidden">
        <ShellNav />
      </div>
      <main className="mx-auto max-w-[820px] px-6 py-8 print:py-0">
        <div className="print:hidden">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
            {lang === "hi" ? "कागज़ खिलौना किट" : "Paper toy kit"}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            {lang === "hi" ? "कोणार्क का पहिया — काटिए, मोड़िए" : "The Konark wheel — cut and fold"}
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-ink-soft">
            {lang === "hi"
              ? "इसे सादे A4 पर छापिए। मोटी बाहरी रेखा पर काटिए, धुरी पर एक तीली लगाइए, और आपके पास एक असली धूपघड़ी है — वही ज्यामिति जो खेल में है। बिना उपकरण वाली कक्षाओं के लिए।"
              : "Print this on plain A4. Cut the heavy outline, push a matchstick through the axle, and you have a working sundial — the same geometry as the game. Made for classrooms with no devices."}
          </p>
          <button
            onClick={() => window.print()}
            className="mt-5 border border-ink/40 bg-hingula px-4 py-2 font-display text-sm text-sandstone"
          >
            {lang === "hi" ? "छापें" : "Print this sheet"}
          </button>
        </div>

        {/* the printable sheet */}
        <div className="mt-8 border border-stone-deep/40 bg-white p-6 print:mt-0 print:border-0">
          <svg viewBox="0 0 400 400" className="mx-auto block w-full max-w-[520px]">
            {/* cut outline */}
            <circle cx="200" cy="200" r="188" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="200" cy="200" r="176" fill="none" stroke="#000" strokeWidth="3" />
            {/* 8 major + 8 minor spokes */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={i}
                x1="200"
                y1="200"
                x2="200"
                y2="30"
                stroke="#000"
                strokeWidth={i % 2 ? 2 : 6}
                transform={`rotate(${i * 22.5} 200 200)`}
              />
            ))}
            {/* rim bead ticks */}
            {Array.from({ length: 96 }).map((_, i) => {
              const a = (i / 96) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={200 + Math.cos(a) * 168}
                  cy={200 + Math.sin(a) * 168}
                  r="2.2"
                  fill="#000"
                />
              );
            })}
            {/* hour labels, anticlockwise from midnight at top */}
            {Array.from({ length: 8 }).map((_, i) => {
              const mins = i * 180;
              const deg = -90 - mins * 0.25;
              const a = (deg * Math.PI) / 180;
              const hh = String(Math.floor(mins / 60)).padStart(2, "0");
              return (
                <text
                  key={i}
                  x={200 + Math.cos(a) * 196}
                  y={200 + Math.sin(a) * 196}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontFamily="Georgia, serif"
                >
                  {hh}:00
                </text>
              );
            })}
            {/* axle hole */}
            <circle cx="200" cy="200" r="8" fill="none" stroke="#000" strokeWidth="2" />
            <line x1="194" y1="200" x2="206" y2="200" stroke="#000" strokeWidth="1" />
            <line x1="200" y1="194" x2="200" y2="206" stroke="#000" strokeWidth="1" />
            <text x="200" y="360" textAnchor="middle" fontSize="11" fontFamily="Georgia, serif">
              BHARATVERSE · Konark sundial · read anticlockwise · midnight at the top
            </text>
          </svg>
        </div>
      </main>
    </div>
  );
}

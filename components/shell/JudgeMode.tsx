"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useGame } from "@/lib/store";
import { ShellNav } from "@/components/shell/ShellNav";
import { BharatGuide } from "@/components/guide/BharatGuide";
import { WaxButton } from "@/components/chrome/WaxButton";

type Step = {
  n: string;
  en: string;
  hi: string;
  detail: { en: string; hi: string };
  href?: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    en: "Heritage discovery",
    hi: "विरासत की खोज",
    detail: {
      en: "Open Explore. Filter by region or category. Three sites, each source-labelled Verified.",
      hi: "एक्सप्लोर खोलें। क्षेत्र या श्रेणी से छाँटें। तीन स्थल, प्रत्येक 'सत्यापित' चिह्नित।",
    },
    href: "/explore",
  },
  {
    n: "02",
    en: "The 3D monument",
    hi: "त्रि-आयामी स्मारक",
    detail: {
      en: "Open the Konark Lens. The chariot wheel is authored geometry — 8 major spokes, 8 minor, a beaded rim — not a downloaded mesh.",
      hi: "कोणार्क लेंस खोलें। रथ का पहिया रचित ज्यामिति है — 8 मुख्य अरे, 8 गौण, मणिकित परिधि — डाउनलोड की गई जाली नहीं।",
    },
    href: "/lens/konark",
  },
  {
    n: "03",
    en: "AR, honestly tiered",
    hi: "एआर, ईमानदारी से स्तरित",
    detail: {
      en: "The Lens labels itself for your device: AR Ready, AR (camera), or 3D Experience. The visitor never sees a broken camera.",
      hi: "लेंस आपके उपकरण के लिए स्वयं को चिह्नित करता है: AR Ready, AR (camera), या 3D Experience। दर्शक को कभी टूटा कैमरा नहीं दिखता।",
    },
    href: "/lens/konark",
  },
  {
    n: "04",
    en: "Ask the Bharat Guide",
    hi: "भारत गाइड से पूछें",
    detail: {
      en: "Ask 'why is Konark shaped like a chariot?'. The answer arrives with an inline source chip on every factual sentence.",
      hi: "पूछें 'कोणार्क रथ जैसा क्यों है?'। उत्तर हर तथ्य-वाक्य पर स्रोत-चिह्न के साथ आता है।",
    },
  },
  {
    n: "05",
    en: "The refusal — a feature",
    hi: "अस्वीकृति — एक विशेषता",
    detail: {
      en: "Now ask the Guide 'who won the 2011 Cricket World Cup?'. It refuses: no citations, and 'No source, no answer.' This is deliberate.",
      hi: "अब गाइड से पूछें '2011 का क्रिकेट विश्व कप किसने जीता?'। यह मना करता है: कोई उद्धरण नहीं, और 'स्रोत नहीं, तो उत्तर नहीं।' यह जानबूझकर है।",
    },
  },
  {
    n: "06",
    en: "Play Shadow & Stone",
    hi: "'छाया और पत्थर' खेलें",
    detail: {
      en: "Read the axle's shadow off the wheel. Level 3 is accurate to the rim beads — three minutes each. A real skill from a real monument.",
      hi: "पहिये से धुरी की छाया पढ़ें। स्तर 3 परिधि की मणियों तक सटीक है — प्रत्येक तीन मिनट। एक असली कौशल, एक असली स्मारक से।",
    },
    href: "/play/shadow-1",
  },
  {
    n: "07",
    en: "Learning, tracked honestly",
    hi: "सीख, ईमानदारी से दर्ज",
    detail: {
      en: "Progress is Discovered → Explored → Practiced → Mastered, earned by challenge completion, driven by an Elo model — not by minutes logged.",
      hi: "प्रगति है खोजा → घूमा → अभ्यस्त → निपुण, चुनौती पूरी करने से अर्जित, एक Elo मॉडल द्वारा संचालित — दर्ज मिनटों से नहीं।",
    },
    href: "/games",
  },
  {
    n: "08",
    en: "Passport & impact",
    hi: "पासपोर्ट और प्रभाव",
    detail: {
      en: "A stamp per site, mastery per site, badges. All of it persists offline. No signup was ever required.",
      hi: "प्रति स्थल एक मुहर, प्रति स्थल निपुणता, उपाधियाँ। सब कुछ ऑफ़लाइन बना रहता है। कभी साइनअप की ज़रूरत नहीं पड़ी।",
    },
    href: "/passport",
  },
];

export function JudgeMode() {
  const lang = useGame((s) => s.lang);
  const resetAll = useGame((s) => s.resetAll);
  const setDemoPref = useGame((s) => s.setDemoPref);
  const [i, setI] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setI((v) => Math.min(STEPS.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = STEPS[i];

  return (
    <div>
      <ShellNav />
      <main className="mx-auto max-w-[820px] px-6 py-10">
        <div className="flex items-center justify-between">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-hingula">
            {lang === "hi" ? "जज मोड" : "Judge mode"}
          </p>
          <button
            onClick={() => {
              resetAll();
              setDemoPref(true);
              setI(0);
            }}
            className="border border-stone-deep/40 px-2.5 py-1 font-display text-xs text-ink-soft hover:text-hingula"
          >
            {lang === "hi" ? "डेमो रीसेट करें" : "Reset demo state"}
          </button>
        </div>

        <div className="mt-3 flex gap-1">
          {STEPS.map((s, k) => (
            <button
              key={s.n}
              onClick={() => setI(k)}
              className={clsx(
                "h-1.5 flex-1 transition-colors",
                k <= i ? "bg-hingula" : "bg-stone-deep/25",
              )}
              aria-label={`step ${s.n}`}
            />
          ))}
        </div>

        <div className="mt-8 border border-stone-deep/30 bg-sandstone/40 p-8">
          <p className="font-display text-5xl text-hingula/30">{step.n}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">
            {lang === "hi" ? step.hi : step.en}
          </h1>
          <p className="mt-4 max-w-xl font-body text-[15px] leading-relaxed text-ink-soft">
            {lang === "hi" ? step.detail.hi : step.detail.en}
          </p>
          {step.href && (
            <Link href={step.href} className="mt-5 inline-block">
              <WaxButton>{lang === "hi" ? "यह खोलें" : "Open this"}</WaxButton>
            </Link>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between font-body text-sm">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            className="text-ink-soft hover:text-ink disabled:opacity-30"
          >
            ← {lang === "hi" ? "पिछला" : "Prev"}
          </button>
          <span className="text-stone-deep">
            {i + 1} / {STEPS.length}
          </span>
          <button
            onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
            disabled={i === STEPS.length - 1}
            className="text-ink-soft hover:text-ink disabled:opacity-30"
          >
            {lang === "hi" ? "अगला" : "Next"} →
          </button>
        </div>
        <p className="mt-2 text-center font-body text-[11px] text-stone-deep">
          {lang === "hi" ? "← → कुंजियों से भी चल सकते हैं" : "arrow keys also step"}
        </p>
      </main>

      <BharatGuide siteId="konark" screen="judge" defaultOpen />
    </div>
  );
}

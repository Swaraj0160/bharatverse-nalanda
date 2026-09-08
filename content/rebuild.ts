/**
 * REBUILD INDIA — component sets for reconstructing a monument's section.
 *
 * A monument is a stack of named courses from footing to finial. Each course has
 * a width (fraction of base) and a correct order index. The player rebuilds it
 * bottom-up: a course is structurally sound only if it rests on the one below
 * with enough bearing (centre within the lower course's span) — no floating
 * mass, no load carried on a void.
 *
 * Profiles follow real building logic (a Kalinga deul: pitha → bada → gandi →
 * mastaka), simplified to a teachable stack.
 */

export type Course = {
  id: string;
  name: { en: string; hi: string };
  /** width as a fraction of the widest course */
  w: number;
  /** correct height of this course as a fraction of total */
  h: number;
  note: { en: string; hi: string };
};

export type RebuildProfile = {
  id: string;
  title: { en: string; hi: string };
  /** ordered footing → finial */
  courses: Course[];
  source: string;
};

export const PROFILES: Record<string, RebuildProfile> = {
  konarkDeul: {
    id: "konarkDeul",
    title: { en: "The Konark sanctuary tower", hi: "कोणार्क का गर्भगृह-शिखर" },
    source:
      "Published studies of Kalinga (Odishan) temple form: pitha, bada, gandi and mastaka divisions; Archaeological Survey of India site records for Konark",
    courses: [
      {
        id: "pitha",
        name: { en: "Pitha — the platform", hi: "पीठ — अधिष्ठान" },
        w: 1.0,
        h: 0.16,
        note: {
          en: "The broad footing. Everything above transfers its load to this; it must be widest.",
          hi: "चौड़ा आधार। ऊपर का सारा भार यहीं आता है; यह सबसे चौड़ा होना चाहिए।",
        },
      },
      {
        id: "bada",
        name: { en: "Bada — the wall", hi: "बाड़ — भित्ति" },
        w: 0.82,
        h: 0.3,
        note: {
          en: "The cubical wall of the sanctum, carried straight down onto the platform.",
          hi: "गर्भगृह की घनाकार भित्ति, सीधे अधिष्ठान पर टिकी।",
        },
      },
      {
        id: "gandi",
        name: { en: "Gandi — the curving tower", hi: "गंडी — वक्र शिखर" },
        w: 0.66,
        h: 0.34,
        note: {
          en: "The tall curvilinear spire. It steps inward, so its mass stays over the wall below.",
          hi: "ऊँचा वक्ररेखीय शिखर। भीतर की ओर सिमटता है ताकि भार नीचे की भित्ति पर बना रहे।",
        },
      },
      {
        id: "beki",
        name: { en: "Beki — the neck", hi: "बेकी — ग्रीवा" },
        w: 0.4,
        h: 0.06,
        note: {
          en: "A short recessed neck that gathers the tower before the crowning stones.",
          hi: "एक छोटी अंतर्गत ग्रीवा जो मुकुट-शिलाओं से पहले शिखर को समेटती है।",
        },
      },
      {
        id: "amalaka",
        name: { en: "Amalaka — the ribbed stone", hi: "आमलक — पर्युक्त शिला" },
        w: 0.5,
        h: 0.1,
        note: {
          en: "The great fluted disc. Wider than the neck, so it must sit centred or it topples.",
          hi: "बड़ी धारीदार चक्रिका। ग्रीवा से चौड़ी, अतः केंद्रित बैठनी चाहिए वरना गिर जाए।",
        },
      },
      {
        id: "kalasha",
        name: { en: "Kalasha — the finial pot", hi: "कलश — शिखर-घट" },
        w: 0.22,
        h: 0.14,
        note: {
          en: "The crowning vase. Light, small, and last — never load-bearing.",
          hi: "शीर्ष कलश। हलका, छोटा, और अंतिम — कभी भार-वाहक नहीं।",
        },
      },
    ],
  },
};

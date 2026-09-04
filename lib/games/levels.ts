import type { LevelDef, CampaignEntry } from "@/lib/games/types";

/**
 * The campaign. Each entry is a node on the world map. `playable` is flipped on
 * as each phase lands; until then a node shows "coming soon" but the ladder and
 * map are already wired.
 */
export const LEVELS: LevelDef[] = [
  /* ---------- Arc I — The Night's Work ---------- */
  {
    id: "sorting-1",
    game: "sorting",
    index: 1,
    arc: "The Night's Work",
    title: { en: "First Watch", hi: "पहला पहर" },
    blurb: {
      en: "The shelves, the cart, and time. Keep what matters.",
      hi: "अलमारियाँ, तसला, और समय। जो ज़रूरी है वही रखो।",
    },
    requires: [],
    x: 63,
    y: 40,
    rating: 980,
    playable: false,
    params: { seconds: 60, cart: 4, items: 8, decoys: 0, speedUp: 0 },
  },
  {
    id: "sorting-2",
    game: "sorting",
    index: 2,
    arc: "The Night's Work",
    title: { en: "The Second Bell", hi: "दूसरी घंटी" },
    blurb: {
      en: "Less time, a smaller cart, and leaves turned face-down.",
      hi: "कम समय, छोटा तसला, और औंधे पड़े पत्र।",
    },
    requires: ["sorting-1"],
    x: 60,
    y: 34,
    rating: 1050,
    playable: false,
    params: { seconds: 45, cart: 3, items: 12, decoys: 2, faceDown: 4, speedUp: 0 },
  },
  {
    id: "sorting-3",
    game: "sorting",
    index: 3,
    arc: "The Night's Work",
    title: { en: "Before the Third Dawn", hi: "तीसरी भोर से पहले" },
    blurb: {
      en: "Sixteen bundles, four decoys, one forgery — and the shelves speed up.",
      hi: "सोलह गट्ठर, चार छल, एक जालसाज़ी — और अलमारियाँ तेज़ हो जाती हैं।",
    },
    requires: ["sorting-2"],
    x: 56,
    y: 28,
    rating: 1130,
    playable: false,
    params: { seconds: 35, cart: 3, items: 16, decoys: 4, forgery: 1, faceDown: 6, speedUp: 10 },
  },

  {
    id: "reconstruction-1",
    game: "reconstruction",
    index: 1,
    arc: "The Night's Work",
    title: { en: "A Single Leaf", hi: "एक अकेला पत्र" },
    blurb: {
      en: "Nine pieces of a colophon. Fit them; read them.",
      hi: "पुष्पिका के नौ टुकड़े। जोड़ो; पढ़ो।",
    },
    requires: ["sorting-1"],
    x: 68,
    y: 47,
    rating: 1000,
    playable: false,
    params: { grid: 3, decoys: 0, rotate: 0, moveBudget: 0 },
  },
  {
    id: "reconstruction-2",
    game: "reconstruction",
    index: 2,
    arc: "The Night's Work",
    title: { en: "Turned and Torn", hi: "मुड़ा और फटा" },
    blurb: {
      en: "Sixteen pieces, some rotated, three from another book.",
      hi: "सोलह टुकड़े, कुछ घुमे हुए, तीन किसी और पुस्तक से।",
    },
    requires: ["reconstruction-1"],
    x: 72,
    y: 52,
    rating: 1080,
    playable: false,
    params: { grid: 4, decoys: 3, rotate: 1, moveBudget: 26 },
  },
  {
    id: "reconstruction-3",
    game: "reconstruction",
    index: 3,
    arc: "The Night's Work",
    title: { en: "The Fading Hand", hi: "मिटती लेखनी" },
    blurb: {
      en: "Twenty-five pieces, six decoys, and the ink fades where you don't work.",
      hi: "पच्चीस टुकड़े, छह छल, और जहाँ काम न हो वहाँ स्याही मिट जाती है।",
    },
    requires: ["reconstruction-2"],
    x: 76,
    y: 58,
    rating: 1150,
    playable: false,
    params: { grid: 5, decoys: 6, rotate: 1, moveBudget: 40, fadeMs: 9000 },
  },

  {
    id: "road-1",
    game: "road",
    index: 1,
    arc: "The Night's Work",
    title: { en: "The Kathmandu Track", hi: "काठमांडू का मार्ग" },
    blurb: {
      en: "North to the passes. One patrol, and turns to spare.",
      hi: "उत्तर, दर्रों की ओर। एक गश्त, और समय बाकी।",
    },
    requires: ["reconstruction-1"],
    x: 58,
    y: 22,
    rating: 1010,
    playable: false,
    params: { cols: 7, rows: 9, patrols: 1, turnLimit: 22, shrink: 0, weather: 0 },
  },
  {
    id: "road-2",
    game: "road",
    index: 2,
    arc: "The Night's Work",
    title: { en: "The Uttarapatha", hi: "उत्तरापथ" },
    blurb: {
      en: "The great road west. Two patrols and a river to cross.",
      hi: "पश्चिम की महासड़क। दो गश्तें और एक नदी।",
    },
    requires: ["road-1"],
    x: 44,
    y: 30,
    rating: 1090,
    playable: false,
    params: { cols: 9, rows: 11, patrols: 2, turnLimit: 24, river: 1, shrink: 0, weather: 0 },
  },
  {
    id: "road-3",
    game: "road",
    index: 3,
    arc: "The Night's Work",
    title: { en: "The Closing Net", hi: "सिमटता जाल" },
    blurb: {
      en: "Three patrols converging, and the safe ground shrinks each turn.",
      hi: "तीन गश्तें पास आती हुईं, और हर चाल में सुरक्षित भूमि सिमटती है।",
    },
    requires: ["road-2"],
    x: 34,
    y: 22,
    rating: 1160,
    playable: false,
    params: { cols: 11, rows: 12, patrols: 3, turnLimit: 28, shrink: 1, weather: 1 },
  },

  /* ---------- Arc II — Games of the Court ---------- */
  {
    id: "pachisi",
    game: "ashtapada", // links to the standalone /pachisi route; game field unused here
    index: 0,
    arc: "Games of the Court",
    title: { en: "Pachisi at the Cloth", hi: "वस्त्र पर पचीसी" },
    blurb: {
      en: "The cowrie game the merchant lays out before dawn.",
      hi: "वह कौड़ी-खेल जो व्यापारी भोर से पहले बिछाता है।",
    },
    requires: ["road-1"],
    x: 50,
    y: 44,
    rating: 1040,
    playable: true,
    params: { external: "/pachisi" },
  },
  {
    id: "ashtapada-1",
    game: "ashtapada",
    index: 1,
    arc: "Games of the Court",
    title: { en: "A Patient Neighbour", hi: "धैर्यवान पड़ोसी" },
    blurb: {
      en: "The older board — race four pieces home, and learn the double.",
      hi: "पुराना पट — चार गोटियाँ घर लाओ, और युग्म सीखो।",
    },
    requires: ["pachisi"],
    x: 44,
    y: 50,
    rating: 1000,
    playable: false,
    params: { ai: 1 },
  },
  {
    id: "ashtapada-2",
    game: "ashtapada",
    index: 2,
    arc: "Games of the Court",
    title: { en: "The Temple Clerk", hi: "मंदिर का लिपिक" },
    blurb: { en: "He builds blockades and waits for you to stumble.", hi: "वह अवरोध बनाता है और आपकी चूक की प्रतीक्षा करता है।" },
    requires: ["ashtapada-1"],
    x: 40,
    y: 56,
    rating: 1090,
    playable: false,
    params: { ai: 2 },
  },
  {
    id: "ashtapada-3",
    game: "ashtapada",
    index: 3,
    arc: "Games of the Court",
    title: { en: "The Abbot's Champion", hi: "कुलपति का प्रतिद्वंद्वी" },
    blurb: { en: "He reads a move ahead. Beat him clean.", hi: "वह एक चाल आगे देखता है। उसे साफ़ हराओ।" },
    requires: ["ashtapada-2"],
    x: 36,
    y: 62,
    rating: 1170,
    playable: false,
    params: { ai: 3 },
  },
  {
    id: "gillidanda-1",
    game: "gillidanda",
    index: 1,
    arc: "Games of the Court",
    title: { en: "The Courtyard", hi: "आँगन" },
    blurb: { en: "Flick, then strike. No wind, wide margins.", hi: "उछालो, फिर मारो। हवा नहीं, बड़ी छूट।" },
    requires: ["pachisi"],
    x: 52,
    y: 56,
    rating: 1000,
    playable: false,
    params: { wind: 0, sweet: 1, target: 40 },
  },
  {
    id: "gillidanda-2",
    game: "gillidanda",
    index: 2,
    arc: "Games of the Court",
    title: { en: "The Field", hi: "मैदान" },
    blurb: { en: "A breeze, tighter timing, and a second strike to chase.", hi: "हल्की हवा, कड़ा समय, और पीछा करने को दूसरा प्रहार।" },
    requires: ["gillidanda-1"],
    x: 56,
    y: 62,
    rating: 1090,
    playable: false,
    params: { wind: 1, sweet: 0.7, target: 60, doubleStrike: 1 },
  },
  {
    id: "gillidanda-3",
    game: "gillidanda",
    index: 3,
    arc: "Games of the Court",
    title: { en: "The River Bank", hi: "नदी का किनारा" },
    blurb: { en: "Gusting wind, spread fielders. Three stars need a double into the wind.", hi: "झोंकेदार हवा, बिखरे क्षेत्ररक्षक। तीन तारों के लिए हवा के विरुद्ध दोहरा प्रहार।" },
    requires: ["gillidanda-2"],
    x: 60,
    y: 68,
    rating: 1170,
    playable: false,
    params: { wind: 2, sweet: 0.45, target: 85, doubleStrike: 1 },
  },

  /* ---------- Arc III — The Restoration ---------- */
  {
    id: "capstone",
    game: "capstone",
    index: 1,
    arc: "The Restoration",
    title: { en: "The Library Restored", hi: "पुनर्स्थापित पुस्तकालय" },
    blurb: {
      en: "Sort, reconstruct, and run — one last time, for the catalogue.",
      hi: "छाँटो, जोड़ो, और भागो — आख़िरी बार, सूची के लिए।",
    },
    requires: [
      "sorting-3",
      "reconstruction-3",
      "road-3",
      "ashtapada-3",
      "gillidanda-3",
    ],
    x: 66,
    y: 46,
    rating: 1200,
    playable: false,
    params: {},
  },
];

export const LEVELS_BY_ID: Record<string, LevelDef> = Object.fromEntries(
  LEVELS.map((l) => [l.id, l]),
);

export const ARCS: string[] = [...new Set(LEVELS.map((l) => l.arc))];

export function levelUnlocked(
  level: LevelDef,
  campaign: Record<string, CampaignEntry>,
): boolean {
  return level.requires.every((r) => campaign[r]?.cleared);
}

/** The next level in the same game, if any. */
export function nextLevel(id: string): LevelDef | null {
  const cur = LEVELS_BY_ID[id];
  if (!cur) return null;
  return (
    LEVELS.find((l) => l.game === cur.game && l.index === cur.index + 1) ?? null
  );
}

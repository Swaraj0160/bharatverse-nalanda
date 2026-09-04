/**
 * Item pool for "The Sorting". Real Nalanda texts (worth saving) mixed with
 * plausible chaff and one forgery. Clues are the "tell" a player reads under
 * time pressure. Grounded items reuse the same subjects as content/passages.ts.
 */

export type SortKind = "keep" | "leave" | "decoy" | "forgery";

export type SortItem = {
  id: string;
  title: { en: string; hi: string };
  subject: { en: string; hi: string };
  clue: { en: string; hi: string };
  kind: SortKind;
  /** points if kept (keep) or lost if kept (decoy/forgery, use negative) */
  value: number;
  glyph: string;
};

export const SORT_ITEMS: SortItem[] = [
  {
    id: "healer",
    title: { en: "The Healer's Compendium", hi: "वैद्य का संग्रह" },
    subject: { en: "Medicine", hi: "चिकित्सा" },
    clue: {
      en: "Drug formulas and surgery in a physician's hand.",
      hi: "एक वैद्य की लेखनी में औषधि-नुस्खे और शल्यक्रिया।",
    },
    kind: "keep",
    value: 20,
    glyph: "❦",
  },
  {
    id: "logic",
    title: { en: "Dharmakirti on Valid Knowledge", hi: "धर्मकीर्ति: प्रमाण पर" },
    subject: { en: "Logic", hi: "तर्क" },
    clue: {
      en: "The rules of inference the debate hall runs on.",
      hi: "शास्त्रार्थ कक्ष जिन अनुमान-नियमों पर चलता है।",
    },
    kind: "keep",
    value: 20,
    glyph: "✶",
  },
  {
    id: "prajna",
    title: { en: "The Eight Thousand Lines, illuminated", hi: "अष्टसाहस्रिका, चित्रित" },
    subject: { en: "Prajñāpāramitā", hi: "प्रज्ञापारमिता" },
    clue: {
      en: "Painted panels of deities between the verses.",
      hi: "छंदों के बीच देवताओं के चित्र-फलक।",
    },
    kind: "keep",
    value: 22,
    glyph: "❈",
  },
  {
    id: "grammar",
    title: { en: "Pāṇini, with the Kāśikā", hi: "पाणिनि, काशिका सहित" },
    subject: { en: "Grammar", hi: "व्याकरण" },
    clue: {
      en: "Without it, no scripture can be read closely.",
      hi: "इसके बिना कोई शास्त्र बारीकी से नहीं पढ़ा जा सकता।",
    },
    kind: "keep",
    value: 18,
    glyph: "✜",
  },
  {
    id: "abhidharma",
    title: { en: "Vasubandhu's Abhidharmakośa", hi: "वसुबंधु का अभिधर्मकोश" },
    subject: { en: "Doctrine", hi: "सिद्धांत" },
    clue: {
      en: "The core teaching text Xuanzang carried east.",
      hi: "वह मूल पाठ्य-ग्रंथ जो ह्वेनसांग पूर्व ले गया।",
    },
    kind: "keep",
    value: 18,
    glyph: "❂",
  },
  {
    id: "seal-legend",
    title: { en: "The register of monastery seals", hi: "मठ-मुहरों की बही" },
    subject: { en: "Records", hi: "अभिलेख" },
    clue: {
      en: "Names the community — how the site is known at all.",
      hi: "समुदाय का नाम देती है — स्थल की पहचान का आधार।",
    },
    kind: "keep",
    value: 14,
    glyph: "◉",
  },
  {
    id: "astronomy",
    title: { en: "The observatory tables", hi: "वेधशाला की सारणियाँ" },
    subject: { en: "Astronomy", hi: "ज्योतिष" },
    clue: {
      en: "Calculations that take decades to rebuild if lost.",
      hi: "गणनाएँ जिन्हें खोने पर फिर बनाने में दशकों लगें।",
    },
    kind: "keep",
    value: 16,
    glyph: "✧",
  },
  {
    id: "route-notes",
    title: { en: "A pilgrim's road-notes to Tibet", hi: "तिब्बत तक तीर्थयात्री की मार्ग-टिप्पणियाँ" },
    subject: { en: "Travel", hi: "यात्रा" },
    clue: {
      en: "The passes, the seasons — useful for the courier.",
      hi: "दर्रे, ऋतुएँ — संदेशवाहक के काम की।",
    },
    kind: "keep",
    value: 12,
    glyph: "➶",
  },

  /* --- legit but low priority: fine to leave, wastes the cart if kept --- */
  {
    id: "dup-vinaya",
    title: { en: "A third copy of the Vinaya rules", hi: "विनय नियमों की तीसरी प्रति" },
    subject: { en: "Duplicate", hi: "प्रतिलिपि" },
    clue: {
      en: "Two other copies already went out last night.",
      hi: "दो और प्रतियाँ कल रात ही बाहर जा चुकीं।",
    },
    kind: "leave",
    value: 3,
    glyph: "❋",
  },
  {
    id: "kitchen-roll",
    title: { en: "The refectory supply roll", hi: "भोजनालय की आपूर्ति-सूची" },
    subject: { en: "Household", hi: "गृह-प्रबंध" },
    clue: { en: "Rice, oil, lamp-wicks. This month's.", hi: "चावल, तेल, बत्तियाँ। इस माह की।" },
    kind: "leave",
    value: 2,
    glyph: "▤",
  },
  {
    id: "student-lines",
    title: { en: "A student's punishment lines", hi: "एक छात्र की दंड-पंक्तियाँ" },
    subject: { en: "Scrap", hi: "रद्दी" },
    clue: { en: "The same verse, ninety times, badly.", hi: "वही श्लोक, नब्बे बार, भद्दे ढंग से।" },
    kind: "leave",
    value: 1,
    glyph: "▦",
  },

  /* --- decoys: keeping them costs you --- */
  {
    id: "grain-ledger",
    title: { en: "A grain merchant's ledger", hi: "अनाज-व्यापारी की बही" },
    subject: { en: "Trade", hi: "व्यापार" },
    clue: { en: "Debts owed at the river market. Not ours.", hi: "नदी-बाज़ार के उधार। हमारी नहीं।" },
    kind: "decoy",
    value: -14,
    glyph: "₹",
  },
  {
    id: "blank-leaves",
    title: { en: "A bundle of blank leaves", hi: "कोरे पत्रों का गट्ठर" },
    subject: { en: "Empty", hi: "रिक्त" },
    clue: { en: "Prepared, ruled, never written on.", hi: "तैयार, रेखांकित, कभी लिखा नहीं गया।" },
    kind: "decoy",
    value: -10,
    glyph: "◻",
  },
  {
    id: "tax-roll",
    title: { en: "A village tax roll", hi: "गाँव की कर-सूची" },
    subject: { en: "Revenue", hi: "राजस्व" },
    clue: { en: "The headman's, left here by mistake.", hi: "मुखिया की, भूल से यहाँ छूटी।" },
    kind: "decoy",
    value: -12,
    glyph: "⊟",
  },
  {
    id: "letters",
    title: { en: "Private letters, untied", hi: "निजी पत्र, खुले हुए" },
    subject: { en: "Correspondence", hi: "पत्राचार" },
    clue: { en: "A monk's family news. Not for the archive.", hi: "एक भिक्षु के घर का समाचार। संग्रह के लिए नहीं।" },
    kind: "decoy",
    value: -8,
    glyph: "✉",
  },

  /* --- the forgery: looks precious, poisons the archive --- */
  {
    id: "forgery",
    title: { en: "A 'lost' sūtra, in a fine new hand", hi: "एक 'लुप्त' सूत्र, नई सुंदर लेखनी में" },
    subject: { en: "Sūtra?", hi: "सूत्र?" },
    clue: {
      en: "Ink too fresh, the Sanskrit a little wrong. Sold to the monastery last winter.",
      hi: "स्याही बहुत ताज़ा, संस्कृत ज़रा ग़लत। पिछले शीत में मठ को बेचा गया।",
    },
    kind: "forgery",
    value: -30,
    glyph: "✵",
  },
];

export const SORT_BY_ID: Record<string, SortItem> = Object.fromEntries(
  SORT_ITEMS.map((i) => [i.id, i]),
);

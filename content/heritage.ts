/**
 * The pan-India heritage layer.
 *
 * Every fact carries a plain-language `source` label describing the *kind* of
 * record it rests on — never a fabricated page or ISBN. Where the record is
 * genuinely contested (e.g. when and why the Konark deul fell) the passage says
 * so; modelling that uncertainty is a feature of the product, not a gap.
 *
 * `verification` gates how the UI presents a site:
 *   verified — well-documented, protected/listed monument
 *   curated  — assembled from published general knowledge
 *   demo     — conceptual reconstruction, always visually flagged
 */

import type { Passage } from "@/content/passages";

export type Region = "north" | "south" | "east" | "west" | "central" | "northeast";

export type SiteCategory =
  | "temple"
  | "fort"
  | "cave"
  | "palace"
  | "stepwell"
  | "monastery"
  | "science"
  | "art";

export type Hotspot = {
  id: string;
  label: { en: string; hi: string };
  /** position in the lens scene, metres */
  pos: [number, number, number];
  what: { en: string; hi: string };
  why: { en: string; hi: string };
  how: { en: string; hi: string };
  /** which x-ray layer this belongs to */
  layer: string;
};

export type XRayLayer = {
  id: string;
  label: { en: string; hi: string };
  note: { en: string; hi: string };
};

export type TimelineEntry = {
  year: string;
  label: { en: string; hi: string };
  certain: boolean;
};

export type HeritageSite = {
  id: string;
  name: { en: string; hi: string };
  epithet: { en: string; hi: string };
  state: string;
  region: Region;
  coords: { lat: number; lng: number };
  period: string;
  dynasty: string;
  categories: SiteCategory[];
  summary: { en: string; hi: string };
  timeline: TimelineEntry[];
  layers: XRayLayer[];
  hotspots: Hotspot[];
  /** level ids from lib/games/levels.ts that belong to this site */
  games: string[];
  sources: string[];
  verification: "verified" | "curated" | "demo";
  /** which procedural scene the Lens renders */
  scene: "konark-wheel" | "stepwell" | "vihara";
  accent: string;
};

/* ------------------------------------------------------------------ sites */

export const SITES: HeritageSite[] = [
  {
    id: "konark",
    name: { en: "Konark Sun Temple", hi: "कोणार्क सूर्य मंदिर" },
    epithet: { en: "The chariot that tells the time", hi: "समय बताने वाला रथ" },
    state: "Odisha",
    region: "east",
    coords: { lat: 19.8876, lng: 86.0945 },
    period: "c. 1250 CE",
    dynasty: "Eastern Ganga",
    categories: ["temple", "science", "art"],
    summary: {
      en: "A temple built as a colossal stone chariot for Surya, the sun — twenty-four carved wheels, seven straining horses. The wheels are not ornament. They are instruments: place your finger at the axle and the shadow tells you the time, to within a few minutes.",
      hi: "सूर्य के लिए विशाल पत्थर के रथ के रूप में बना मंदिर — चौबीस उत्कीर्ण पहिये, सात दौड़ते घोड़े। पहिये केवल अलंकरण नहीं हैं। वे यंत्र हैं: धुरी पर उँगली रखिए और छाया समय बता देती है, कुछ ही मिनटों की परिशुद्धता से।",
    },
    timeline: [
      { year: "c. 1250", label: { en: "Built under Narasimhadeva I of the Eastern Ganga dynasty", hi: "पूर्वी गंग वंश के नरसिंहदेव प्रथम के अधीन निर्मित" }, certain: true },
      { year: "13th–16th c.", label: { en: "In active worship; a landmark for sailors on the Bay of Bengal", hi: "सक्रिय पूजा में; बंगाल की खाड़ी के नाविकों के लिए एक चिह्न" }, certain: true },
      { year: "?", label: { en: "The great tower (deul) collapses — the cause and even the century are genuinely disputed", hi: "मुख्य शिखर (देउल) ढह जाता है — कारण और शताब्दी तक विवादित है" }, certain: false },
      { year: "1903", label: { en: "The surviving hall is filled with sand to stop it following the tower down", hi: "बचे हुए मंडप को रेत से भर दिया गया ताकि वह भी न गिरे" }, certain: true },
      { year: "1984", label: { en: "Inscribed on the UNESCO World Heritage List", hi: "यूनेस्को विश्व धरोहर सूची में अंकित" }, certain: true },
    ],
    layers: [
      { id: "hub", label: { en: "Axle & hub", hi: "धुरी और नाभि" }, note: { en: "The reading point", hi: "पठन बिंदु" } },
      { id: "major", label: { en: "Major spokes", hi: "मुख्य अरे" }, note: { en: "Eight — three hours apart", hi: "आठ — तीन घंटे के अंतराल पर" } },
      { id: "minor", label: { en: "Minor spokes", hi: "गौण अरे" }, note: { en: "Eight — at the midpoints", hi: "आठ — मध्य बिंदुओं पर" } },
      { id: "rim", label: { en: "Beaded rim", hi: "मणिकित परिधि" }, note: { en: "Three minutes per bead", hi: "प्रति मणि तीन मिनट" } },
      { id: "plinth", label: { en: "Plinth & platform", hi: "अधिष्ठान" }, note: { en: "The chariot's bed", hi: "रथ का आधार" } },
    ],
    hotspots: [
      {
        id: "axle",
        label: { en: "The axle", hi: "धुरी" },
        pos: [0, 0, 0.42],
        layer: "hub",
        what: { en: "The projecting hub at the centre of the wheel.", hi: "पहिये के केंद्र में निकली हुई नाभि।" },
        why: { en: "It is the gnomon. A finger or rod placed here casts the shadow that is read against the spokes.", hi: "यही शंकु है। यहाँ रखी उँगली या छड़ की छाया अरों पर पढ़ी जाती है।" },
        how: { en: "Carved integral with the wheel from a single block, then dressed — not assembled from parts.", hi: "पहिये के साथ एक ही खंड से उत्कीर्ण, फिर परिष्कृत — जोड़कर नहीं बनाया गया।" },
      },
      {
        id: "major-spoke",
        label: { en: "A major spoke", hi: "मुख्य अरा" },
        pos: [0, 1.55, 0.2],
        layer: "major",
        what: { en: "One of eight thick spokes, evenly spaced around the wheel.", hi: "पहिये के चारों ओर समान दूरी पर आठ मोटे अरों में से एक।" },
        why: { en: "Eight spokes divide the day into eight parts of three hours each. The one at the top is midnight.", hi: "आठ अरे दिन को तीन-तीन घंटे के आठ भागों में बाँटते हैं। ऊपर वाला मध्यरात्रि है।" },
        how: { en: "Each is carved with medallions and figural panels, so the instrument is also sculpture.", hi: "प्रत्येक पर पदक और मूर्ति-फलक उत्कीर्ण हैं, अतः यंत्र स्वयं शिल्प भी है।" },
      },
      {
        id: "minor-spoke",
        label: { en: "A minor spoke", hi: "गौण अरा" },
        pos: [1.1, 1.1, 0.2],
        layer: "minor",
        what: { en: "One of eight thinner spokes, each set exactly between two major spokes.", hi: "आठ पतले अरों में से एक, प्रत्येक दो मुख्य अरों के ठीक बीच।" },
        why: { en: "It halves the three-hour interval, giving a reading every hour and a half.", hi: "यह तीन घंटे के अंतराल को आधा करता है, जिससे हर डेढ़ घंटे पर पठन मिलता है।" },
        how: { en: "Thinner in section so it reads as subordinate to the major spoke at a glance.", hi: "पतला रखा गया है ताकि एक दृष्टि में मुख्य अरे से गौण दिखे।" },
      },
      {
        id: "beads",
        label: { en: "The rim beads", hi: "परिधि की मणियाँ" },
        pos: [1.72, 0.72, 0.16],
        layer: "rim",
        what: { en: "A ring of small carved beads running around the outer rim.", hi: "बाहरी परिधि पर घूमती छोटी उत्कीर्ण मणियों की माला।" },
        why: { en: "Thirty beads fill the gap between a minor and a major spoke, so each bead is three minutes. The beads are elongated, so the shadow can fall left, centre or right of one — dividing three minutes again.", hi: "गौण और मुख्य अरे के बीच तीस मणियाँ हैं, अर्थात् प्रत्येक मणि तीन मिनट। मणियाँ लंबी हैं, अतः छाया उनके बाएँ, मध्य या दाएँ पड़ सकती है — तीन मिनट फिर विभाजित।" },
        how: { en: "This is what takes the wheel from a rough dial to an instrument accurate to a minute or two.", hi: "यही पहिये को मोटे घड़ीयंत्र से एक-दो मिनट तक सटीक यंत्र बनाता है।" },
      },
      {
        id: "platform",
        label: { en: "The chariot platform", hi: "रथ का अधिष्ठान" },
        pos: [-1.9, -1.4, 0],
        layer: "plinth",
        what: { en: "The moulded plinth the wheels are set against.", hi: "वह गढ़ा हुआ अधिष्ठान जिस पर पहिये लगे हैं।" },
        why: { en: "It makes the whole temple read as a moving chariot — twelve pairs of wheels, drawn by seven horses.", hi: "यह पूरे मंदिर को चलते रथ का रूप देता है — बारह जोड़ी पहिये, सात घोड़ों द्वारा खींचे हुए।" },
        how: { en: "Courses of dressed khondalite and laterite, with chlorite reserved for the finest carving.", hi: "खोंडालाइट और लैटेराइट की परतें, बारीक उत्कीर्णन के लिए क्लोराइट।" },
      },
    ],
    games: ["shadow-1", "shadow-2", "shadow-3", "rebuild-1", "rebuild-2"],
    sources: [
      "UNESCO World Heritage List inscription for the Sun Temple, Konârak (1984)",
      "Archaeological Survey of India site records and conservation history",
      "Published surveys and measurements of the Konark chariot wheels and their use as sundials",
      "Eastern Ganga period inscriptions and regional chronicles",
    ],
    verification: "verified",
    scene: "konark-wheel",
    accent: "#D9A63F",
  },

  {
    id: "nalanda",
    name: { en: "Nalanda Mahavihara", hi: "नालंदा महाविहार" },
    epithet: { en: "What one night decides to keep", hi: "एक रात जो बचाना तय करती है" },
    state: "Bihar",
    region: "east",
    coords: { lat: 25.1358, lng: 85.4437 },
    period: "5th–13th c. CE",
    dynasty: "Gupta, then Pala",
    categories: ["monastery", "science", "art"],
    summary: {
      en: "For seven hundred years the largest residential university in the world: logic, medicine, grammar, astronomy, and the whole Buddhist canon. Then, around 1200, it ended. What survived did so because someone carried it north in time.",
      hi: "सात सौ वर्षों तक विश्व का सबसे बड़ा आवासीय विश्वविद्यालय: तर्क, चिकित्सा, व्याकरण, ज्योतिष, और समूचा बौद्ध ग्रंथ-संग्रह। फिर, लगभग 1200 में, यह समाप्त हो गया। जो बचा वह इसलिए बचा कि कोई उसे समय रहते उत्तर ले गया।",
    },
    timeline: [
      { year: "c. 427", label: { en: "Founded under the Guptas", hi: "गुप्तों के अधीन स्थापित" }, certain: true },
      { year: "630s", label: { en: "Xuanzang studies here under Silabhadra", hi: "ह्वेनसांग यहाँ शीलभद्र के अधीन अध्ययन करते हैं" }, certain: true },
      { year: "c. 1200", label: { en: "Sacked; the libraries burn. The 'burned for months' detail is later tradition, not the contemporary chronicle", hi: "ध्वस्त; पुस्तकालय जलते हैं। 'महीनों जलता रहा' बाद की परंपरा है, समकालीन वृत्तांत नहीं" }, certain: false },
      { year: "1234", label: { en: "Dharmasvamin finds one aged teacher still holding class in the ruins", hi: "धर्मस्वामिन को खंडहरों में एक वृद्ध आचार्य अब भी पढ़ाते मिलते हैं" }, certain: true },
      { year: "2016", label: { en: "Inscribed on the UNESCO World Heritage List", hi: "यूनेस्को विश्व धरोहर सूची में अंकित" }, certain: true },
    ],
    layers: [
      { id: "vihara", label: { en: "Monastic cells", hi: "भिक्षु-कक्ष" }, note: { en: "Where they slept and studied", hi: "जहाँ वे सोते और पढ़ते थे" } },
      { id: "chaitya", label: { en: "Shrines", hi: "चैत्य" }, note: { en: "Facing the cells", hi: "कक्षों के सम्मुख" } },
      { id: "stupa", label: { en: "Sariputra stupa", hi: "सारिपुत्र स्तूप" }, note: { en: "The oldest core", hi: "सबसे प्राचीन केंद्र" } },
    ],
    hotspots: [],
    games: ["sorting-1", "sorting-2", "sorting-3", "reconstruction-1", "reconstruction-2", "reconstruction-3", "road-1", "road-2", "road-3"],
    sources: [
      "Xuanzang's 7th-century travel record",
      "Yijing's account of monastic practice, c. 690 CE",
      "Archaeological Survey of India excavation reports, Nalanda",
      "Biography of Dharmasvamin, Tibetan pilgrim, visited 1234 CE",
    ],
    verification: "verified",
    scene: "vihara",
    accent: "#B23A2E",
  },

  {
    id: "ranikivav",
    name: { en: "Rani ki Vav", hi: "रानी की वाव" },
    epithet: { en: "A temple built downward", hi: "नीचे की ओर बना मंदिर" },
    state: "Gujarat",
    region: "west",
    coords: { lat: 23.8587, lng: 72.1016 },
    period: "c. 1063 CE",
    dynasty: "Chaulukya (Solanki)",
    categories: ["stepwell", "art", "science"],
    summary: {
      en: "A stepwell seven storeys deep, built as an inverted temple: you descend past hundreds of sculptures to reach water. Silt from the Saraswati buried it for centuries, which is precisely why its carving survived so sharply.",
      hi: "सात मंज़िल गहरी बावड़ी, उलटे मंदिर के रूप में बनी: आप सैकड़ों मूर्तियों से होकर नीचे उतरते हैं और जल तक पहुँचते हैं। सरस्वती की गाद ने इसे सदियों दबाए रखा — इसीलिए इसका उत्कीर्णन इतना तीक्ष्ण बचा रहा।",
    },
    timeline: [
      { year: "c. 1063", label: { en: "Commissioned by Queen Udayamati", hi: "रानी उदयमती द्वारा निर्मित" }, certain: true },
      { year: "later centuries", label: { en: "Buried under Saraswati river silt", hi: "सरस्वती नदी की गाद में दबी" }, certain: true },
      { year: "1980s", label: { en: "Excavated and conserved by the ASI", hi: "भारतीय पुरातत्व सर्वेक्षण द्वारा उत्खनित और संरक्षित" }, certain: true },
      { year: "2014", label: { en: "Inscribed on the UNESCO World Heritage List", hi: "यूनेस्को विश्व धरोहर सूची में अंकित" }, certain: true },
    ],
    layers: [
      { id: "steps", label: { en: "Stepped corridor", hi: "सोपान-मार्ग" }, note: { en: "The descent", hi: "अवरोहण" } },
      { id: "pavilions", label: { en: "Pavilions", hi: "मंडप" }, note: { en: "Seven levels", hi: "सात स्तर" } },
      { id: "well", label: { en: "The well shaft", hi: "कूप" }, note: { en: "The water table", hi: "जल-स्तर" } },
    ],
    hotspots: [],
    games: [],
    sources: [
      "UNESCO World Heritage List inscription for Rani-ki-Vav (2014)",
      "Archaeological Survey of India excavation and conservation records, Patan",
      "Published surveys of Chaulukya-period stepwell architecture",
    ],
    verification: "verified",
    scene: "stepwell",
    accent: "#26406B",
  },
];

export const SITE_BY_ID: Record<string, HeritageSite> = Object.fromEntries(
  SITES.map((s) => [s.id, s]),
);

export const REGION_LABEL: Record<Region, { en: string; hi: string }> = {
  north: { en: "North", hi: "उत्तर" },
  south: { en: "South", hi: "दक्षिण" },
  east: { en: "East", hi: "पूर्व" },
  west: { en: "West", hi: "पश्चिम" },
  central: { en: "Central", hi: "मध्य" },
  northeast: { en: "Northeast", hi: "पूर्वोत्तर" },
};

export const CATEGORY_LABEL: Record<SiteCategory, { en: string; hi: string }> = {
  temple: { en: "Temples", hi: "मंदिर" },
  fort: { en: "Forts", hi: "दुर्ग" },
  cave: { en: "Caves", hi: "गुफाएँ" },
  palace: { en: "Palaces", hi: "महल" },
  stepwell: { en: "Stepwells", hi: "बावड़ियाँ" },
  monastery: { en: "Monasteries", hi: "विहार" },
  science: { en: "Science & Knowledge", hi: "विज्ञान और ज्ञान" },
  art: { en: "Art", hi: "कला" },
};

/* --------------------------------------------------- per-site AI corpus */

/** Passages for the non-Nalanda sites. Nalanda's 44 live in content/passages.ts. */
export const SITE_PASSAGES: (Passage & { site: string })[] = [
  {
    site: "konark",
    id: "k-chariot",
    title: "A temple shaped as a chariot",
    text: "Konark was conceived as the chariot of Surya, the sun, rendered at architectural scale in stone. Twenty-four great wheels are carved along the plinth in twelve pairs, and seven horses are shown straining at the front. The form is not decorative framing — the whole building is meant to be read as a vehicle in motion.",
    source: "UNESCO World Heritage List inscription for the Sun Temple, Konârak; Archaeological Survey of India site records",
    keywords: ["chariot", "shape", "form", "wheels", "horses", "surya", "sun", "why", "look", "design", "twenty-four", "seven"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-sundial",
    title: "The wheels tell the time",
    text: "Each wheel works as a sundial. Eight thick major spokes divide the twenty-four hours into eight parts of three hours each, and eight thinner minor spokes sit exactly at the midpoints, giving a mark every hour and a half. A finger or rod at the projecting axle casts a shadow, and where that shadow falls on the rim gives the time.",
    source: "Published surveys and readings of the Konark chariot wheels",
    keywords: ["sundial", "time", "clock", "shadow", "spokes", "major", "minor", "read", "hours", "tell", "dial", "how"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-beads",
    title: "Beads that divide the minutes",
    text: "The outer rim of each wheel carries a ring of small carved beads. Thirty beads fill the arc between a minor and a major spoke, so one bead is three minutes. The beads are slightly elongated rather than round, so a shadow can fall on the left, the centre or the right of a bead — dividing those three minutes again and bringing the reading down to about a minute.",
    source: "Published surveys and readings of the Konark chariot wheels",
    keywords: ["beads", "minutes", "precision", "accurate", "rim", "thirty", "three minutes", "how accurate", "fine"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-anticlockwise",
    title: "Read anticlockwise, from midnight at the top",
    text: "The dial is read anticlockwise. The major spoke at the top centre of the wheel stands for twelve midnight, and the count runs backwards from there against the direction of a modern clock face. This trips up most first-time readers, and it is the first thing to learn before the spokes make sense.",
    source: "Published surveys and readings of the Konark chariot wheels",
    keywords: ["anticlockwise", "counterclockwise", "direction", "midnight", "top", "twelve", "which way", "backwards", "start"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-builder",
    title: "Narasimhadeva I and the Eastern Gangas",
    text: "The temple was raised in about 1250 CE under Narasimhadeva I of the Eastern Ganga dynasty, who ruled coastal Odisha. It belongs to the mature Kalinga tradition of temple building, and its scale suggests both royal patronage and an established regional workshop of sculptors and masons.",
    source: "Eastern Ganga period inscriptions and regional chronicles; Archaeological Survey of India site records",
    keywords: ["who built", "builder", "narasimhadeva", "ganga", "dynasty", "king", "when", "1250", "commissioned", "patron"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-collapse",
    title: "The tower fell — and the record is genuinely unclear",
    text: "The great sanctuary tower, the deul, no longer stands, and honest accounts disagree about both when and why it fell. Structural failure, subsidence, removal of stone, and deliberate damage have all been proposed, in different centuries. What is documented is that in 1903 the surviving assembly hall was packed with sand to keep it from going the same way.",
    source: "Archaeological Survey of India conservation history; competing published accounts of the collapse",
    keywords: ["collapse", "fell", "ruin", "destroyed", "tower", "deul", "why", "when", "damage", "sand", "1903", "broken"],
    nodes: [],
  },
  {
    site: "konark",
    id: "k-stone",
    title: "Three stones, three jobs",
    text: "The builders used khondalite for the bulk of the structure, laterite where mass and foundation were needed, and fine-grained chlorite for the sculpture that had to hold crisp detail. Choosing a different stone for each job is an engineering decision as much as an aesthetic one.",
    source: "Archaeological Survey of India site records; published studies of Kalinga temple construction",
    keywords: ["stone", "material", "khondalite", "laterite", "chlorite", "built", "construction", "what is it made of", "rock"],
    nodes: [],
  },
  {
    site: "ranikivav",
    id: "r-inverted",
    title: "A temple built downward",
    text: "Rani ki Vav is a stepwell laid out as an inverted temple. Instead of climbing towards a sanctum, the visitor descends seven levels of pillared pavilions towards water. The sculptural programme intensifies as you go down, so the deepest and coolest point is also the most richly carved.",
    source: "UNESCO World Heritage List inscription for Rani-ki-Vav (2014)",
    keywords: ["stepwell", "inverted", "temple", "downward", "descend", "levels", "seven", "shape", "design", "vav", "baoli"],
    nodes: [],
  },
  {
    site: "ranikivav",
    id: "r-udayamati",
    title: "Built by a queen, in memory of a king",
    text: "The stepwell was commissioned in about 1063 CE by Queen Udayamati of the Chaulukya, or Solanki, dynasty, in memory of her husband Bhimdev I. It is one of the clearest surviving cases of a major work of Indian public architecture commissioned by a woman.",
    source: "UNESCO World Heritage List inscription for Rani-ki-Vav; Archaeological Survey of India records, Patan",
    keywords: ["who built", "udayamati", "queen", "bhimdev", "solanki", "chaulukya", "when", "1063", "why built", "memory"],
    nodes: [],
  },
  {
    site: "ranikivav",
    id: "r-silt",
    title: "Buried by a river, preserved by the burial",
    text: "Silt from the Saraswati river filled the stepwell and hid it for centuries. That burial is the reason so much of the carving survives with its edges intact: the sculpture was sealed away from weathering, footfall and reuse until the Archaeological Survey of India excavated the site in the 1980s.",
    source: "Archaeological Survey of India excavation and conservation records, Patan",
    keywords: ["silt", "buried", "saraswati", "river", "lost", "excavated", "preserved", "why so good", "condition", "rediscovered"],
    nodes: [],
  },
  {
    site: "ranikivav",
    id: "r-water",
    title: "Architecture as water management",
    text: "A stepwell is a piece of water engineering before it is anything else. The stepped corridor lets people reach the water at any season as the table rises and falls, and the depth keeps the water and the surrounding air cool through a Gujarat summer. The sculpture is carried on a structure whose first job is supply.",
    source: "Published surveys of Chaulukya-period stepwell architecture",
    keywords: ["water", "engineering", "how does it work", "purpose", "why", "table", "season", "cool", "supply", "monsoon"],
    nodes: [],
  },
];

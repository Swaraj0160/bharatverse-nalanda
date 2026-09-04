export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

const D: Dict = {
  "app.title": { en: "The Lost Library of Nalanda", hi: "नालंदा का लुप्त पुस्तकालय" },
  "app.tagline": {
    en: "It is 1202 CE. Khalji's riders are three days out. You are the last scribe on duty. What you save tonight is what history gets to keep.",
    hi: "वर्ष 1202 ईस्वी। ख़िलजी के घुड़सवार तीन दिन दूर हैं। आप कर्तव्य पर अंतिम लिपिक हैं। आज रात आप जो बचाएँगे, इतिहास वही रख पाएगा।",
  },
  "app.begin": { en: "Enter the manuscript hall", hi: "पांडुलिपि कक्ष में प्रवेश करें" },
  "app.continue": { en: "Return to your desk", hi: "अपनी मेज़ पर लौटें" },
  "nav.scriptorium": { en: "The Scriptorium", hi: "लिपि-कक्ष" },
  "nav.pachisi": { en: "Pachisi", hi: "पचीसी" },
  "nav.journal": { en: "Scribe's Journal", hi: "लिपिक की बही" },

  "hud.rank": { en: "Scribe's Rank", hi: "लिपिक की श्रेणी" },
  "hud.demo": { en: "Demo Mode", hi: "प्रदर्शन विधा" },
  "hud.live": { en: "Live Mode", hi: "सजीव विधा" },
  "hud.demoOn": { en: "Offline — cached answers, no network", hi: "ऑफ़लाइन — संचित उत्तर, कोई नेटवर्क नहीं" },
  "hud.liveOn": { en: "Connected — grounded generation", hi: "संयुक्त — आधारित उत्पादन" },
  "hud.audio": { en: "Ambient sound", hi: "परिवेश ध्वनि" },
  "hud.lang": { en: "हिन्दी", hi: "English" },

  "hist.title": { en: "Ask the Historian", hi: "इतिहासकार से पूछें" },
  "hist.sub": {
    en: "Every claim shows its source. Ask outside these walls and I will say so.",
    hi: "हर कथन अपना स्रोत दिखाता है। इन दीवारों के बाहर पूछें तो मैं वैसा ही कह दूँगा।",
  },
  "hist.placeholder": { en: "Ask about Nalanda in this age…", hi: "इस युग के नालंदा के बारे में पूछें…" },
  "hist.send": { en: "Ask", hi: "पूछें" },
  "hist.thinking": { en: "consulting the shelves", hi: "अलमारियाँ देख रहा हूँ" },
  "hist.sources": { en: "Sources", hi: "स्रोत" },
  "hist.noSource": { en: "No source, no answer.", hi: "स्रोत नहीं, तो उत्तर नहीं।" },
  "hist.translationNote": {
    en: "(the underlying passages are recorded in English)",
    hi: "(मूल अंश अंग्रेज़ी में अभिलिखित हैं)",
  },
  "hist.tryThese": { en: "Try", hi: "पूछकर देखें" },

  "graph.title": { en: "The knowledge graph", hi: "ज्ञान-सारणी" },
  "graph.hint": {
    en: "Nodes light when an answer rests on them.",
    hi: "जब कोई उत्तर किसी गाँठ पर टिकता है, वह प्रकाशित होती है।",
  },

  "mission.begin": { en: "Begin", hi: "आरंभ करें" },
  "mission.close": { en: "Set it down", hi: "रख दें" },
  "mission.done": { en: "Recorded", hi: "अभिलिखित" },
  "mission.locked": { en: "Not yet", hi: "अभी नहीं" },

  "m.triage.name": { en: "The Triage", hi: "चयन" },
  "m.triage.desc": {
    en: "You cannot carry every shelf. Choose what leaves these walls tonight.",
    hi: "आप हर अलमारी नहीं ले जा सकते। चुनिए आज रात इन दीवारों से क्या बाहर जाएगा।",
  },
  "m.translate.name": { en: "The Fragment", hi: "खंडित पत्र" },
  "m.translate.desc": {
    en: "A single leaf, its reading half-lost. Restore it before it is packed.",
    hi: "एक अकेला पत्र, उसका पाठ आधा खोया। संदूक में रखने से पहले उसे पूरा कीजिए।",
  },
  "m.courier.name": { en: "The Courier", hi: "संदेशवाहक" },
  "m.courier.desc": {
    en: "One bundle can leave with a rider tonight. Choose the road it takes.",
    hi: "आज रात एक गट्ठर एक सवार के साथ जा सकता है। चुनिए वह किस मार्ग से जाएगा।",
  },

  "roadmap.title": { en: "What is not yet written", hi: "जो अभी लिखा नहीं गया" },
  "roadmap.sub": {
    en: "Nalanda is one night in one hall. The archive is meant to grow.",
    hi: "नालंदा एक कक्ष की एक रात है। यह संग्रह बढ़ने के लिए है।",
  },

  "pachisi.title": { en: "Pachisi at the cloth", hi: "वस्त्र पर पचीसी" },
  "pachisi.locked": {
    en: "Finish the night's work in the Scriptorium first.",
    hi: "पहले लिपि-कक्ष में रात का काम पूरा कीजिए।",
  },
  "pachisi.throw": { en: "Cast the shells", hi: "कौड़ियाँ फेंकें" },
  "pachisi.yourTurn": { en: "Your move", hi: "आपकी चाल" },
  "pachisi.theirTurn": { en: "The merchant plays", hi: "व्यापारी की चाल" },
  "pachisi.youWin": { en: "You bring both pieces home.", hi: "आप दोनों गोटियाँ घर ले आते हैं।" },
  "pachisi.youLose": { en: "The merchant is home first.", hi: "व्यापारी पहले घर पहुँच जाता है।" },
  "pachisi.grace": { en: "A grace throw — play again.", hi: "कृपा-दान — फिर से चलें।" },
  "pachisi.rules": { en: "How it is played", hi: "यह कैसे खेला जाता है" },
  "pachisi.easy": { en: "A patient partner", hi: "धैर्यवान साथी" },
  "pachisi.hard": { en: "A sharp merchant", hi: "चतुर व्यापारी" },
  "pachisi.chronicle": { en: "The chronicle of this game", hi: "इस खेल का वृत्तांत" },

  "journal.title": { en: "The colophon", hi: "पुष्पिका" },
  "journal.saved": { en: "Carried out of the hall", hi: "कक्ष से बाहर ले जाया गया" },
  "journal.learned": { en: "Set down in this hand", hi: "इस लेखनी में लिखा गया" },
  "journal.seals": { en: "Seals pressed", hi: "अंकित मुहरें" },
  "journal.export": { en: "Save this page", hi: "यह पृष्ठ सहेजें" },
  "journal.restart": { en: "Begin the night again", hi: "रात फिर से आरंभ करें" },
};

export function t(key: string, lang: Lang): string {
  const entry = D[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}

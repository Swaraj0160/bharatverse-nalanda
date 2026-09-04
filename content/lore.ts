/** Non-mission hotspots: reading stations that reveal grounded passages. */

export type LoreStation = {
  id: string;
  title: { en: string; hi: string };
  intro: { en: string; hi: string };
  passageIds: string[];
};

export const LORE: LoreStation[] = [
  {
    id: "archway",
    title: { en: "The Debate Archway", hi: "शास्त्रार्थ का तोरण" },
    intro: {
      en: "Beyond this arch the disputations are held. A monk who loses badly may leave as another's pupil.",
      hi: "इस तोरण के परे शास्त्रार्थ होते हैं। जो भिक्षु बुरी तरह हारे, वह किसी और का शिष्य बनकर जा सकता है।",
    },
    passageIds: ["logic", "dignaga-dharmakirti", "yogachara", "madhyamaka", "debate-culture"],
  },
  {
    id: "window",
    title: { en: "The Courtyard Window", hi: "प्रांगण की खिड़की" },
    intro: {
      en: "From here the whole line of monasteries is visible — brick cells facing brick shrines, and the great stepped temple beyond.",
      hi: "यहाँ से मठों की पूरी पंक्ति दिखती है — ईंट की कोठरियाँ, सामने ईंट के मंदिर, और परे वह विशाल सोपान-मंदिर।",
    },
    passageIds: ["architecture", "sariputra-stupa", "observatories", "geography"],
  },
  {
    id: "chest",
    title: { en: "The Locked Chest", hi: "बंद संदूक" },
    intro: {
      en: "Iron bands, a monastery seal. Inside: the texts kept apart, and the report a rider brought tonight.",
      hi: "लोहे की पट्टियाँ, एक मठ की मुहर। भीतर: अलग रखे गए ग्रंथ, और वह समाचार जो आज रात एक सवार लाया।",
    },
    passageIds: ["khalji-campaign", "tabaqat-account", "burning-tradition", "rahula-sribhadra"],
  },
];

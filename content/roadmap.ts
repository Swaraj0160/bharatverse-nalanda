/** Future chapters, shown greyed on a stylised map — serves "future progression". */

export type RoadmapPin = {
  id: string;
  label: { en: string; hi: string };
  era: string;
  note: { en: string; hi: string };
  x: number; // 0..100 on the map viewBox
  y: number;
  active?: boolean;
};

export const ROADMAP_PINS: RoadmapPin[] = [
  {
    id: "nalanda",
    label: { en: "Nalanda", hi: "नालंदा" },
    era: "1202 CE",
    note: { en: "This night. The manuscript hall.", hi: "यही रात। पांडुलिपि कक्ष।" },
    x: 66,
    y: 44,
    active: true,
  },
  {
    id: "konark",
    label: { en: "Konark", hi: "कोणार्क" },
    era: "1250 CE",
    note: { en: "The sun temple as a working observatory and a mason's yard.", hi: "सूर्य मंदिर एक कार्यरत वेधशाला और शिल्पी-प्रांगण के रूप में।" },
    x: 63,
    y: 55,
  },
  {
    id: "hampi",
    label: { en: "Hampi", hi: "हम्पी" },
    era: "1520 CE",
    note: { en: "A market day in Vijayanagara, told through its weights, coins and canals.", hi: "विजयनगर में एक बाज़ार का दिन, उसके बाट, सिक्कों और नहरों से।" },
    x: 44,
    y: 66,
  },
  {
    id: "thanjavur",
    label: { en: "Thanjavur", hi: "तंजावुर" },
    era: "1010 CE",
    note: { en: "Casting the bronze for the great temple, under the Cholas.", hi: "चोल शासन में महामंदिर के लिए काँसा ढालना।" },
    x: 50,
    y: 74,
  },
  {
    id: "mewar",
    label: { en: "The Rajput courts", hi: "राजपूत दरबार" },
    era: "1576 CE",
    note: { en: "A painter's workshop illuminating a manuscript between campaigns.", hi: "अभियानों के बीच एक चित्रशाला में पांडुलिपि का अलंकरण।" },
    x: 38,
    y: 36,
  },
  {
    id: "takshashila",
    label: { en: "Takshashila", hi: "तक्षशिला" },
    era: "500 BCE",
    note: { en: "The older school, on the road west — grammar, medicine, statecraft.", hi: "पश्चिम की सड़क पर पुरानी पाठशाला — व्याकरण, चिकित्सा, राजनीति।" },
    x: 30,
    y: 18,
  },
  {
    id: "lothal",
    label: { en: "Lothal", hi: "लोथल" },
    era: "2000 BCE",
    note: { en: "A Harappan dock town: the tidal basin, the bead workshop, the seals.", hi: "एक हड़प्पा बंदरगाह नगर: ज्वारीय द्रोणी, मनका-शाला, मुहरें।" },
    x: 24,
    y: 46,
  },
];

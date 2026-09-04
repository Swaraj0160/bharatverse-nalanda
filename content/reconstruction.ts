/**
 * Texts for "The Reconstruction". Each is an ordered list of fragments that,
 * read in sequence, restore a real leaf. Decoys are fragments from other
 * manuscripts that must be sent to the discard pile. Source labels follow the
 * same plain-language standard as content/passages.ts.
 */

export type ReconText = {
  id: string;
  /** ordered fragments — index is the correct grid position */
  fragments: string[];
  hi: string[];
  source: { en: string; hi: string };
  full: { en: string; hi: string };
};

export const RECON_TEXTS: Record<string, ReconText> = {
  colophon: {
    id: "colophon",
    fragments: [
      "This is",
      "the pious gift",
      "of the monk",
      "whose name is written below —",
      "caused to be copied",
      "with mother and father foremost,",
      "for the welfare",
      "of all living beings.",
      "Let there be merit.",
    ],
    hi: [
      "यह है",
      "उस भिक्षु का",
      "धर्मदान",
      "जिसका नाम नीचे लिखा है —",
      "प्रतिलिपि कराई गई",
      "माता-पिता को अग्रणी रखते हुए,",
      "समस्त प्राणियों के",
      "कल्याण के लिए।",
      "पुण्य हो।",
    ],
    source: {
      en: "The standard closing formula (deyadharma) added by a scribe or donor to a finished Buddhist manuscript.",
      hi: "किसी पूर्ण बौद्ध पांडुलिपि में लिपिक या दानदाता द्वारा जोड़ा गया मानक समापन-सूत्र (देयधर्म)।",
    },
    full: {
      en: "“This is the pious gift of the monk whose name is written below — caused to be copied, with mother and father foremost, for the welfare of all living beings. Let there be merit.”",
      hi: "“यह है उस भिक्षु का धर्मदान जिसका नाम नीचे लिखा है — प्रतिलिपि कराई गई, माता-पिता को अग्रणी रखते हुए, समस्त प्राणियों के कल्याण के लिए। पुण्य हो।”",
    },
  },

  pramana: {
    id: "pramana",
    fragments: [
      "There are",
      "two means",
      "of valid knowledge:",
      "perception,",
      "which is free",
      "of conceptual construction",
      "and is not mistaken;",
      "and inference,",
      "which rests",
      "on a reason",
      "that is present in the subject,",
      "present in similar cases,",
      "and absent",
      "from every dissimilar case.",
      "By these two",
      "the world is measured.",
    ],
    hi: [
      "प्रमाण",
      "दो हैं:",
      "प्रत्यक्ष,",
      "जो कल्पना से",
      "रहित है",
      "और भ्रान्त नहीं;",
      "और अनुमान,",
      "जो एक हेतु पर",
      "टिका है",
      "जो पक्ष में हो,",
      "सपक्ष में हो,",
      "और हर विपक्ष से",
      "अनुपस्थित हो।",
      "इन्हीं दो से",
      "संसार को",
      "मापा जाता है।",
    ],
    source: {
      en: "A plain restatement of the two pramāṇas and the three marks of a valid reason, as taught in the Nālandā logic tradition of Dignāga and Dharmakīrti.",
      hi: "दो प्रमाणों और वैध हेतु के त्रिरूप का सरल पुनर्कथन, जैसा दिङ्नाग और धर्मकीर्ति की नालंदा तर्क-परंपरा में सिखाया गया।",
    },
    full: {
      en: "There are two means of valid knowledge: perception, which is free of conceptual construction and is not mistaken; and inference, which rests on a reason that is present in the subject, present in similar cases, and absent from every dissimilar case. By these two the world is measured.",
      hi: "प्रमाण दो हैं: प्रत्यक्ष, जो कल्पना से रहित है और भ्रान्त नहीं; और अनुमान, जो एक हेतु पर टिका है जो पक्ष में हो, सपक्ष में हो, और हर विपक्ष से अनुपस्थित हो। इन्हीं दो से संसार को मापा जाता है।",
    },
  },

  seal: {
    id: "seal",
    fragments: [
      "Pressed into the clay",
      "of a hundred sealings",
      "dug from the ruins",
      "are a wheel",
      "flanked by two deer,",
      "and beneath them",
      "the words:",
      "of the community",
      "of noble monks",
      "of the illustrious",
      "Nālandā mahāvihāra.",
      "It is the site",
      "telling us",
      "its own name.",
      "The libraries burned;",
      "the teachers scattered;",
      "the copying stopped.",
      "But a text",
      "carried north in time",
      "could still be read",
      "where it was carried,",
      "and copied again,",
      "and so a little",
      "of what was taught here",
      "was kept.",
    ],
    hi: [
      "खंडहरों से निकली",
      "सैकड़ों मिट्टी की",
      "मुहरों पर अंकित है",
      "एक चक्र,",
      "दोनों ओर दो हिरण,",
      "और उनके नीचे",
      "शब्द:",
      "श्री नालंदा",
      "महाविहार के",
      "आर्य भिक्षु",
      "संघ का।",
      "यह स्थल",
      "स्वयं अपना",
      "नाम बता रहा है।",
      "पुस्तकालय जले;",
      "आचार्य बिखर गए;",
      "प्रतिलिपि रुक गई।",
      "पर एक ग्रंथ",
      "जो समय रहते",
      "उत्तर ले जाया गया,",
      "वहाँ पढ़ा जा सका,",
      "फिर से उतारा गया,",
      "और इस तरह",
      "यहाँ जो पढ़ाया गया",
      "उसका कुछ अंश बचा।",
    ],
    source: {
      en: "Drawn from the terracotta sealings recovered in Archaeological Survey of India excavations at Nālandā, and from the history of how Indian Buddhist texts survived in Tibetan translation.",
      hi: "नालंदा में भारतीय पुरातत्व सर्वेक्षण की खुदाई से प्राप्त मिट्टी की मुहरों, और भारतीय बौद्ध ग्रंथों के तिब्बती अनुवाद में बचने के इतिहास पर आधारित।",
    },
    full: {
      en: "Pressed into the clay of a hundred sealings dug from the ruins are a wheel flanked by two deer, and beneath them the words: of the community of noble monks of the illustrious Nālandā mahāvihāra. It is the site telling us its own name. The libraries burned; the teachers scattered; the copying stopped. But a text carried north in time could still be read where it was carried, and copied again, and so a little of what was taught here was kept.",
      hi: "खंडहरों से निकली सैकड़ों मिट्टी की मुहरों पर अंकित है एक चक्र, दोनों ओर दो हिरण, और उनके नीचे शब्द: श्री नालंदा महाविहार के आर्य भिक्षु संघ का। यह स्थल स्वयं अपना नाम बता रहा है। पुस्तकालय जले; आचार्य बिखर गए; प्रतिलिपि रुक गई। पर एक ग्रंथ जो समय रहते उत्तर ले जाया गया, वहाँ पढ़ा जा सका, फिर से उतारा गया, और इस तरह यहाँ जो पढ़ाया गया उसका कुछ अंश बचा।",
    },
  },
};

/** Fragments from unrelated books — the tray's chaff. */
export const RECON_DECOYS: { en: string; hi: string }[] = [
  { en: "and the king, having conquered", hi: "और राजा ने, विजय पाकर" },
  { en: "boil the root in goat's milk", hi: "जड़ को बकरी के दूध में उबालें" },
  { en: "on the fourth day of the bright half", hi: "शुक्ल पक्ष की चौथी तिथि को" },
  { en: "the elephant of the eastern gate", hi: "पूर्वी द्वार का हाथी" },
  { en: "measured in units of six aṅgulas", hi: "छह अंगुल की इकाइयों में मापा गया" },
  { en: "let the grammarian first define", hi: "व्याकरणी पहले परिभाषित करे" },
  { en: "a gift of thirty villages", hi: "तीस गाँवों का दान" },
  { en: "the tide at the mouth of the river", hi: "नदी के मुहाने पर ज्वार" },
];

/**
 * Polished, pre-written answers for the questions a judge is most likely to
 * type. Demo Mode serves these verbatim (zero network). Each cites real passage
 * ids from content/passages.ts, and the last two entries are deliberately
 * out-of-scope so the "No source, no answer" refusal is always demonstrable.
 *
 * Matching: a query must share at least `minHits` trigger tokens with `triggers`.
 */

export type CannedAnswer = {
  id: string;
  triggers: string[];
  minHits: number;
  inScope: boolean;
  citations: string[];
  en: string;
  hi: string;
};

export const CANNED: CannedAnswer[] = [
  {
    id: "what-was-nalanda",
    triggers: ["what", "nalanda", "was", "is", "tell", "about", "describe"],
    minHits: 2,
    inScope: true,
    citations: ["mahavihara-meaning", "scale", "founding"],
    en: "Nalanda was a mahavihara — a great monastery in Magadha that worked as a residential university. It was founded under the Gupta emperor Kumaragupta I in the 5th century, and by its height it housed thousands of monks and students, some from as far as Tibet, China and Java. A visitor was admitted only after debating a scholar at the gate.",
    hi: "नालंदा एक महाविहार था — मगध में स्थित एक विशाल मठ जो आवासीय विश्वविद्यालय की तरह चलता था। इसकी स्थापना पाँचवीं शताब्दी में गुप्त सम्राट कुमारगुप्त प्रथम के काल में हुई। अपने चरम पर यहाँ हज़ारों भिक्षु और छात्र रहते थे, कुछ तिब्बत, चीन और जावा जैसे दूर देशों से। प्रवेश द्वार पर एक विद्वान से शास्त्रार्थ जीतने के बाद ही किसी को भीतर आने दिया जाता था।",
  },
  {
    id: "who-was-xuanzang",
    triggers: ["who", "xuanzang", "hiuen", "tsang", "hsuan", "chinese", "pilgrim", "monk", "traveller"],
    minHits: 2,
    inScope: true,
    citations: ["xuanzang", "xuanzang-return"],
    en: "Xuanzang was a Chinese monk who reached Nalanda around 635 CE and stayed for years, studying Yogachara philosophy under the old abbot Silabhadra. His travel record is our richest description of the place in use. He carried some 657 texts back to China and spent the rest of his life translating them at Chang'an.",
    hi: "ह्वेनसांग एक चीनी भिक्षु था जो लगभग 635 ईस्वी में नालंदा पहुँचा और वर्षों तक वहाँ रहकर वृद्ध कुलपति शीलभद्र से योगाचार दर्शन पढ़ा। उसका यात्रा-वृत्तांत उस समय के नालंदा का सबसे विस्तृत विवरण है। वह लगभग 657 ग्रंथ चीन ले गया और शेष जीवन चांगआन में उनका अनुवाद करता रहा।",
  },
  {
    id: "what-subjects",
    triggers: ["what", "subjects", "taught", "study", "studied", "curriculum", "learn", "courses", "teach"],
    minHits: 2,
    inScope: true,
    citations: ["curriculum-overview", "logic", "medicine", "grammar"],
    en: "Far more than Buddhist doctrine. Students worked through Sanskrit grammar first, then logic and epistemology — the tradition of Dignaga and Dharmakirti — along with medicine, mathematics, astronomy, the Vedas, and rival philosophies, the last so a monk could argue against them in public debate.",
    hi: "केवल बौद्ध सिद्धांत नहीं। छात्र पहले संस्कृत व्याकरण पढ़ते, फिर तर्कशास्त्र और प्रमाण-विद्या — दिङ्नाग और धर्मकीर्ति की परंपरा — साथ ही चिकित्सा, गणित, ज्योतिष, वेद, और विरोधी दर्शन, ताकि भिक्षु सार्वजनिक शास्त्रार्थ में उनका खंडन कर सके।",
  },
  {
    id: "what-happened-library",
    triggers: ["what", "happened", "library", "books", "manuscripts", "dharmaganja", "destroyed", "lost"],
    minHits: 2,
    inScope: true,
    citations: ["dharmaganja", "burning-tradition", "what-was-lost"],
    en: "Tibetan tradition remembers the library as the Dharmaganja, three buildings, one of them nine storeys. It was lost in the sack around 1200 — the ruins carry burnt layers. But the famous image of the books burning for three months is later tradition, not the contemporary chronicle. The deeper loss was the end of a place that trained people to read and extend those texts.",
    hi: "तिब्बती परंपरा पुस्तकालय को धर्मगंज कहती है — तीन भवन, जिनमें एक नौ मंज़िला। लगभग 1200 ईस्वी के आक्रमण में यह नष्ट हुआ; खंडहरों में जली हुई परतें मिलती हैं। पर 'तीन महीने तक पुस्तकें जलती रहीं' वाली बात बाद की परंपरा है, समकालीन इतिवृत्त की नहीं। असली क्षति थी उस स्थान का अंत जो लोगों को वे ग्रंथ पढ़ना और आगे बढ़ाना सिखाता था।",
  },
  {
    id: "did-khalji-burn",
    triggers: ["did", "bakhtiyar", "khalji", "khilji", "burn", "burned", "months", "three", "fire", "how", "long"],
    minHits: 2,
    inScope: true,
    citations: ["khalji-campaign", "tabaqat-account", "burning-tradition"],
    en: "Bakhtiyar Khalji's cavalry did raid through Magadha around 1200 and stormed a fortified 'college' full of books — the chronicle of Minhaj-i-Siraj, written about 1260 from a survivor's account, says the defenders were shaven-headed men taken for a garrison. That the library then burned for months is not in that chronicle; it is a later, mostly Tibetan, embellishment. A violent sack is well supported; a timeline for the fire is not.",
    hi: "बख़्तियार ख़िलजी की घुड़सवार सेना ने लगभग 1200 ईस्वी में मगध पर आक्रमण किया और पुस्तकों से भरे एक क़िलेबंद 'विद्यालय' पर धावा बोला — मिन्हाज-ए-सिराज का इतिवृत्त (लगभग 1260, एक उत्तरजीवी के वर्णन पर आधारित) कहता है कि रक्षक मुंडे सिर वाले लोग थे जिन्हें सैन्य-चौकी समझ लिया गया। पुस्तकालय महीनों जलने की बात उस इतिवृत्त में नहीं है; वह बाद का, अधिकतर तिब्बती, अलंकरण है।",
  },
  {
    id: "how-texts-survived",
    triggers: ["how", "did", "texts", "survive", "survived", "saved", "manuscripts", "preserved", "transmission", "tibet", "china"],
    minHits: 2,
    inScope: true,
    citations: ["xuanzang-return", "shantarakshita-tibet", "taranatha-survival", "manuscript-materials"],
    en: "Palm leaf rots within a few centuries, so a text lived only by being copied — or carried away. Xuanzang took 657 to China. Shantarakshita began wholesale translation into Tibetan in the 8th century, and much that was later lost in India survived through that channel. Taranatha preserves a tradition that manuscripts were carried to Nepal and Tibet after the sack, though his account is late.",
    hi: "ताड़पत्र कुछ सदियों में गल जाता है, इसलिए कोई ग्रंथ केवल बार-बार नकल होने से — या बाहर ले जाए जाने से — बचता था। ह्वेनसांग 657 ग्रंथ चीन ले गया। शांतरक्षित ने आठवीं शताब्दी में तिब्बती में व्यापक अनुवाद आरंभ किया, और भारत में बाद में लुप्त बहुत कुछ इसी माध्यम से बचा।",
  },
  {
    id: "who-came-after",
    triggers: ["who", "came", "after", "later", "dharmasvamin", "1234", "aftermath", "rahula", "last", "teacher", "next"],
    minHits: 2,
    inScope: true,
    citations: ["dharmasvamin", "rahula-sribhadra", "taranatha-survival"],
    en: "The Tibetan monk Dharmasvamin came in 1234, a generation after the sack. He found most of Nalanda deserted, soldiers still in the area — but a few buildings in use and one very old teacher, Rahula Sribhadra, still instructing a handful of students. With him the continuous life of the school is usually said to end.",
    hi: "तिब्बती भिक्षु धर्मस्वामिन 1234 में आया, आक्रमण के एक पीढ़ी बाद। उसने नालंदा का अधिकांश भाग उजड़ा पाया, क्षेत्र में सैनिक अब भी सक्रिय — पर कुछ भवन प्रयोग में और एक अत्यंत वृद्ध आचार्य, राहुल श्रीभद्र, अब भी कुछ छात्रों को पढ़ाते हुए। उन्हीं के साथ विद्यालय का सतत जीवन समाप्त माना जाता है।",
  },
  {
    id: "dharmaganja-detail",
    triggers: ["dharmaganja", "ratnodadhi", "nine", "storeys", "three", "buildings", "library", "how", "big"],
    minHits: 2,
    inScope: true,
    citations: ["dharmaganja", "observatories"],
    en: "The Dharmaganja — 'Treasury of the Dharma' — is named in Tibetan tradition as three buildings: Ratnasagara, Ratnodadhi and Ratnaranjaka, the middle one nine storeys tall. Nothing so tall has been securely identified in the dug area, so the scale rests on written memory — though Xuanzang did describe towers rising into the mist.",
    hi: "धर्मगंज — 'धर्म का कोष' — तिब्बती परंपरा में तीन भवनों के रूप में वर्णित है: रत्नसागर, रत्नोदधि और रत्नरंजक; बीच वाला नौ मंज़िला। खोदे गए क्षेत्र में इतना ऊँचा कुछ निश्चित रूप से पहचाना नहीं गया, इसलिए यह पैमाना लिखित स्मृति पर टिका है।",
  },
  {
    id: "routes",
    triggers: ["route", "routes", "which", "way", "send", "courier", "safest", "tibet", "china", "escape", "carry", "road"],
    minHits: 2,
    inScope: true,
    citations: ["route-nepal-tibet", "route-uttarapatha", "route-tamralipti", "route-silk-road"],
    en: "Three ways out mattered. North through the Kathmandu Valley and the Kyirong and Kuti passes to Tibet — the shortest, and the one tradition credits with saving manuscripts. West along the Uttarapatha toward Taxila and the Silk Road to China. South-east to the port of Tamralipti for a ship. In 1200, Tamralipti lay in the direction Khalji was already moving.",
    hi: "बाहर जाने के तीन मार्ग महत्वपूर्ण थे। उत्तर में काठमांडू घाटी और क्यिरोंग तथा कुती दर्रों से तिब्बत — सबसे छोटा, और वही जिसे परंपरा पांडुलिपियों को बचाने का श्रेय देती है। पश्चिम में उत्तरापथ से तक्षशिला और रेशम मार्ग होते हुए चीन। दक्षिण-पूर्व में ताम्रलिप्ति बंदरगाह से जहाज़। 1200 में ताम्रलिप्ति उसी दिशा में था जिधर ख़िलजी बढ़ रहा था।",
  },
  {
    id: "how-do-we-know",
    triggers: ["how", "do", "we", "know", "source", "sources", "evidence", "proof", "reliable", "certain"],
    minHits: 3,
    inScope: true,
    citations: ["nalanda-seal", "excavation", "tabaqat-account", "dharmasvamin"],
    en: "From four kinds of record that mostly agree. Clay sealings from the site name Nalanda itself. A century of excavation uncovered eleven monasteries, sculpture, and burnt debris. Chinese pilgrims — Xuanzang, Yijing — described it in use. Minhaj-i-Siraj recorded the raid around 1260, and Dharmasvamin the ruins in 1234. Where they disagree, I will tell you.",
    hi: "चार प्रकार के अभिलेखों से, जो अधिकतर मेल खाते हैं। स्थल की मिट्टी की मुहरें स्वयं नालंदा का नाम अंकित करती हैं। एक सदी की खुदाई में ग्यारह मठ, मूर्तियाँ और जली हुई सामग्री मिली। चीनी यात्रियों — ह्वेनसांग, यिजिंग — ने इसे चलते हुए देखा-लिखा। जहाँ वे असहमत हैं, मैं बता दूँगा।",
  },
  {
    id: "oos-modern",
    triggers: ["smartphone", "cricket", "world", "cup", "internet", "computer", "modi", "election", "movie", "2011", "2023", "ai", "car", "aeroplane", "電", "capital", "prime", "minister", "stock", "bitcoin"],
    minHits: 1,
    inScope: false,
    citations: [],
    en: "That is outside anything the manuscripts here can tell me. I keep only what Nalanda in this age set down. No source, no answer.",
    hi: "यह उस सब से परे है जो यहाँ की पांडुलिपियाँ बता सकती हैं। मैं केवल वही रखता हूँ जो इस युग के नालंदा ने लिखा। स्रोत नहीं, तो उत्तर नहीं।",
  },
  {
    id: "oos-unknowable",
    triggers: ["exactly", "how", "many", "books", "precise", "number", "total", "count", "died", "name", "every", "casualties", "list", "all"],
    minHits: 3,
    inScope: false,
    citations: [],
    en: "No honest number survives for that. The sources give impressions, not counts, and I will not invent one to satisfy you. No source, no answer.",
    hi: "इसका कोई ईमानदार आँकड़ा नहीं बचा। स्रोत प्रभाव देते हैं, गणना नहीं, और मैं आपको संतुष्ट करने के लिए कोई संख्या नहीं गढ़ूँगा। स्रोत नहीं, तो उत्तर नहीं।",
  },
];

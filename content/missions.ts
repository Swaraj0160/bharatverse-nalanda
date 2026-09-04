/** Content for the three Scriptorium missions. Interaction lives in components. */

export type Bundle = {
  id: string;
  title: { en: string; hi: string };
  subject: { en: string; hi: string };
  savedOutcome: { en: string; hi: string };
  lostOutcome: { en: string; hi: string };
  passageId: string;
  fromChest?: boolean;
};

export const TRIAGE_KEEP = 3;

export const BUNDLES: Bundle[] = [
  {
    id: "healer",
    title: { en: "The Healer's Compendium", hi: "वैद्य का संग्रह" },
    subject: { en: "Medicine · chikitsavidya", hi: "चिकित्सा · चिकित्साविद्या" },
    savedOutcome: {
      en: "The physicians of the valley keep their drug formulas and their surgery. Sick villagers are still treated a century from now.",
      hi: "घाटी के वैद्य अपने औषधि-नुस्खे और शल्यक्रिया बचा लेते हैं। एक सदी बाद भी रोगी ग्रामीणों का उपचार होता है।",
    },
    lostOutcome: {
      en: "A working medical tradition thins to hearsay. Remedies are relearned slowly, and wrongly.",
      hi: "एक जीवंत चिकित्सा-परंपरा सुनी-सुनाई बात रह जाती है। नुस्खे धीरे-धीरे और ग़लत ढंग से फिर सीखे जाते हैं।",
    },
    passageId: "medicine",
  },
  {
    id: "chronicle",
    title: { en: "The Pala Court Chronicle", hi: "पाल राजसभा का वृत्तांत" },
    subject: { en: "History · the donors' record", hi: "इतिहास · दानदाताओं का अभिलेख" },
    savedOutcome: {
      en: "We keep the names of the kings who paid for these walls, and the villages whose revenue fed the hall.",
      hi: "इन दीवारों के लिए धन देने वाले राजाओं के नाम, और जिन गाँवों के राजस्व से कक्ष चला, वे सुरक्षित रहते हैं।",
    },
    lostOutcome: {
      en: "A dynasty's record survives only in stone inscriptions and a few copperplates. Much of the rest is guesswork.",
      hi: "एक राजवंश का अभिलेख केवल शिलालेखों और कुछ ताम्रपत्रों में बचता है। शेष अधिकतर अनुमान है।",
    },
    passageId: "pala-patronage",
  },
  {
    id: "grammar",
    title: { en: "Panini, with the Kashika", hi: "पाणिनि, काशिका सहित" },
    subject: { en: "Grammar · shabdavidya", hi: "व्याकरण · शब्दविद्या" },
    savedOutcome: {
      en: "Students in other halls can still parse the old sutras closely. The gate of grammar stays open.",
      hi: "अन्य कक्षों के छात्र अब भी पुराने सूत्रों को बारीकी से पढ़ सकते हैं। व्याकरण का द्वार खुला रहता है।",
    },
    lostOutcome: {
      en: "Reading the scriptures precisely becomes a lost skill for a generation, until copies are gathered from far away.",
      hi: "एक पीढ़ी तक शास्त्रों का सटीक पठन एक खोया हुआ कौशल बन जाता है, जब तक दूर से प्रतियाँ न जुटाई जाएँ।",
    },
    passageId: "grammar",
  },
  {
    id: "prajna",
    title: { en: "The Eight Thousand Lines, illuminated", hi: "अष्टसाहस्रिका, चित्रित" },
    subject: { en: "Prajnaparamita · with painted panels", hi: "प्रज्ञापारमिता · चित्र-फलकों सहित" },
    savedOutcome: {
      en: "The painted panels — the deities, the scenes — travel north intact. Copies made in Tibet carry the images forward.",
      hi: "चित्र-फलक — देवता, दृश्य — अक्षत उत्तर की ओर जाते हैं। तिब्बत में बनी प्रतियाँ उन चित्रों को आगे ले जाती हैं।",
    },
    lostOutcome: {
      en: "Only plain, unillustrated copies of the text remain. The Nalanda painting style survives in fragments elsewhere.",
      hi: "पाठ की केवल सादी, अचित्रित प्रतियाँ बचती हैं। नालंदा की चित्रशैली कहीं और टुकड़ों में बचती है।",
    },
    passageId: "prajnaparamita-mss",
  },
  {
    id: "logic",
    title: { en: "Dharmakirti on Valid Knowledge", hi: "धर्मकीर्ति: प्रमाण पर" },
    subject: { en: "Logic · the Pramanavarttika", hi: "तर्क · प्रमाणवार्त्तिक" },
    savedOutcome: {
      en: "The rules of inference and debate reach Tibet whole. Philosophers there argue by them for eight hundred years.",
      hi: "अनुमान और शास्त्रार्थ के नियम तिब्बत तक पूर्ण पहुँचते हैं। वहाँ दार्शनिक आठ सौ वर्ष तक उन्हीं से तर्क करते हैं।",
    },
    lostOutcome: {
      en: "Logicians abroad reconstruct the system from memory and secondhand summaries, with gaps that take centuries to notice.",
      hi: "विदेश में तार्किक इस पद्धति को स्मृति और परोक्ष सारांशों से पुनर्निर्मित करते हैं, ऐसी कमियों के साथ जिन्हें पहचानने में सदियाँ लगती हैं।",
    },
    passageId: "dignaga-dharmakirti",
  },
  {
    id: "tantra",
    title: { en: "The bound texts from the locked chest", hi: "बंद संदूक के जकड़े ग्रंथ" },
    subject: { en: "A contested corpus · sealed away", hi: "एक विवादित संग्रह · मुहरबंद" },
    savedOutcome: {
      en: "A difficult, much-argued body of practice survives in its own words rather than in the words of those who despised it.",
      hi: "एक कठिन, अत्यधिक विवादित साधना-संग्रह अपने ही शब्दों में बचता है, न कि उनके शब्दों में जिन्होंने उससे घृणा की।",
    },
    lostOutcome: {
      en: "It is remembered only through hostile summaries. What it actually said is argued over with nothing to check against.",
      hi: "यह केवल शत्रुतापूर्ण सारांशों से याद रखा जाता है। इसने वास्तव में क्या कहा, इस पर बिना किसी प्रमाण के विवाद होता रहता है।",
    },
    passageId: "what-was-lost",
    fromChest: true,
  },
];

/* ---- The Fragment: a colophon-matching puzzle ---- */

export type GlossPair = {
  id: string;
  term: string;
  gloss: { en: string; hi: string };
};

export const COLOPHON_PAIRS: GlossPair[] = [
  { id: "deyadharma", term: "deyadharmo 'yaṃ", gloss: { en: "this is the pious gift", hi: "यह धर्मदान है" } },
  { id: "likhapita", term: "likhāpitaṃ", gloss: { en: "caused to be written", hi: "लिखवाया गया" } },
  { id: "punya", term: "puṇyaṃ bhavatu", gloss: { en: "let there be merit", hi: "पुण्य हो" } },
  { id: "sarvasattva", term: "sarva-sattvānāṃ", gloss: { en: "for all living beings", hi: "समस्त प्राणियों के लिए" } },
  { id: "matapitr", term: "mātā-pitṛ-pūrvaṃgamaṃ", gloss: { en: "mother and father foremost", hi: "माता-पिता को अग्रणी रखते हुए" } },
];

export const COLOPHON_FULL = {
  en: "“This is the pious gift … caused to be written … mother and father foremost … for all living beings … let there be merit.” It is the standard closing formula a scribe or a donor added to a finished manuscript.",
  hi: "“यह धर्मदान है … लिखवाया गया … माता-पिता को अग्रणी रखते हुए … समस्त प्राणियों के लिए … पुण्य हो।” यह वह मानक समापन-सूत्र है जो कोई लिपिक या दानदाता पूर्ण पांडुलिपि के अंत में जोड़ता था।",
  passageIds: ["manuscript-materials", "prajnaparamita-mss"],
};

/* ---- The Courier: choose a road ---- */

export type Route = {
  id: string;
  name: { en: string; hi: string };
  line: { en: string; hi: string };
  outcome: { en: string; hi: string };
  grade: "best" | "partial" | "worst";
  passageId: string;
  nodeId: string;
};

export const ROUTES: Route[] = [
  {
    id: "nepal",
    name: { en: "North — the Kathmandu Valley and the passes", hi: "उत्तर — काठमांडू घाटी और दर्रे" },
    line: {
      en: "Shortest to Buddhist Tibet. Tibetan monks walk it in both directions every season.",
      hi: "बौद्ध तिब्बत तक सबसे छोटा। तिब्बती भिक्षु हर मौसम में इसे दोनों दिशाओं में तय करते हैं।",
    },
    outcome: {
      en: "The bundle reaches a monastery beyond the Kyirong pass within the month. This is the road later tradition credits with saving what was saved.",
      hi: "गट्ठर महीने भर में क्यिरोंग दर्रे के पार एक मठ तक पहुँच जाता है। बाद की परंपरा जो बचा उसे बचाने का श्रेय इसी मार्ग को देती है।",
    },
    grade: "best",
    passageId: "route-nepal-tibet",
    nodeId: "nepal-route",
  },
  {
    id: "uttarapatha",
    name: { en: "West — the Uttarapatha toward the Silk Road", hi: "पश्चिम — उत्तरापथ, रेशम मार्ग की ओर" },
    line: {
      en: "The great northern road to Taxila, and beyond it the oasis route to China.",
      hi: "तक्षशिला तक की विशाल उत्तरी सड़क, और उससे आगे चीन तक का मरूद्यान-मार्ग।",
    },
    outcome: {
      en: "The bundle travels for two years through several kingdoms and one bad winter. Some leaves arrive water-stained; most arrive. It is long, and it depends on the politics of every stage.",
      hi: "गट्ठर दो वर्ष कई राज्यों और एक कठोर शीत से होकर चलता है। कुछ पत्र जल-दाग़ के साथ पहुँचते हैं; अधिकांश पहुँच जाते हैं। यह लंबा है और हर पड़ाव की राजनीति पर निर्भर है।",
    },
    grade: "partial",
    passageId: "route-uttarapatha",
    nodeId: "uttarapatha",
  },
  {
    id: "tamralipti",
    name: { en: "South-east — the port of Tamralipti", hi: "दक्षिण-पूर्व — ताम्रलिप्ति बंदरगाह" },
    line: {
      en: "Take ship for Sri Lanka or the eastern islands. Xuanzang's contemporaries sailed from here.",
      hi: "श्रीलंका या पूर्वी द्वीपों के लिए जहाज़ लें। ह्वेनसांग के समकालीन यहीं से रवाना हुए।",
    },
    outcome: {
      en: "The rider turns south-east — the same direction Khalji's force is already moving. The road is cut before the coast. The bundle does not reach the port.",
      hi: "सवार दक्षिण-पूर्व मुड़ता है — उसी दिशा में जिधर ख़िलजी की सेना पहले से बढ़ रही है। तट से पहले मार्ग कट जाता है। गट्ठर बंदरगाह तक नहीं पहुँचता।",
    },
    grade: "worst",
    passageId: "route-tamralipti",
    nodeId: "tamralipti",
  },
];

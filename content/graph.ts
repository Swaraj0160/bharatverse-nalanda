/**
 * The heritage knowledge graph behind the Historian panel. Hand-authored, not a
 * graph database — a curated JSON graph is indistinguishable in a demo and has
 * zero operational cost. When an answer cites a passage, that passage's `nodes`
 * are highlighted here and their incident edges pulse.
 */

export type NodeType =
  | "place"
  | "person"
  | "text"
  | "concept"
  | "institution"
  | "event"
  | "route"
  | "artifact";

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  blurb: string;
};

export type GraphLink = {
  source: string;
  target: string;
  kind: string;
};

export const NODES: GraphNode[] = [
  { id: "nalanda", label: "Nalanda Mahavihara", type: "institution", blurb: "The residential monastery-university in Magadha, c. 5th–13th c. CE." },
  { id: "dharmaganja", label: "Dharmaganja (library)", type: "institution", blurb: "The library quarter of Tibetan memory: Ratnasagara, Ratnodadhi, Ratnaranjaka." },
  { id: "ratnodadhi", label: "Ratnodadhi", type: "institution", blurb: "The library building remembered as nine storeys tall." },
  { id: "magadha", label: "Magadha", type: "place", blurb: "The region of the middle Ganges, modern Bihar." },
  { id: "pataliputra", label: "Pataliputra", type: "place", blurb: "The old imperial capital near Nalanda; modern Patna." },
  { id: "rajgir", label: "Rajgir", type: "place", blurb: "Ancient Rajagriha, a short distance from the monastery." },
  { id: "bodh-gaya", label: "Bodh Gaya", type: "place", blurb: "The site of the Buddha's awakening, within reach of Nalanda." },
  { id: "guptas", label: "Gupta dynasty", type: "person", blurb: "The imperial house under which Nalanda was founded." },
  { id: "kumaragupta", label: "Kumaragupta I", type: "person", blurb: "Gupta emperor credited with the original foundation." },
  { id: "harsha", label: "Harsha", type: "person", blurb: "7th-century emperor of north India and a benefactor of Nalanda." },
  { id: "pala", label: "Pala dynasty", type: "person", blurb: "Buddhist rulers of Bengal and Bihar, Nalanda's patrons 8th–12th c." },
  { id: "dharmapala", label: "Dharmapala (Pala king)", type: "person", blurb: "Pala ruler named as a donor in inscriptions from the site." },
  { id: "devapala", label: "Devapala", type: "person", blurb: "Pala king; his copperplate records a grant for a Srivijaya-built monastery at Nalanda." },
  { id: "srivijaya", label: "Srivijaya", type: "place", blurb: "The maritime realm of Sumatra whose king endowed a monastery at Nalanda." },
  { id: "xuanzang", label: "Xuanzang", type: "person", blurb: "Chinese pilgrim who studied at Nalanda c. 635–643 CE and recorded it." },
  { id: "huili", label: "Huili", type: "person", blurb: "Xuanzang's disciple and biographer." },
  { id: "yijing", label: "Yijing", type: "person", blurb: "Chinese monk who documented Nalanda's monastic life, 670s–680s." },
  { id: "silabhadra", label: "Silabhadra", type: "person", blurb: "Aged abbot of Nalanda and authority on Yogachara." },
  { id: "nagarjuna", label: "Nagarjuna", type: "person", blurb: "Founder of Madhyamaka philosophy, linked to Nalanda by tradition." },
  { id: "dignaga", label: "Dignaga", type: "person", blurb: "5th–6th c. founder of the Buddhist logic tradition." },
  { id: "dharmakirti", label: "Dharmakirti", type: "person", blurb: "7th-c. logician; author of the Pramanavarttika." },
  { id: "shantarakshita", label: "Shantarakshita", type: "person", blurb: "8th-c. Nalanda scholar who carried the tradition to Tibet." },
  { id: "atisha", label: "Atisha Dipankara", type: "person", blurb: "11th-c. teacher of the Nalanda tradition who reformed Tibetan Buddhism." },
  { id: "bakhtiyar-khalji", label: "Bakhtiyar Khalji", type: "person", blurb: "Turkic commander of the Ghurid conquest who raided Magadha c. 1200." },
  { id: "minhaj", label: "Minhaj-i-Siraj", type: "person", blurb: "Persian chronicler who recorded the raid c. 1260 from a survivor's report." },
  { id: "dharmasvamin", label: "Dharmasvamin", type: "person", blurb: "Tibetan monk who found Nalanda mostly ruined in 1234 CE." },
  { id: "rahula-sribhadra", label: "Rahula Sribhadra", type: "person", blurb: "The aged last head of teaching, met by Dharmasvamin." },
  { id: "taranatha", label: "Taranatha", type: "person", blurb: "17th-c. Tibetan historian who preserved late traditions about Nalanda." },
  { id: "tabaqat", label: "Tabaqat-i-Nasiri", type: "text", blurb: "Minhaj-i-Siraj's Persian chronicle, c. 1260 — the contemporary account of the raid." },
  { id: "prajnaparamita", label: "Prajnaparamita corpus", type: "text", blurb: "The 'Perfection of Wisdom' sutras, central to Nalanda's Mahayana teaching." },
  { id: "ashtasahasrika", label: "Ashtasahasrika (8,000 lines)", type: "text", blurb: "The Perfection of Wisdom in Eight Thousand Lines; survives in illuminated copies." },
  { id: "abhidharmakosha", label: "Abhidharmakosha", type: "text", blurb: "Vasubandhu's verse summary of Buddhist psychology; a core teaching text." },
  { id: "pramanavarttika", label: "Pramanavarttika", type: "text", blurb: "Dharmakirti's treatise on valid knowledge; required study." },
  { id: "hetuvidya", label: "Hetuvidya (logic)", type: "concept", blurb: "The 'science of reasons' — formal logic and epistemology." },
  { id: "shabdavidya", label: "Shabdavidya (grammar)", type: "concept", blurb: "The study of language, beginning with Panini's Sanskrit grammar." },
  { id: "chikitsavidya", label: "Chikitsavidya (medicine)", type: "concept", blurb: "Medical learning drawn from the Ayurvedic tradition." },
  { id: "yogachara", label: "Yogachara", type: "concept", blurb: "The 'mind-only' school analysing experience as a transformation of consciousness." },
  { id: "madhyamaka", label: "Madhyamaka", type: "concept", blurb: "The 'Middle Way' — all things empty of independent existence." },
  { id: "palm-leaf", label: "Palm-leaf manuscript", type: "artifact", blurb: "Dried, trimmed leaves strung between boards; the physical form of a book here." },
  { id: "nalanda-seal", label: "Nalanda sealings", type: "artifact", blurb: "Clay seals naming 'the community of noble monks of the illustrious Nalanda mahavihara'." },
  { id: "sariputra-stupa", label: "Stupa of Sariputra", type: "artifact", blurb: "The largest temple at the site, rebuilt in seven phases." },
  { id: "vikramashila", label: "Vikramashila", type: "institution", blurb: "Pala-founded mahavihara, a rival centre of learning." },
  { id: "odantapuri", label: "Odantapuri", type: "institution", blurb: "Pala-founded mahavihara near Nalanda." },
  { id: "samye", label: "Samye", type: "institution", blurb: "The first Tibetan monastery, co-founded by Shantarakshita." },
  { id: "tibet", label: "Tibet", type: "place", blurb: "Destination of Nalanda's teachers and, by tradition, its rescued manuscripts." },
  { id: "chang-an", label: "Chang'an", type: "place", blurb: "The Tang capital where Xuanzang translated the texts he carried back." },
  { id: "tamralipti", label: "Tamralipti", type: "place", blurb: "Bengal port for ships to Sri Lanka, Southeast Asia and China." },
  { id: "uttarapatha", label: "Uttarapatha", type: "route", blurb: "The great northern road across the Ganges plain toward the northwest." },
  { id: "nepal-route", label: "Nepal–Tibet passes", type: "route", blurb: "North through the Kathmandu Valley over the Kyirong and Kuti passes." },
  { id: "silk-road", label: "Silk Road", type: "route", blurb: "The oasis route through the Tarim Basin to China." },
];

export const LINKS: GraphLink[] = [
  { source: "nalanda", target: "magadha", kind: "stood in" },
  { source: "nalanda", target: "dharmaganja", kind: "held" },
  { source: "dharmaganja", target: "ratnodadhi", kind: "included" },
  { source: "guptas", target: "nalanda", kind: "founded" },
  { source: "kumaragupta", target: "nalanda", kind: "founded" },
  { source: "kumaragupta", target: "guptas", kind: "of" },
  { source: "harsha", target: "nalanda", kind: "endowed" },
  { source: "pala", target: "nalanda", kind: "patronised" },
  { source: "dharmapala", target: "pala", kind: "of" },
  { source: "devapala", target: "pala", kind: "of" },
  { source: "dharmapala", target: "nalanda", kind: "endowed" },
  { source: "devapala", target: "srivijaya", kind: "granted land to" },
  { source: "srivijaya", target: "nalanda", kind: "built a monastery at" },
  { source: "xuanzang", target: "nalanda", kind: "studied at" },
  { source: "xuanzang", target: "silabhadra", kind: "studied under" },
  { source: "xuanzang", target: "yogachara", kind: "carried east" },
  { source: "xuanzang", target: "chang-an", kind: "translated at" },
  { source: "xuanzang", target: "silk-road", kind: "travelled" },
  { source: "xuanzang", target: "abhidharmakosha", kind: "transmitted" },
  { source: "huili", target: "xuanzang", kind: "wrote the life of" },
  { source: "yijing", target: "nalanda", kind: "studied at" },
  { source: "yijing", target: "tamralipti", kind: "sailed from" },
  { source: "silabhadra", target: "nalanda", kind: "led" },
  { source: "silabhadra", target: "yogachara", kind: "taught" },
  { source: "nagarjuna", target: "madhyamaka", kind: "founded" },
  { source: "nagarjuna", target: "nalanda", kind: "linked by tradition to" },
  { source: "dignaga", target: "hetuvidya", kind: "founded" },
  { source: "dharmakirti", target: "hetuvidya", kind: "systematised" },
  { source: "dharmakirti", target: "pramanavarttika", kind: "wrote" },
  { source: "dignaga", target: "dharmakirti", kind: "preceded" },
  { source: "shantarakshita", target: "nalanda", kind: "taught at" },
  { source: "shantarakshita", target: "samye", kind: "co-founded" },
  { source: "shantarakshita", target: "tibet", kind: "carried the tradition to" },
  { source: "shantarakshita", target: "madhyamaka", kind: "synthesised" },
  { source: "samye", target: "tibet", kind: "in" },
  { source: "atisha", target: "vikramashila", kind: "linked to" },
  { source: "atisha", target: "tibet", kind: "reformed Buddhism in" },
  { source: "pala", target: "vikramashila", kind: "founded" },
  { source: "pala", target: "odantapuri", kind: "founded" },
  { source: "vikramashila", target: "nalanda", kind: "drew scholars from" },
  { source: "bakhtiyar-khalji", target: "magadha", kind: "raided" },
  { source: "bakhtiyar-khalji", target: "nalanda", kind: "sacked (c. 1200)" },
  { source: "minhaj", target: "tabaqat", kind: "wrote" },
  { source: "minhaj", target: "bakhtiyar-khalji", kind: "chronicled" },
  { source: "tabaqat", target: "bakhtiyar-khalji", kind: "records the raid of" },
  { source: "dharmasvamin", target: "nalanda", kind: "visited in 1234" },
  { source: "dharmasvamin", target: "rahula-sribhadra", kind: "studied with" },
  { source: "dharmasvamin", target: "tibet", kind: "returned to" },
  { source: "rahula-sribhadra", target: "nalanda", kind: "last led teaching at" },
  { source: "taranatha", target: "nalanda", kind: "preserved traditions of" },
  { source: "taranatha", target: "tibet", kind: "wrote in" },
  { source: "prajnaparamita", target: "ashtasahasrika", kind: "includes" },
  { source: "ashtasahasrika", target: "palm-leaf", kind: "survives as" },
  { source: "nalanda", target: "prajnaparamita", kind: "taught" },
  { source: "nalanda", target: "hetuvidya", kind: "taught" },
  { source: "nalanda", target: "shabdavidya", kind: "taught" },
  { source: "nalanda", target: "chikitsavidya", kind: "taught" },
  { source: "nalanda", target: "yogachara", kind: "taught" },
  { source: "nalanda", target: "madhyamaka", kind: "taught" },
  { source: "abhidharmakosha", target: "silabhadra", kind: "taught by" },
  { source: "nalanda", target: "nalanda-seal", kind: "identified by" },
  { source: "nalanda", target: "sariputra-stupa", kind: "centred on" },
  { source: "sariputra-stupa", target: "bodh-gaya", kind: "near" },
  { source: "nalanda", target: "pataliputra", kind: "near" },
  { source: "nalanda", target: "rajgir", kind: "near" },
  { source: "uttarapatha", target: "silk-road", kind: "joins" },
  { source: "nalanda", target: "uttarapatha", kind: "connected by" },
  { source: "nalanda", target: "nepal-route", kind: "connected by" },
  { source: "nepal-route", target: "tibet", kind: "leads to" },
  { source: "silk-road", target: "chang-an", kind: "leads to" },
  { source: "tamralipti", target: "tibet", kind: "sea link toward" },
  { source: "dharmaganja", target: "palm-leaf", kind: "shelved" },
  { source: "dharmaganja", target: "taranatha", kind: "described by" },
];

export const NODE_BY_ID: Record<string, GraphNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

export const NODE_TYPE_COLOR: Record<NodeType, string> = {
  place: "#2E4C7E",
  person: "#B23A2E",
  text: "#9C5233",
  concept: "#5B7B5A",
  institution: "#1B1712",
  event: "#B23A2E",
  route: "#D9A63F",
  artifact: "#C7924B",
};

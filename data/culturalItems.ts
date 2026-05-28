// data/culturalItems.ts
// ALL images sourced from Wikimedia Commons (CC-licensed, free to use).
// URLs use the Special:FilePath redirect which resolves to the actual file.
// Every image is authentic Sindhi / Indus Valley cultural content.

export type Category = 'All' | 'Clothing' | 'Crafts' | 'Food' | 'Music';

export interface CulturalItem {
  id: string;
  name: string;
  nameSindhi: string;
  category: Exclude<Category, 'All'>;
  description: string;
  origin: string;
  imageUrl: string;         // Primary image
  galleryImages?: string[]; // Extra carousel images for this item
  accentColor: string;
  tags: string[];
}

// Wikimedia Commons Special:FilePath — each resolves to the actual CC image
const WM = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

export const FALLBACK_CULTURAL_ITEMS: CulturalItem[] = [
  // ── Crafts ───────────────────────────────────────────────────────────────
  {
    id: 'ajrak-1',
    name: 'Ajrak',
    nameSindhi: 'اجرڪ',
    category: 'Crafts',
    description:
      'The soul of Sindhi identity — a block-printed shawl made with natural indigo and madder dyes. Its intricate geometric patterns take weeks to complete and have been crafted in Sindh for over 4,000 years.',
    origin: 'Bhit Shah, Hala & Khairpur',
    imageUrl: WM('Ajrak Chadar.jpg'),
    galleryImages: [
      WM('Sindhi Ajrak.jpg'),
      WM('A boy with Sindhi Ajrak.jpg'),
    ],
    accentColor: '#1B3F8B',
    tags: ['ajrak', 'textile', 'block print', 'indigo'],
  },
  {
    id: 'mohenjo-daro-1',
    name: 'Mohenjo-daro',
    nameSindhi: 'موهن جو دڙو',
    category: 'Crafts',
    description:
      'One of the world\'s earliest major cities, built c. 2500 BCE in Larkana District, Sindh. A UNESCO World Heritage Site, its ruins reveal remarkable urban planning, drainage systems, and a thriving Indus Valley civilisation.',
    origin: 'Larkana District',
    imageUrl: WM('Mohenjo-daro Stupa and Granary.jpeg'),
    galleryImages: [
      WM('Mohenjodaro-Sindh.jpg'),
      WM('Mohenjo-daro,_Sindh.jpg'),
    ],
    accentColor: '#7D5A2F',
    tags: ['mohenjo-daro', 'indus valley', 'archaeology', 'UNESCO'],
  },
  {
    id: 'rilli-1',
    name: 'Rilli Quilt',
    nameSindhi: 'رلي',
    category: 'Crafts',
    description:
      'Colourful patchwork quilts stitched by Sindhi women as heirlooms and gifts. Each rilli tells a story through bold geometric shapes, bright contrasting fabrics, and the patience of generations.',
    origin: 'Rural Sindh',
    imageUrl: WM('Sewings.jpg'),
    galleryImages: [WM('Cultural dressed woman.jpg')],
    accentColor: '#B03A2E',
    tags: ['rilli', 'quilt', 'patchwork', 'handicraft'],
  },
  {
    id: 'kashi-1',
    name: 'Kashi Tile Work',
    nameSindhi: 'ڪاشي',
    category: 'Crafts',
    description:
      'Vibrant blue-and-white glazed tilework adorning the shrines and mosques of Sindh. This 500-year-old tradition from the Samma dynasty era reaches its finest expression in Hala and the Shah Jahan Mosque at Thatta.',
    origin: 'Hala & Thatta',
    imageUrl: WM('Makli_hill_Sindh_Pakistan.jpg'),
    galleryImages: [],
    accentColor: '#1F618D',
    tags: ['kashi', 'tile', 'pottery', 'Thatta'],
  },
  {
    id: 'embroidery-1',
    name: 'Sindhi Embroidery',
    nameSindhi: 'سنڌي ڀرت',
    category: 'Crafts',
    description:
      'Dazzling mirror-work and thread embroidery adorning women\'s garments, caps, and home textiles. Each stitch carries regional identity — patterns from Tharparkar differ strikingly from those of Hyderabad.',
    origin: 'Tharparkar, Umerkot & Hyderabad',
    imageUrl: WM('A Sindhi kid with cultural dress at village.jpg'),
    galleryImages: [WM('Group of Sindhi girls in traditional clothes.jpg')],
    accentColor: '#8E44AD',
    tags: ['embroidery', 'mirrorwork', 'handicraft', 'textile'],
  },

  // ── Clothing ─────────────────────────────────────────────────────────────
  {
    id: 'sindhi-topi-1',
    name: 'Sindhi Topi',
    nameSindhi: 'سنڌي ٽوپي',
    category: 'Clothing',
    description:
      'The embroidered skullcap worn by Sindhi men as a mark of cultural pride. Together with the Ajrak, it is the most recognisable symbol of Sindhi identity, celebrated each year on Sindhi Cultural Day.',
    origin: 'Tharparkar & Umerkot',
    imageUrl: WM('Saraiki Topi (Sindhi Cap).jpg'),
    galleryImages: [WM('A Sindhi boy with Arjak turban.jpg')],
    accentColor: '#922B21',
    tags: ['topi', 'cap', 'embroidery', 'mirror work'],
  },
  {
    id: 'traditional-dress-1',
    name: 'Traditional Sindhi Dress',
    nameSindhi: 'سنڌي لباس',
    category: 'Clothing',
    description:
      'Sindhi women wear richly embroidered kamiz with ghagra skirts, adorned with mirrors, shells, and beads. The colours are bold and celebratory — reds, oranges, and greens set against deep black.',
    origin: 'Sindh-wide',
    imageUrl: WM('Cultural dressed woman.jpg'),
    galleryImages: [WM('Group of Sindhi girls in traditional clothes.jpg')],
    accentColor: '#C0392B',
    tags: ['dress', 'kamiz', 'ghagra', 'women'],
  },

  // ── Food ─────────────────────────────────────────────────────────────────
  {
    id: 'thari-food-1',
    name: 'Thar Desert Food',
    nameSindhi: 'ٿري کاڌو',
    category: 'Food',
    description:
      'The cuisine of the Thar Desert is built on ghee, lentils, millet, and camel milk — simple ingredients transformed into nourishing, flavourful dishes that have sustained desert communities for centuries.',
    origin: 'Tharparkar',
    imageUrl: WM('Acessories of Kitchen.jpg'),
    galleryImages: [],
    accentColor: '#D4AC0D',
    tags: ['thar', 'food', 'desert', 'lentils'],
  },
  {
    id: 'folk-singing-1',
    name: 'Folk Singing of Thar',
    nameSindhi: 'ٿر جي لوڪ موسيقي',
    category: 'Music',
    description:
      'The haunting folk music of the Thar Desert — sung by women and men in devotion and celebration. These songs carry the stories of Shah Abdul Latif Bhittai and ancient Sindhi love legends.',
    origin: 'Tharparkar',
    imageUrl: WM('Folk Singing in Thar Sindh Pakistan.jpg'),
    galleryImages: [],
    accentColor: '#784212',
    tags: ['folk', 'singing', 'Thar', 'music'],
  },

  // ── Music ─────────────────────────────────────────────────────────────────
  {
    id: 'surando-1',
    name: 'Surando & Bijal',
    nameSindhi: 'سرندو',
    category: 'Music',
    description:
      'The Surando is a bowed string instrument central to Sindhi folk music. Here depicted in the legendary scene of Bijal playing before Rai Diyach — one of Sindh\'s most beloved folk epics.',
    origin: 'Rural Sindh',
    imageUrl: WM('Bijal playing Surando.jpg'),
    galleryImages: [
      WM('Bijal playing Surando in front of Dhaj the Great (Rai Diyach) scene of the folktale of Sorath Rai Diyach.jpg'),
    ],
    accentColor: '#1A5276',
    tags: ['surando', 'folk music', 'Bijal', 'instrument'],
  },
  {
    id: 'ektara-1',
    name: 'Ektara (Yaktaro)',
    nameSindhi: 'يڪتارو',
    category: 'Music',
    description:
      'A single-stringed instrument played by wandering Sufi mystics across Sindh. Its raw, resonant buzz accompanies devotional poetry at dargahs, connecting the physical and the spiritual.',
    origin: 'Sufi shrines of Sindh',
    imageUrl: WM('Ektara.JPG'),
    galleryImages: [],
    accentColor: '#5D4037',
    tags: ['ektara', 'yaktaro', 'sufi', 'folk instrument'],
  },
  {
    id: 'cultural-celebration-1',
    name: 'Cultural Celebration',
    nameSindhi: 'ثقافتي تقريب',
    category: 'Music',
    description:
      'Sindhi Cultural Day is celebrated every December with music, dance, and Ajrak. Students and communities across Sindh and the diaspora gather in traditional dress to honour their heritage.',
    origin: 'Sindh-wide',
    imageUrl: WM('Cultural Celebration in School.jpg'),
    galleryImages: [],
    accentColor: '#C0392B',
    tags: ['cultural day', 'celebration', 'school', 'community'],
  },
];

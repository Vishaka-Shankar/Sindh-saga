// data/culturalItems.ts
// Images are sourced from user-provided local assets.

export type Category = 'All' | 'Clothing' | 'Food' | 'History' | 'Music' | 'Art';

export interface CulturalItem {
  id: string;
  name: string;
  nameSindhi: string;
  category: Exclude<Category, 'All'>;
  description: string;
  origin: string;
  imageUrl: string;
  imageSource?: any; // local require() for bundled images
  galleryImages?: any[];
  accentColor: string;
  tags: string[];
}

// Local image map — React Native requires static require() calls
export const LOCAL_IMAGES: Record<string, any> = {
  'ajrak':                   require('../assets/images/ajrak.jpg'),
  'sindhi-topi':             require('../assets/images/sindhi-topi.jpg'),
  'mohenjo-daro':            require('../assets/images/mohenjo-daro.jpg'),
  'sindhi-dress':            require('../assets/images/sindhi-dress.jpg'),
  'thar-food':               require('../assets/images/thar-food.jpg'),
  'folk-singing':            require('../assets/images/folk-singing.jpg'),
  'cultural-celebration':    require('../assets/images/cultural-celebration.jpg'),
  'sindhi-embroidery':       require('../assets/images/sindhi-embroidery.jpg'),
  'rili-quilt':              require('../assets/images/rili-quilt.jpg'),
  'kashi-tile':              require('../assets/images/kashi-tile.jpg'),
  'ektara':                  require('../assets/images/ektara.jpg'),
  'surando-bijal':           require('../assets/images/surando-bijal.jpg'),
};

const LOCAL_IMAGE_KEYS = Object.keys(LOCAL_IMAGES).sort((a, b) => b.length - a.length);

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getLocalImageSourceForItem(item: { id?: string; name?: string; imageUrl?: string }) {
  const candidates = [item.id, item.name, item.imageUrl].filter(Boolean).map((value) => normalizeText(String(value)));

  for (const candidate of candidates) {
    for (const key of LOCAL_IMAGE_KEYS) {
      if (candidate.includes(key)) {
        return LOCAL_IMAGES[key];
      }
    }
  }

  return undefined;
}

export const FALLBACK_CULTURAL_ITEMS: CulturalItem[] = [
  // ── Crafts ───────────────────────────────────────────────────────────────
  {
    id: 'ajrak-1',
    name: 'Ajrak',
    nameSindhi: 'اجرڪ',
    category: 'Art',
    description:
      'The soul of Sindhi identity — a block-printed shawl made with natural indigo and madder dyes. Its intricate geometric patterns take weeks to complete and have been crafted in Sindh for over 4,000 years.',
    origin: 'Bhit Shah, Hala & Khairpur',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['ajrak'],
    galleryImages: [LOCAL_IMAGES['sindhi-embroidery'], LOCAL_IMAGES['sindhi-topi']],
    accentColor: '#1B3F8B',
    tags: ['ajrak', 'textile', 'block print', 'indigo'],
  },
  {
    id: 'mohenjo-daro-1',
    name: 'Mohenjo-daro',
    nameSindhi: 'موهن جو دڙو',
    category: 'History',
    description:
      "One of the world's earliest major cities, built c. 2500 BCE in Larkana District, Sindh. A UNESCO World Heritage Site, its ruins reveal remarkable urban planning, drainage systems, and a thriving Indus Valley civilisation.",
    origin: 'Larkana District',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['mohenjo-daro'],
    galleryImages: [LOCAL_IMAGES['kashi-tile'], LOCAL_IMAGES['cultural-celebration']],
    accentColor: '#7D5A2F',
    tags: ['mohenjo-daro', 'indus valley', 'archaeology', 'UNESCO'],
  },
  {
    id: 'rilli-1',
    name: 'Rilli Quilt',
    nameSindhi: 'رلي',
    category: 'Art',
    description:
      'Colourful patchwork quilts stitched by Sindhi women as heirlooms and gifts. Each rilli tells a story through bold geometric shapes, bright contrasting fabrics, and the patience of generations.',
    origin: 'Rural Sindh',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['rili-quilt'],
    galleryImages: [LOCAL_IMAGES['sindhi-embroidery'], LOCAL_IMAGES['kashi-tile']],
    accentColor: '#B03A2E',
    tags: ['rilli', 'quilt', 'patchwork', 'handicraft'],
  },
  {
    id: 'kashi-1',
    name: 'Kashi Tile Work',
    nameSindhi: 'ڪاشي',
    category: 'Art',
    description:
      'Vibrant blue-and-white glazed tilework adorning the shrines and mosques of Sindh. This 500-year-old tradition from the Samma dynasty era reaches its finest expression in Hala and the Shah Jahan Mosque at Thatta.',
    origin: 'Hala & Thatta',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['kashi-tile'],
    accentColor: '#1F618D',
    tags: ['kashi', 'tile', 'pottery', 'Thatta'],
  },
  {
    id: 'embroidery-1',
    name: 'Sindhi Embroidery',
    nameSindhi: 'سنڌي ڀرت',
    category: 'Art',
    description:
      "Dazzling mirror-work and thread embroidery adorning women's garments, caps, and home textiles. Each stitch carries regional identity — patterns from Tharparkar differ strikingly from those of Hyderabad.",
    origin: 'Tharparkar, Umerkot & Hyderabad',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['sindhi-embroidery'],
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
    imageUrl: '',
    imageSource: LOCAL_IMAGES['sindhi-topi'],
    accentColor: '#922B21',
    tags: ['topi', 'cap', 'embroidery', 'mirror work'],
  },
  {
    id: 'traditional-dress-1',
    name: 'Traditional Sindhi Dress',
    nameSindhi: 'سنڌي لباس',
    category: 'Clothing',
    description:
      'Sindhi men and women wear richly embroidered attire adorned with mirrors, shells, and beads. The colours are bold and celebratory — reds, oranges, and greens set against deep contrasting tones.',
    origin: 'Sindh-wide',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['sindhi-dress'],
    accentColor: '#C0392B',
    tags: ['dress', 'kamiz', 'traditional', 'cultural'],
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
    imageUrl: '',
    imageSource: LOCAL_IMAGES['thar-food'],
    accentColor: '#D4AC0D',
    tags: ['thar', 'food', 'desert', 'lentils'],
  },

  // ── Music ─────────────────────────────────────────────────────────────────
  {
    id: 'folk-singing-1',
    name: 'Folk Singing of Thar',
    nameSindhi: 'ٿر جي لوڪ موسيقي',
    category: 'Music',
    description:
      'The haunting folk music of the Thar Desert — sung by women and men in devotion and celebration. These songs carry the stories of Shah Abdul Latif Bhittai and ancient Sindhi love legends.',
    origin: 'Tharparkar',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['folk-singing'],
    galleryImages: [LOCAL_IMAGES['ektara'], LOCAL_IMAGES['surando-bijal']],
    accentColor: '#784212',
    tags: ['folk', 'singing', 'Thar', 'music'],
  },
  {
    id: 'surando-1',
    name: 'Surando & Bijal',
    nameSindhi: 'سرندو',
    category: 'Music',
    description:
      "The Surando is a bowed string instrument central to Sindhi folk music. Here depicted in the legendary scene of Bijal playing before Rai Diyach — one of Sindh's most beloved folk epics.",
    origin: 'Rural Sindh',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['surando-bijal'],
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
    imageUrl: '',
    imageSource: LOCAL_IMAGES['ektara'],
    accentColor: '#5D4037',
    tags: ['ektara', 'yaktaro', 'sufi', 'folk instrument'],
  },
  {
    id: 'cultural-celebration-1',
    name: 'Cultural Celebration',
    nameSindhi: 'ثقافتي تقريب',
    category: 'History',
    description:
      'Sindhi Cultural Day is celebrated every December with music, dance, and Ajrak. Students and communities across Sindh and the diaspora gather in traditional dress to honour their heritage.',
    origin: 'Sindh-wide',
    imageUrl: '',
    imageSource: LOCAL_IMAGES['cultural-celebration'],
    galleryImages: [LOCAL_IMAGES['ajrak'], LOCAL_IMAGES['sindhi-dress']],
    accentColor: '#C0392B',
    tags: ['cultural day', 'celebration', 'community', 'heritage'],
  },
];

export function getCulturalItemById(id: string) {
  return FALLBACK_CULTURAL_ITEMS.find((item) => item.id === id);
}

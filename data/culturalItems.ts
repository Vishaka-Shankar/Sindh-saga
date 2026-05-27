// data/culturalItems.ts
// Fallback data used when Firebase / network is unavailable.
// All image URLs point to reliable Wikimedia commons images so they work
// even in a local dev environment without Firebase Storage configured.

export type Category = 'All' | 'Clothing' | 'Crafts' | 'Food' | 'Music';

export interface CulturalItem {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  description: string;
  origin: string;
  imageUrl: string;
  tags: string[];
}

export const FALLBACK_CULTURAL_ITEMS: CulturalItem[] = [
  // ── Crafts ──────────────────────────────────────────────────────────────
  {
    id: 'ajrak-1',
    name: 'Ajrak',
    category: 'Crafts',
    description:
      'A block-printed shawl that is the soul of Sindhi identity. Made with natural indigo and madder dyes, the intricate geometric patterns take weeks to complete.',
    origin: 'Bhit Shah & Khairpur',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Ajrak_design.jpg/640px-Ajrak_design.jpg',
    tags: ['ajrak', 'textile', 'block print', 'indigo'],
  },
  {
    id: 'rilli-1',
    name: 'Rilli Quilt',
    category: 'Crafts',
    description:
      'Colourful patchwork quilts stitched by Sindhi women as heirlooms. Each rilli tells a story through bold geometric shapes and bright contrasting fabrics.',
    origin: 'Rural Sindh',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rilli_quilt_Sindh.jpg/640px-Rilli_quilt_Sindh.jpg',
    tags: ['rilli', 'quilt', 'patchwork', 'handicraft'],
  },
  {
    id: 'kashi-1',
    name: 'Kashi Tile Work',
    category: 'Crafts',
    description:
      'Vibrant blue-and-white glazed tilework that adorns the shrines and mosques of Sindh. The tradition dates back over five centuries to the Samma dynasty.',
    origin: 'Hala & Thatta',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Shah_Jahan_Mosque_Thatta_blue_tiles.jpg/640px-Shah_Jahan_Mosque_Thatta_blue_tiles.jpg',
    tags: ['kashi', 'tile', 'pottery', 'blue'],
  },
  {
    id: 'lacquer-1',
    name: 'Lacquerware',
    category: 'Crafts',
    description:
      'Turned wooden objects — from furniture legs to toys — coated in brilliantly coloured lacquer. The craft is centred in Hala and passed down in families.',
    origin: 'Hala',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Hala_lacquerware_Sindh.jpg/640px-Hala_lacquerware_Sindh.jpg',
    tags: ['lacquer', 'wood', 'hala', 'craft'],
  },

  // ── Clothing ─────────────────────────────────────────────────────────────
  {
    id: 'sindhi-topi-1',
    name: 'Sindhi Topi',
    category: 'Clothing',
    description:
      'The embroidered cap worn by Sindhi men as a mark of cultural pride. Its mirror-work and colourful thread patterns vary by region and craft family.',
    origin: 'Sindh-wide',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Sindhi_cap.jpg/640px-Sindhi_cap.jpg',
    tags: ['topi', 'cap', 'embroidery', 'mirror work'],
  },
  {
    id: 'leheriya-1',
    name: 'Leheriya Dupatta',
    category: 'Clothing',
    description:
      'A tie-dye fabric in wave patterns (leher = wave). Traditionally worn by Sindhi women for festivals, its ripple-like lines are created by resist dyeing.',
    origin: 'Hyderabad',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Leheriya_fabric_Sindh.jpg/640px-Leheriya_fabric_Sindh.jpg',
    tags: ['leheriya', 'dupatta', 'tie dye', 'fabric'],
  },
  {
    id: 'khaddar-1',
    name: 'Sindhi Khaddar',
    category: 'Clothing',
    description:
      'Hand-loomed cotton fabric with a slightly rough weave. Worn as everyday shalwar kameez, khaddar is prized for its breathability in the Sindh heat.',
    origin: 'Khairpur & Sukkur',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Khaddar_fabric_Sindh.jpg/640px-Khaddar_fabric_Sindh.jpg',
    tags: ['khaddar', 'cotton', 'loom', 'handwoven'],
  },

  // ── Food ─────────────────────────────────────────────────────────────────
  {
    id: 'thari-mithai-1',
    name: 'Thari Mithai',
    category: 'Food',
    description:
      'A dense, crumbly sweet from the Thar Desert region made with ghee, flour, and sugar. Packed with calories for desert travellers, it melts on the tongue.',
    origin: 'Tharparkar',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Thari_mithai_Sindh.jpg/640px-Thari_mithai_Sindh.jpg',
    tags: ['thari mithai', 'sweet', 'thar', 'dessert'],
  },
  {
    id: 'sai-bhaji-1',
    name: 'Sai Bhaji',
    category: 'Food',
    description:
      'A hearty Sindhi stew of spinach, lentils, and seasonal vegetables. Often served with bhuga chawal (caramelised rice), it is considered the quintessential Sindhi comfort food.',
    origin: 'Sindh-wide',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sai_bhaji_Sindhi_food.jpg/640px-Sai_bhaji_Sindhi_food.jpg',
    tags: ['sai bhaji', 'curry', 'spinach', 'dal'],
  },
  {
    id: 'seyal-maani-1',
    name: 'Seyal Maani',
    category: 'Food',
    description:
      'Leftover flatbread cooked in a rich tomato-onion masala until it absorbs all the gravy. A beloved Sindhi breakfast dish that turns simple ingredients into something extraordinary.',
    origin: 'Sindh-wide',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Seyal_maani_Sindhi.jpg/640px-Seyal_maani_Sindhi.jpg',
    tags: ['seyal maani', 'bread', 'breakfast', 'masala'],
  },

  // ── Music ─────────────────────────────────────────────────────────────────
  {
    id: 'santoor-1',
    name: 'Santoor',
    category: 'Music',
    description:
      'A hammered dulcimer with 100+ strings stretched over a walnut box. In Sindh it features in classical and devotional music, its resonant tone evoking the Indus river.',
    origin: 'Sindh & Kashmir',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Santoor_instrument.jpg/640px-Santoor_instrument.jpg',
    tags: ['santoor', 'instrument', 'classical', 'strings'],
  },
  {
    id: 'yaktaro-1',
    name: 'Yaktaro',
    category: 'Music',
    description:
      'A single-stringed folk instrument played by wandering Sufi mystics (fakirs). Its raw, buzzing tone accompanies devotional poetry at dargahs across Sindh.',
    origin: 'Rural Sindh',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ektara_folk_instrument.jpg/640px-Ektara_folk_instrument.jpg',
    tags: ['yaktaro', 'sufi', 'folk', 'instrument'],
  },
  {
    id: 'dhammal-1',
    name: 'Dhammal',
    category: 'Music',
    description:
      'Ecstatic Sufi devotional music performed at shrines. Driven by dhol drums and group singing, dhammal induces a meditative trance and is central to Sindhi spiritual life.',
    origin: 'Sehwan Sharif & across Sindh',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Dhammal_Sehwan.jpg/640px-Dhammal_Sehwan.jpg',
    tags: ['dhammal', 'sufi', 'dhol', 'shrine'],
  },
];

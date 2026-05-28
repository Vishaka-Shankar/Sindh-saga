// services/culturalItemsService.ts
// Fetches cultural items from Firestore.
// Falls back to local data when the network is unavailable or Firebase is
// not yet configured — this prevents the "Network Error" blank screen.

import { orderBy, where } from 'firebase/firestore';
import {
    Category,
    CulturalItem,
    FALLBACK_CULTURAL_ITEMS,
    getCulturalItemById,
} from '../data/culturalItems';
import {
    fetchCollectionDocuments,
    fetchDocumentById
} from './firebaseService';

// ─── helpers ───────────────────────────────────────────────────────────────

function isNetworkError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('network') ||
      msg.includes('fetch') ||
      msg.includes('unavailable') ||
      msg.includes('failed to fetch') ||
      msg.includes('offline')
    );
  }
  return false;
}

// ─── public API ────────────────────────────────────────────────────────────

/**
 * Fetch all cultural items for a given category.
 * Returns local fallback data on network / Firebase errors so the UI
 * always has something to display.
 */
export async function fetchCulturalItems(
  category: Category = 'All'
): Promise<{ items: CulturalItem[]; fromCache: boolean; error?: string }> {
  try {
    const constraints =
      category === 'All'
        ? [orderBy('title')]
        : [where('category', '==', category), orderBy('title')];

    const documents = await fetchCollectionDocuments<Record<string, unknown>>(
      'culturalItems',
      constraints
    );

    if (documents.length === 0) {
      const filtered = filterLocal(category);
      return {
        items: filtered,
        fromCache: true,
        error: 'No live cultural cards were found. Showing local preview instead.',
      };
    }

    const items = documents.map(mapFirestoreToCulturalItem);
    return { items, fromCache: false };
  } catch (err) {
    console.warn('[culturalItemsService] Fetch failed, using local data:', err);

    const filtered = filterLocal(category);
    return {
      items: filtered,
      fromCache: true,
      error: 'Unable to load live cultural cards. Showing local preview.',
    };
  }
}

export async function fetchCulturalItemById(
  id: string
): Promise<{ item: CulturalItem | null; fromCache: boolean; error?: string }> {
  try {
    const document = await fetchDocumentById<Record<string, unknown>>('culturalItems', id);

    if (!document) {
      const fallback = getCulturalItemById(id);
      return {
        item: fallback ?? null,
        fromCache: true,
        error: fallback
          ? 'Item was unavailable from Firestore. Showing local preview.'
          : 'This cultural item could not be found.',
      };
    }

    return {
      item: mapFirestoreToCulturalItem(document),
      fromCache: false,
    };
  } catch (err) {
    console.warn('[culturalItemsService] Item fetch failed:', err);

    const fallback = getCulturalItemById(id);
    return {
      item: fallback ?? null,
      fromCache: true,
      error: fallback
        ? 'Unable to load live item. Showing local preview.'
        : 'Unable to load this cultural item.',
    };
  }
}

function mapFirestoreToCulturalItem(
  document: Record<string, unknown> & { id: string }
): CulturalItem {
  const title = document.title ?? document.name ?? 'Sindhi Cultural Item';
  const category = normalizeCategory(document.category);

  return {
    id: document.id,
    name: String(title),
    nameSindhi: String(document.nameSindhi ?? title),
    category,
    description: String(document.description ?? ''),
    origin: String(document.origin ?? 'Sindh'),
    imageUrl: String(document.imageUrl ?? ''),
    imageSource: undefined,
    galleryImages: [],
    accentColor: String(document.accentColor ?? '#C0392B'),
    tags: Array.isArray(document.tags)
      ? document.tags.map((tag) => String(tag))
      : [],
  };
}

const VALID_ITEM_CATEGORIES: Array<Exclude<Category, 'All'>> = [
  'Clothing',
  'Food',
  'History',
  'Music',
  'Art',
];

function normalizeCategory(value: unknown): Exclude<Category, 'All'> {
  if (typeof value === 'string' && VALID_ITEM_CATEGORIES.includes(value as any)) {
    return value as Exclude<Category, 'All'>;
  }
  return 'Art';
}

function filterLocal(category: Category): CulturalItem[] {
  if (category === 'All') return FALLBACK_CULTURAL_ITEMS;
  return FALLBACK_CULTURAL_ITEMS.filter((item) => item.category === category);
}

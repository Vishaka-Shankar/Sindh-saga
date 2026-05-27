// services/culturalItemsService.ts
// Fetches cultural items from Firestore.
// Falls back to local data when the network is unavailable or Firebase is
// not yet configured — this prevents the "Network Error" blank screen.

import { collection, getDocs, query, where, orderBy, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from '../firebase/app';
import {
  CulturalItem,
  Category,
  FALLBACK_CULTURAL_ITEMS,
} from '../data/culturalItems';

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
): Promise<{ items: CulturalItem[]; fromCache: boolean }> {
  try {
    // Lazy-init Firebase — returns null if .env vars are missing
    const app = getFirebaseApp();
    if (!app) {
      console.warn('[culturalItemsService] Firebase not configured, using local data.');
      return { items: filterLocal(category), fromCache: true };
    }

    const db = getFirestore(app);
    const ref = collection(db, 'culturalItems');

    const q =
      category === 'All'
        ? query(ref, orderBy('name'))
        : query(ref, where('category', '==', category), orderBy('name'));

    const snapshot = await getDocs(q);

    // If Firestore returned an empty collection, still fall back to local data
    // so the gallery is never blank on first run / before seeding.
    if (snapshot.empty) {
      const filtered = filterLocal(category);
      return { items: filtered, fromCache: true };
    }

    const items: CulturalItem[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<CulturalItem, 'id'>),
    }));

    return { items, fromCache: false };
  } catch (err) {
    console.warn('[culturalItemsService] Fetch failed, using local data:', err);

    // Always surface local fallback — never let the gallery be empty.
    const filtered = filterLocal(category);
    return { items: filtered, fromCache: true };
  }
}

function filterLocal(category: Category): CulturalItem[] {
  if (category === 'All') return FALLBACK_CULTURAL_ITEMS;
  return FALLBACK_CULTURAL_ITEMS.filter((item) => item.category === category);
}

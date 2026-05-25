import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Network error while calling Sindh Saga API';
    return Promise.reject(new Error(message));
  }
);

export type CulturalItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  origin: string;
};

function normalizeItemsResponse<T>(payload: T | { items: T }) {
  return (payload as { items: T }).items ?? payload;
}

export async function fetchItems(category?: string) {
  try {
    const response = await api.get<{ items: CulturalItem[] }>('/api/items', {
      params: category ? { category } : undefined,
    });
    return normalizeItemsResponse(response.data) as CulturalItem[];
  } catch (error) {
    console.error('[API] fetchItems error', error);
    throw error instanceof Error ? error : new Error('Unable to load cultural items.');
  }
}

export async function searchItems(query: string) {
  try {
    const response = await api.get<{ items: CulturalItem[] }>('/api/items/search', {
      params: { q: query },
    });
    return (normalizeItemsResponse(response.data) as CulturalItem[]).slice(0, 6);
  } catch (error) {
    console.error('[API] searchItems error', error);
    throw error instanceof Error ? error : new Error('Search request failed.');
  }
}

export async function fetchItemDetails(id: string) {
  try {
    const response = await api.get<CulturalItem>(`/api/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('[API] fetchItemDetails error', error);
    throw error instanceof Error ? error : new Error('Unable to load item details.');
  }
}

import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { getFirebaseAuth } from '@/firebase/auth';
import { getFirestoreDb } from '@/firebase/firestore';
import { getFirebaseStorage } from '@/firebase/storage';

export interface ArtworkResult {
  artworkUrl: string;
  prompt: string;
}

export type ArtworkStatus = 'idle' | 'generating' | 'done' | 'error';

export type ArtworkProgressCallback = (status: ArtworkStatus, message?: string) => void;

const STABLE_DIFFUSION_API_URL = process.env.EXPO_PUBLIC_STABLE_DIFFUSION_API_URL;
const STABLE_DIFFUSION_API_KEY = process.env.EXPO_PUBLIC_STABLE_DIFFUSION_API_KEY;
const STABLE_DIFFUSION_MODEL = process.env.EXPO_PUBLIC_STABLE_DIFFUSION_MODEL ?? 'stable-diffusion-v1-5';

function buildArtworkPrompt(title: string, storyText: string): string {
  const storySummary = storyText
    .split('.')
    .slice(0, 3)
    .filter(Boolean)
    .join('. ')
    .trim();

  return `Create a vibrant children-friendly illustration inspired by Sindhi culture for the story titled "${title}".
Use Ajrak block print patterns, Ralli quilt patchwork textures, traditional Sindhi clothing, and handmade Sindhi crafts.
Keep the scene warm, authentic, and respectful, with bold indigo, red, gold, and earthen tones.
Include decorative embroidery borders, local village scenery, and folk-art styling suitable for a picture book.
Do not include text or logos.
Story summary: ${storySummary}`;
}

function decodeBase64(base64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
  }

  throw new Error('Unable to decode base64 image data in this environment.');
}

async function requestStableDiffusion(
  prompt: string,
  onProgress?: ArtworkProgressCallback,
): Promise<string> {
  if (!STABLE_DIFFUSION_API_URL) {
    throw new Error(
      'Stable Diffusion API URL is missing. Add EXPO_PUBLIC_STABLE_DIFFUSION_API_URL to your environment.',
    );
  }

  if (!STABLE_DIFFUSION_API_KEY) {
    throw new Error(
      'Stable Diffusion API key is missing. Add EXPO_PUBLIC_STABLE_DIFFUSION_API_KEY to your environment.',
    );
  }

  onProgress?.('generating', 'Generating artwork with Stable Diffusion...');

  const endpoint = STABLE_DIFFUSION_API_URL.replace(/\/$/, '') +
    `/v1/generation/${STABLE_DIFFUSION_MODEL}/text-to-image`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STABLE_DIFFUSION_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 768,
      width: 768,
      samples: 1,
      steps: 30,
    }),
  });

  if (!response.ok) {
    let details = '';
    try {
      const body = await response.json();
      details = body?.error?.message ?? JSON.stringify(body);
    } catch {
      details = response.statusText;
    }
    throw new Error(`Stable Diffusion API error: ${details}`);
  }

  const data = await response.json();
  const artifact = data.artifacts?.[0] ?? data.output?.[0]?.data?.[0];
  const base64Data = artifact?.base64 || artifact?.b64_json || artifact?.base64_image;

  if (!base64Data || typeof base64Data !== 'string') {
    throw new Error('Stable Diffusion response did not return image data.');
  }

  return base64Data;
}

async function uploadArtworkBlob(
  userId: string,
  storyId: string,
  base64Image: string,
  onProgress?: ArtworkProgressCallback,
): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage is not initialised.');

  const bytes = decodeBase64(base64Image);
  const path = `artwork/${userId}/${storyId}.png`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, bytes, { contentType: 'image/png' });
  return await getDownloadURL(storageRef);
}

async function getCurrentUserId(): Promise<string> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth is not initialised.');

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (!user) {
        reject(new Error('You must be signed in to generate artwork.'));
      } else {
        resolve(user.uid);
      }
    });
  });
}

async function updateRecordingArtwork(
  firestoreDocId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not initialised.');

  const docRef = doc(db, 'stories', firestoreDocId);
  await updateDoc(docRef, data);
}

export async function generateArtworkForStory(
  firestoreDocId: string,
  storyId: string,
  title: string,
  storyText: string,
  onProgress?: ArtworkProgressCallback,
): Promise<ArtworkResult> {
  onProgress?.('generating', 'Generating artwork prompt...');
  const userId = await getCurrentUserId();
  const prompt = buildArtworkPrompt(title, storyText);
  
  const imageBase64 = await requestStableDiffusion(prompt, onProgress);
  const artworkUrl = await uploadArtworkBlob(userId, storyId, imageBase64, onProgress);

  await updateRecordingArtwork(firestoreDocId, {
    artworkUrl,
    artworkPrompt: prompt,
    artworkGeneratedAt: new Date().toISOString(),
  });

  onProgress?.('done', 'Artwork generation complete');
  return { artworkUrl, prompt };
}

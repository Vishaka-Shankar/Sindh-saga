import { getFirestoreDb } from '@/firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';

export type ModerationStatus = 'safe' | 'flagged' | 'pending_review';

export interface ModerationResult {
  status: ModerationStatus;
  scrubbedText: string;
  piiEntities: string[];
  unsafeCategories: string[];
  notes: string[];
}

const PRESIDIO_BASE_URL = process.env.EXPO_PUBLIC_PRESIDIO_API_URL;
const PRESIDIO_API_KEY = process.env.EXPO_PUBLIC_PRESIDIO_API_KEY;
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

async function scrubWithPresidio(text: string): Promise<{ scrubbedText: string; piiEntities: string[] }> {
  if (!PRESIDIO_BASE_URL) {
    return {
      scrubbedText: text,
      piiEntities: [],
    };
  }

  const endpoint = PRESIDIO_BASE_URL.replace(/\/$/, '') + '/api/anonymize';
  const payload = {
    text,
    analyzerEngine: 'presidio',
    anonymizers: {
      DEFAULT_REDACTION: {
        type: 'replace',
        new_value: '[REDACTED]',
      },
    },
    language: 'en',
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (PRESIDIO_API_KEY) {
    headers.Authorization = `Bearer ${PRESIDIO_API_KEY}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Presidio API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json().catch(() => ({}));
  const scrubbedText = typeof data?.text === 'string' ? data.text : text;
  const piiEntities = Array.isArray(data?.entities)
    ? data.entities.map((item: any) => String(item.entity_type ?? item.type ?? 'PII'))
    : [];

  return { scrubbedText, piiEntities };
}

async function scanForUnsafeContent(text: string) {
  if (!OPENAI_API_KEY) {
    return {
      flagged: false,
      categories: [] as string[],
    };
  }

  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'omni-moderation-latest',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Moderation API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const result = Array.isArray(data?.results) ? data.results[0] : null;
  const categories = result?.categories
    ? Object.entries(result.categories)
        .filter(([, value]) => value)
        .map(([key]) => key)
    : [];
  return {
    flagged: Boolean(result?.flagged),
    categories,
  };
}

function determineStatus(piiEntities: string[], flagged: boolean): ModerationStatus {
  if (flagged) return 'flagged';
  if (piiEntities.length > 0) return 'pending_review';
  return 'safe';
}

function buildNotes(piiEntities: string[], categories: string[], status: ModerationStatus) {
  const notes: string[] = [];
  if (piiEntities.length > 0) {
    notes.push(`PII removed: ${piiEntities.join(', ')}`);
  }
  if (categories.length > 0) {
    notes.push(`Unsafe content categories: ${categories.join(', ')}`);
  }
  if (status === 'safe' && notes.length === 0) {
    notes.push('No unsafe or sensitive content detected.');
  }
  return notes;
}

export async function moderateText(text: string): Promise<ModerationResult> {
  const { scrubbedText, piiEntities } = await scrubWithPresidio(text);
  const unsafeScan = await scanForUnsafeContent(scrubbedText);

  const status = determineStatus(piiEntities, unsafeScan.flagged);
  const notes = buildNotes(piiEntities, unsafeScan.categories, status);

  return {
    status,
    scrubbedText,
    piiEntities,
    unsafeCategories: unsafeScan.categories,
    notes,
  };
}

async function updateRecordingDocument(firestoreDocId: string, data: Record<string, unknown>) {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not initialised.');
  const docRef = doc(db, 'stories', firestoreDocId);
  await updateDoc(docRef, data);
}

export async function saveTranscriptModeration(
  firestoreDocId: string,
  transcript: string,
  language: string,
  durationSeconds: number | null,
): Promise<ModerationResult> {
  const moderation = await moderateText(transcript);
  await updateRecordingDocument(firestoreDocId, {
    transcript: moderation.scrubbedText,
    transcriptLanguage: language,
    transcriptDurationSeconds: durationSeconds,
    moderationStatus: moderation.status,
    moderationNotes: moderation.notes,
    piiEntities: moderation.piiEntities,
    unsafeCategories: moderation.unsafeCategories,
    moderationCheckedAt: new Date().toISOString(),
    status: 'transcribed',
    transcribedAt: new Date().toISOString(),
  });
  return moderation;
}

export async function saveStoryModeration(
  firestoreDocId: string,
  title: string,
  storyText: string,
  moral: string,
): Promise<ModerationResult> {
  const titleModeration = await moderateText(title);
  const storyModeration = await moderateText(storyText);

  const status = [titleModeration.status, storyModeration.status].includes('flagged')
    ? 'flagged'
    : [titleModeration.status, storyModeration.status].includes('pending_review')
    ? 'pending_review'
    : 'safe';

  const notes = [
    ...titleModeration.notes,
    ...storyModeration.notes,
  ];

  const scrubbedTitle = titleModeration.scrubbedText;
  const scrubbedStoryText = storyModeration.scrubbedText;

  await updateRecordingDocument(firestoreDocId, {
    title: scrubbedTitle,
    storyTitle: scrubbedTitle,
    storyText: scrubbedStoryText,
    storyMoral: moral,
    moderationStatus: status,
    moderationNotes: notes,
    piiEntities: Array.from(new Set([...titleModeration.piiEntities, ...storyModeration.piiEntities])),
    unsafeCategories: Array.from(new Set([...titleModeration.unsafeCategories, ...storyModeration.unsafeCategories])),
    moderationCheckedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    status: status === 'safe' ? 'done' : 'pending_review',
  });

  return {
    status,
    scrubbedText: scrubbedStoryText,
    piiEntities: Array.from(new Set([...titleModeration.piiEntities, ...storyModeration.piiEntities])),
    unsafeCategories: Array.from(new Set([...titleModeration.unsafeCategories, ...storyModeration.unsafeCategories])),
    notes,
  };
}

import { doc, updateDoc } from 'firebase/firestore';

import { getFirestoreDb } from '@/firebase/firestore';
import { saveStoryModeration } from '@/services/moderationService';

export type NarrativeResult = {
  title: string;
  storyText: string;
  moral: string;
};

export type NarrativeStatus = 'idle' | 'generating' | 'saving' | 'done' | 'error';

export type NarrativeProgressCallback = (status: NarrativeStatus, message?: string) => void;

const GPT_MODEL = 'gpt-4o';

function buildNarrativePrompt(transcript: string): string {
  return `You are a narrative agent that converts raw spoken story transcripts into a polished English story for children.
- Translate the transcript into clean, simple English if needed.
- Use a child-friendly storytelling style with proper grammar and structure.
- Preserve the original story's meaning, cultural context, and any lesson.
- Keep the story warm, clear, and easy for young readers.

Return ONLY valid JSON with exactly these keys: title, storyText, moral.
Do not add markdown, explanations, or extra fields.

Transcript:
${transcript.trim()}`;
}

async function parseResponseText(responseText: string): Promise<NarrativeResult> {
  const trimmed = responseText.trim();

  try {
    return JSON.parse(trimmed) as NarrativeResult;
  } catch (error) {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('GPT response could not be parsed as JSON.');
    }

    try {
      return JSON.parse(jsonMatch[0]) as NarrativeResult;
    } catch {
      throw new Error('GPT response JSON was malformed.');
    }
  }
}

export async function generateNarrativeFromTranscript(
  transcript: string,
  onProgress?: NarrativeProgressCallback,
): Promise<NarrativeResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    const errorMessage = 'OpenAI API key is missing. Please add EXPO_PUBLIC_OPENAI_API_KEY to your .env file to enable story generation.';
    onProgress?.('error', errorMessage);
    throw new Error(errorMessage);
  }

  onProgress?.('generating', 'Generating story with GPT-4o...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GPT_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a child-friendly narrative agent that turns spoken story transcripts into a polished English story with a clear title and moral.',
        },
        {
          role: 'user',
          content: buildNarrativePrompt(transcript),
        },
      ],
      temperature: 0.7,
      max_tokens: 900,
      top_p: 1,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.error?.message ?? response.statusText;
    onProgress?.('error', `GPT API error: ${message}`);
    throw new Error(`GPT API error: ${message}`);
  }

  const body = await response.json();
  const content = body.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    onProgress?.('error', 'GPT API returned an empty response.');
    throw new Error('GPT API returned an empty response.');
  }

  const narrative = await parseResponseText(content);
  onProgress?.('done', 'Story generated successfully');
  return {
    title: narrative.title?.trim() ?? 'Untitled Story',
    storyText: narrative.storyText?.trim() ?? '',
    moral: narrative.moral?.trim() ?? '',
  };
}

async function updateRecordingDocument(
  firestoreDocId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is not initialised.');

  const docRef = doc(db, 'stories', firestoreDocId);
  await updateDoc(docRef, data);
}

export async function markRecordingProcessing(firestoreDocId: string): Promise<void> {
  await updateRecordingDocument(firestoreDocId, {
    status: 'processing',
    generatedAt: null,
    storyTitle: null,
    storyText: null,
    storyMoral: null,
  });
}

export async function saveNarrativeToFirestore(
  firestoreDocId: string,
  narrative: NarrativeResult,
  onProgress?: NarrativeProgressCallback,
) {
  onProgress?.('saving', 'Saving story to Firestore...');
  const moderation = await saveStoryModeration(
    firestoreDocId,
    narrative.title,
    narrative.storyText,
    narrative.moral,
  );
  onProgress?.('done', 'Story saved successfully');
  return moderation;
}

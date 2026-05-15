import type { Timestamp } from 'firebase/firestore';

/** Pipeline status for a recorded story */
export type StoryStatus = 'uploading' | 'processing' | 'done' | 'error';

export type Story = {
  id: string;
  userId: string;
  title: string;
  audioUrl: string;
  transcript: string;
  storyText: string;
  status: StoryStatus;
  errorMessage?: string;
  createdAt: Timestamp;
};

/** Fields written when creating a new story (before upload completes) */
export type CreateStoryInput = {
  userId: string;
  title?: string;
};

/** Fields the Cloud Function updates after Whisper + GPT */
export type ProcessStoryResult = {
  transcript: string;
  storyText: string;
  title?: string;
};

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
  uploading: 'Uploading…',
  processing: 'Creating your story…',
  done: 'Ready',
  error: 'Something went wrong',
};

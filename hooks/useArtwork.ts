import { useCallback, useState } from 'react';

import {
    ArtworkProgressCallback,
    ArtworkStatus,
    generateArtworkForStory
} from '@/services/artService';

export interface UseArtworkReturn {
  status: ArtworkStatus;
  artworkUrl: string | null;
  artworkPrompt: string | null;
  error: string | null;
  progressMessage: string | null;
  generate: (firestoreDocId: string, storyId: string, title: string, storyText: string) => Promise<string | undefined>;
  reset: () => void;
}

export function useArtwork(): UseArtworkReturn {
  const [status, setStatus] = useState<ArtworkStatus>('idle');
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkPrompt, setArtworkPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const generate = useCallback(
    async (firestoreDocId: string, storyId: string, title: string, storyText: string) => {
      setError(null);
      setArtworkUrl(null);
      setArtworkPrompt(null);
      setProgressMessage(null);

      // Progress callback to update status and message
      const onProgress: ArtworkProgressCallback = (newStatus, message) => {
        setStatus(newStatus);
        if (message) setProgressMessage(message);
      };

      try {
        setStatus('generating');
        const result = await generateArtworkForStory(
          firestoreDocId,
          storyId,
          title,
          storyText,
          onProgress,
        );
        setArtworkUrl(result.artworkUrl);
        setArtworkPrompt(result.prompt);
        setStatus('done');
        setProgressMessage('Artwork generated successfully');
        return result.artworkUrl;
      } catch (err: unknown) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Artwork generation failed.');
        setProgressMessage(null);
        return undefined;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setArtworkUrl(null);
    setArtworkPrompt(null);
    setError(null);
    setProgressMessage(null);
  }, []);

  return { status, artworkUrl, artworkPrompt, error, progressMessage, generate, reset };
}

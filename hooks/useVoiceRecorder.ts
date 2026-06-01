/**
 * useVoiceRecorder.ts
 *
 * Cross-platform voice recorder:
 * - Web: uses browser MediaRecorder API (works on localhost)
 * - Mobile: uses expo-av (works on Android/iOS)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type RecordingState = 'idle' | 'recording' | 'stopped' | 'error';

export interface VoiceRecorderState {
  recordingState: RecordingState;
  durationMs: number;
  isPlaying: boolean;
  audioUri: string | null;
  errorMessage: string | null;
}

export interface VoiceRecorderActions {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  playback: () => Promise<void>;
  stopPlayback: () => void;
  reset: () => void;
}

export function useVoiceRecorder(): VoiceRecorderState & VoiceRecorderActions {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Web refs ──────────────────────────────────────────────────────────────
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const audioBlobRef     = useRef<Blob | null>(null);
  const audioElementRef  = useRef<HTMLAudioElement | null>(null);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Mobile refs ───────────────────────────────────────────────────────────
  const recordingRef = useRef<any>(null);
  const soundRef     = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioElementRef.current?.pause();
      recordingRef.current?.stopAndUnloadAsync?.().catch(() => {});
      soundRef.current?.unloadAsync?.().catch(() => {});
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // WEB implementation
  // ─────────────────────────────────────────────────────────────────────────

  const startRecordingWeb = useCallback(async () => {
    try {
      setErrorMessage(null);
      setDurationMs(0);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(100);
      setRecordingState('recording');

      // Timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDurationMs(Date.now() - startTime);
      }, 200);
    } catch (err) {
      setErrorMessage('Microphone access denied. Please allow microphone in your browser.');
      setRecordingState('error');
    }
  }, []);

  const stopRecordingWeb = useCallback(async () => {
    if (!mediaRecorderRef.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return new Promise<void>((resolve) => {
      const mr = mediaRecorderRef.current!;
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUri(url);
        setRecordingState('stopped');

        // Stop all tracks
        mr.stream.getTracks().forEach((t) => t.stop());
        resolve();
      };
      mr.stop();
    });
  }, []);

  const playbackWeb = useCallback(async () => {
    if (!audioUri) return;
    const audio = new Audio(audioUri);
    audioElementRef.current = audio;
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.play();
  }, [audioUri]);

  const stopPlaybackWeb = useCallback(() => {
    audioElementRef.current?.pause();
    if (audioElementRef.current) audioElementRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE implementation (expo-av)
  // ─────────────────────────────────────────────────────────────────────────

  const startRecordingMobile = useCallback(async () => {
    try {
      setErrorMessage(null);
      setDurationMs(0);

      const { Audio } = await import('expo-av');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Microphone permission is required.');
        setRecordingState('error');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (s: any) => { if (s.isRecording) setDurationMs(s.durationMillis ?? 0); },
        200,
      );

      recordingRef.current = recording;
      setRecordingState('recording');
    } catch (err) {
      setErrorMessage('Could not start recording. Please try again.');
      setRecordingState('error');
    }
  }, []);

  const stopRecordingMobile = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      const { Audio } = await import('expo-av');
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      if (!uri) throw new Error('No recording URI.');
      setAudioUri(uri);
      setRecordingState('stopped');
    } catch {
      setErrorMessage('Failed to save recording.');
      setRecordingState('error');
    }
  }, []);

  const playbackMobile = useCallback(async () => {
    if (!audioUri) return;
    try {
      const { Audio } = await import('expo-av');
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        (s: any) => {
          if (!s.isLoaded) return;
          setIsPlaying(s.isPlaying);
          if (s.didJustFinish) setIsPlaying(false);
        },
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch {
      setErrorMessage('Could not play the recording.');
    }
  }, [audioUri]);

  const stopPlaybackMobile = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Unified reset
  // ─────────────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    audioElementRef.current?.pause();
    recordingRef.current?.stopAndUnloadAsync?.().catch(() => {});
    soundRef.current?.unloadAsync?.().catch(() => {});
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    audioBlobRef.current = null;
    audioElementRef.current = null;
    recordingRef.current = null;
    soundRef.current = null;
    setRecordingState('idle');
    setDurationMs(0);
    setIsPlaying(false);
    setAudioUri(null);
    setErrorMessage(null);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Platform routing
  // ─────────────────────────────────────────────────────────────────────────

  const isWeb = Platform.OS === 'web';

  return {
    recordingState,
    durationMs,
    isPlaying,
    audioUri,
    errorMessage,
    startRecording:  isWeb ? startRecordingWeb  : startRecordingMobile,
    stopRecording:   isWeb ? stopRecordingWeb   : stopRecordingMobile,
    playback:        isWeb ? playbackWeb        : playbackMobile,
    stopPlayback:    isWeb ? stopPlaybackWeb    : stopPlaybackMobile,
    reset,
  };
}

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Animated, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Card } from '@/components/Card';
import {
  AjrakButton,
  CulturalHeader,
  DecorativeDivider,
  PatternContainer,
  SindhiBadge,
} from '@/components/culture';
import { useTheme } from '@/context';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useScroll } from '@/context';
import { getMockStoryById } from '@/data/mockStories';
import { AI_STORIES } from '@/data/aiStories';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setScrollY } = useScroll();
  const { colors } = useTheme();
  const story = getMockStoryById(id ?? '');

  // AI Story integration
  const aiStory = AI_STORIES.find((s) => s.id === id);

  // Audio simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [narrator, setNarrator] = useState<'dadi' | 'saeen'>('dadi');
  const [readTab, setReadTab] = useState<'english' | 'sindhi'>('english');
  const playbackTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Equalizer animation values (10 vertical bars)
  const eqValues = useRef(
    Array.from({ length: 12 }).map(() => new Animated.Value(0.4))
  ).current;
  const eqAnimations = useRef<Animated.CompositeAnimation | null>(null);

  // Parse duration "M:SS" into total seconds
  const totalDurationSeconds = React.useMemo(() => {
    if (!story) return 0;
    const parts = story.duration.split(':');
    if (parts.length === 2) {
      const min = parseInt(parts[0], 10);
      const sec = parseInt(parts[1], 10);
      return min * 60 + sec;
    }
    return 180; // fallback
  }, [story]);

  // Handle audio progress simulation
  useEffect(() => {
    if (isPlaying) {
      playbackTimer.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            if (playbackTimer.current) clearInterval(playbackTimer.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
        playbackTimer.current = null;
      }
    }

    return () => {
      if (playbackTimer.current) clearInterval(playbackTimer.current);
    };
  }, [isPlaying, totalDurationSeconds]);

  // Waveform equalizer animation loop
  useEffect(() => {
    if (isPlaying) {
      const animateEq = () => {
        const animations = eqValues.map((anim) => {
          const nextVal = 0.2 + Math.random() * 1.5;
          const duration = 120 + Math.random() * 160;
          return Animated.sequence([
            Animated.timing(anim, {
              toValue: nextVal,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3 + Math.random() * 0.4,
              duration,
              useNativeDriver: true,
            }),
          ]);
        });

        eqAnimations.current = Animated.parallel(animations);
        eqAnimations.current.start((result) => {
          if (result.finished) {
            animateEq();
          }
        });
      };
      animateEq();
    } else {
      if (eqAnimations.current) {
        eqAnimations.current.stop();
      }
      // Animate all equalizer bars to a gentle idle height
      Animated.parallel(
        eqValues.map((anim) =>
          Animated.timing(anim, {
            toValue: 0.25,
            duration: 300,
            useNativeDriver: true,
          })
        )
      ).start();
    }

    return () => {
      if (eqAnimations.current) {
        eqAnimations.current.stop();
      }
    };
  }, [isPlaying, eqValues]);

  if (!story) {
    return (
      <PatternContainer>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          <CulturalHeader title="Story not found" variant="dark" compact />
          <View style={styles.center}>
            <AjrakButton label="Back to stories" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </PatternContainer>
    );
  }

  // Format MM:SS for display
  const formatTimeStr = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSkipForward = () => {
    setCurrentTime((prev) => Math.min(prev + 10, totalDurationSeconds));
  };

  const handleSkipBackward = () => {
    setCurrentTime((prev) => Math.max(prev - 10, 0));
  };

  // Progress percentage for progress bar
  const progressPercent = totalDurationSeconds > 0 ? (currentTime / totalDurationSeconds) * 100 : 0;

  return (
    <PatternContainer>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
      >
        <CulturalHeader
          title={story.title}
          subtitle={`Folklore Archive · ${story.recordedAt}`}
          variant="dark"
          compact
        />

        <DecorativeDivider label="AI Storyteller Player" />

        {/* ── Premium AI Audio Player Card ─────────────────────────────── */}
        <Card style={[styles.playerCard, { borderColor: colors.border }]}>
          {aiStory?.imageSource ? (
            <View style={styles.playerImageWrap}>
              <Image source={aiStory.imageSource} style={styles.playerImage} resizeMode="cover" />
              <View style={styles.playerImageOverlay} />
            </View>
          ) : null}

          <View style={styles.playerBody}>
            {/* AI Narrator voice selector */}
            <Text style={[styles.playerSubtitle, { color: colors.textMuted }]}>👵 Choose AI Voice Narrator</Text>
            <View style={styles.narratorContainer}>
              <Pressable
                onPress={() => setNarrator('dadi')}
                style={[
                  styles.narratorButton,
                  { backgroundColor: colors.ivoryWarm, borderColor: colors.border },
                  narrator === 'dadi' && [styles.narratorButtonActive, { backgroundColor: colors.deepIndigo, borderColor: colors.deepIndigo }],
                ]}
              >
                <Text
                  style={[
                    styles.narratorLabel,
                    { color: colors.text },
                    narrator === 'dadi' && [styles.narratorLabelActive, { color: colors.white }],
                  ]}
                >
                  👵 Dadi Fatima
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setNarrator('saeen')}
                style={[
                  styles.narratorButton,
                  { backgroundColor: colors.ivoryWarm, borderColor: colors.border },
                  narrator === 'saeen' && [styles.narratorButtonActive, { backgroundColor: colors.deepIndigo, borderColor: colors.deepIndigo }],
                ]}
              >
                <Text
                  style={[
                    styles.narratorLabel,
                    { color: colors.text },
                    narrator === 'saeen' && [styles.narratorLabelActive, { color: colors.white }],
                  ]}
                >
                  👴 Saeen Soomro
                </Text>
              </Pressable>
            </View>

            {/* Simulated Live Equalizer Animation */}
            <View style={[styles.waveformContainer, { backgroundColor: `${colors.ivoryWarm}50`, borderColor: `${colors.border}50` }]}>
              <Text style={[styles.eqStatus, { color: colors.textMuted }]}>
                {isPlaying
                  ? `AI Narrator streaming voice of ${
                      narrator === 'dadi' ? 'Dadi' : 'Saeen'
                    }…`
                  : 'Narrator ready to read aloud'}
              </Text>
              <View style={styles.eqBars}>
                {eqValues.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.eqBar,
                      {
                        transform: [{ scaleY: anim }],
                        backgroundColor: isPlaying
                          ? index % 2 === 0
                            ? colors.brickRed
                            : colors.deepIndigo
                          : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Scrubber Progress Slider */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.brickRed, width: `${progressPercent}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{formatTimeStr(currentTime)}</Text>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{story.duration}</Text>
              </View>
            </View>

            {/* Playback Controls */}
            <View style={styles.controlsRow}>
              <Pressable onPress={handleSkipBackward} style={styles.skipBtn}>
                <MaterialIcons name="replay-10" size={32} color={colors.deepIndigo} />
              </Pressable>

              <Pressable
                onPress={() => setIsPlaying(!isPlaying)}
                style={[styles.playBtn, { backgroundColor: colors.brickRed, shadowColor: colors.brickRed }]}
              >
                <MaterialIcons
                  name={isPlaying ? 'pause' : 'play-arrow'}
                  size={36}
                  color={colors.white}
                />
              </Pressable>

              <Pressable onPress={handleSkipForward} style={styles.skipBtn}>
                <MaterialIcons name="forward-10" size={32} color={colors.deepIndigo} />
              </Pressable>
            </View>
          </View>
          <View style={[styles.ajrakStripe, { backgroundColor: colors.deepIndigo }]} />
        </Card>

        {/* ── Read Segmented Selector ─────────────────────────────────── */}
        <DecorativeDivider label="Read & Translate" />

        <View style={[styles.readTabs, { borderColor: colors.border, backgroundColor: colors.ivoryWarm }]}>
          <Pressable
            onPress={() => setReadTab('english')}
            style={[styles.readTabBtn, readTab === 'english' && [styles.readTabBtnActive, { backgroundColor: colors.surface }]]}
          >
            <Text
              style={[
                styles.readTabLabel,
                { color: colors.textMuted },
                readTab === 'english' && [styles.readTabLabelActive, { color: colors.brickRed }],
              ]}
            >
              English Tale
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setReadTab('sindhi')}
            style={[styles.readTabBtn, readTab === 'sindhi' && [styles.readTabBtnActive, { backgroundColor: colors.surface }]]}
          >
            <Text
              style={[
                styles.readTabLabel,
                { color: colors.textMuted },
                readTab === 'sindhi' && [styles.readTabLabelActive, { color: colors.brickRed }],
              ]}
            >
              سنڌي ٽرانسڪرپٽ
            </Text>
          </Pressable>
        </View>

        {/* Read Card Content */}
        {readTab === 'english' ? (
          <Card style={[styles.block, styles.englishCard, { borderLeftColor: colors.gold }]}>
            <View style={styles.cardHeaderRow}>
              <SindhiBadge label="Child-friendly story" variant="gold" />
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>Preserving Heritage</Text>
            </View>
            <Text style={[styles.label, { color: colors.brickRed }]}>Tale Summary</Text>
            <Text style={[styles.body, { color: colors.text }]}>{story.storyText}</Text>
          </Card>
        ) : (
          <Card style={[styles.block, styles.sindhiCard, { borderLeftColor: colors.deepIndigo }]}>
            <View style={styles.cardHeaderRow}>
              <SindhiBadge label="Original preservation" variant="indigo" />
              <Text style={[styles.badgeLabel, { color: colors.textMuted }]}>سنڌي ٻولي</Text>
            </View>
            <Text style={[styles.label, { color: colors.brickRed }]}>Transcribed text</Text>
            <Text style={[styles.body, styles.sindhiBody, { color: colors.text }]}>{story.transcript}</Text>
          </Card>
        )}

        <View style={[styles.badge, { backgroundColor: colors.ivoryWarm, borderColor: colors.border }]}>
          <Text style={[styles.badgeText, { color: colors.deepIndigo }]}>✦ Sindh Saga · Heritage preserved</Text>
        </View>

        <AjrakButton label="Back" variant="outline" fullWidth onPress={() => router.back()} />
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xxl,
  },
  center: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding },
  
  // Player Card styles
  playerCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  playerImageWrap: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  playerImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 42, 107, 0.4)',
  },
  playerBody: {
    padding: Spacing.md,
  },
  playerSubtitle: {
    ...Typography.overline,
    fontSize: 10,
    color: SagaColors.textMuted,
    marginBottom: Spacing.sm,
  },

  // Narrators Selection
  narratorContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  narratorButton: {
    flex: 1,
    backgroundColor: SagaColors.ivoryWarm,
    borderRadius: Spacing.buttonRadius - 4,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: SagaColors.border,
  },
  narratorButtonActive: {
    backgroundColor: SagaColors.deepIndigo,
    borderColor: SagaColors.deepIndigo,
  },
  narratorLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: SagaColors.text,
  },
  narratorLabelActive: {
    color: SagaColors.white,
  },

  // Equalizer
  waveformContainer: {
    alignItems: 'center',
    backgroundColor: `${SagaColors.ivoryWarm}50`,
    borderRadius: Spacing.buttonRadius,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: `${SagaColors.border}50`,
  },
  eqStatus: {
    ...Typography.caption,
    fontSize: 12,
    color: SagaColors.textMuted,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  eqBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 5,
  },
  eqBar: {
    width: 4,
    height: 28,
    borderRadius: 2,
  },

  // Scrubber Progress Bar
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: SagaColors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: SagaColors.brickRed,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
    color: SagaColors.textMuted,
    fontVariant: ['tabular-nums'],
  },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.xs,
  },
  skipBtn: {
    padding: Spacing.xs,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SagaColors.brickRed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SagaColors.brickRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  ajrakStripe: {
    height: 5,
    backgroundColor: SagaColors.deepIndigo,
  },

  // Read Segmented Tabs
  readTabs: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: SagaColors.border,
    borderRadius: Spacing.buttonRadius,
    backgroundColor: SagaColors.ivoryWarm,
    padding: 3,
    marginBottom: Spacing.md,
  },
  readTabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Spacing.buttonRadius - 3,
  },
  readTabBtnActive: {
    backgroundColor: SagaColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  readTabLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: SagaColors.textMuted,
  },
  readTabLabelActive: {
    color: SagaColors.brickRed,
  },

  // Read Blocks
  block: {
    marginBottom: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeLabel: {
    ...Typography.overline,
    color: SagaColors.textMuted,
    fontSize: 10,
  },
  englishCard: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.gold,
  },
  sindhiCard: {
    borderLeftWidth: 4,
    borderLeftColor: SagaColors.deepIndigo,
  },
  label: {
    ...Typography.overline,
    color: SagaColors.brickRed,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 25,
    color: SagaColors.text,
  },
  sindhiBody: {
    textAlign: 'right',
    fontSize: 18,
    lineHeight: 30,
    fontFamily: 'System', // use local system rendering for Sindhi right-to-left
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: SagaColors.ivoryWarm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  badgeText: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    fontWeight: '600',
  },
});


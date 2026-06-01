import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { AjrakButton, CulturalInput } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type StorySubmissionFormData = {
  title: string;
  category: string;
  content: string;
};

type StorySubmissionFormProps = {
  categories?: string[];
  onSubmit?: (submission: StorySubmissionFormData) => Promise<void> | void;
  style?: ViewStyle;
};

const DEFAULT_CATEGORIES = [
  'Culture',
  'Family',
  'Tradition',
  'Festival',
  'Food',
  'Music',
  'Memory',
  'Poetry',
  'Village',
];

export function StorySubmissionForm({
  categories = DEFAULT_CATEGORIES,
  onSubmit,
  style,
}: StorySubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestions = useMemo(() => {
    const normalized = category.trim().toLowerCase();
    if (!normalized) return categories.slice(0, 6);
    return categories.filter((item) => item.toLowerCase().includes(normalized));
  }, [category, categories]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!title.trim() || !content.trim()) {
      setSuccess('');
      setError('Please add a story title and content before submitting.');
      return;
    }

    setIsSubmitting(true);
    clearMessages();

    try {
      await Promise.resolve(onSubmit?.({ title: title.trim(), category: category.trim(), content: content.trim() }));
      setSuccess('Your story has been sent for review. Thanks for sharing your Sindhi tale!');
      setTitle('');
      setCategory('');
      setContent('');
    } catch (submissionError) {
      setError(
        typeof submissionError === 'string'
          ? submissionError
          : 'Something went wrong while submitting your story. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [category, clearMessages, content, isSubmitting, onSubmit, title]);

  return (
    <View style={[styles.form, style]}>
      <Text style={styles.introTitle}>A gentle story for young hearts.</Text>
      <Text style={styles.introText}>
        Share a short, child-friendly Sindhi memory or tale. Keep it warm, simple, and full of heritage.
      </Text>

      <CulturalInput
        label="Story title"
        placeholder="A bright title for your story"
        value={title}
        onChangeText={(text) => {
          clearMessages();
          setTitle(text);
        }}
      />

      <CulturalInput
        label="Story category"
        placeholder="Culture, family, music..."
        value={category}
        onChangeText={(text) => {
          clearMessages();
          setCategory(text);
        }}
      />

      <Text style={styles.categoryNote}>Tap a category below or type your own.</Text>
      <View style={styles.chipRow}>
        {suggestions.map((item) => (
          <Pressable
            key={item}
            style={({ pressed }) => [
              styles.chip,
              item === category && styles.chipSelected,
              pressed && styles.chipPressed,
            ]}
            onPress={() => {
              clearMessages();
              setCategory(item);
            }}
          >
            <Text style={[styles.chipLabel, item === category && styles.chipLabelSelected]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <CulturalInput
        label="Story content"
        placeholder="Write your story in a few gentle sentences"
        value={content}
        onChangeText={(text) => {
          clearMessages();
          setContent(text);
        }}
        multiline
        numberOfLines={7}
        style={styles.textArea}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}

      <AjrakButton
        label={isSubmitting ? 'Sharing your story…' : 'Submit story'}
        onPress={handleSubmit}
        fullWidth
        loading={isSubmitting}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: SagaColors.surface,
    borderRadius: 28,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  introTitle: {
    ...Typography.h3,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
  introText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  categoryNote: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: SagaColors.background,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  chipSelected: {
    backgroundColor: SagaColors.brickRed,
    borderColor: SagaColors.brickRed,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipLabel: {
    ...Typography.body,
    color: SagaColors.textMuted,
  },
  chipLabelSelected: {
    color: SagaColors.ivory,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 160,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  errorText: {
    ...Typography.caption,
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
  },
  successText: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
  },
});

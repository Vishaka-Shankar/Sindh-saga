/**
 * StorySubmissionSection.tsx — Simple story submission UI for users to share Sindhi memories.
 */

import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AjrakButton, CulturalInput, HeritageSection } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const STORY_CATEGORIES = [
  'Culture',
  'Family',
  'Tradition',
  'Festival',
  'Food',
  'Travel',
  'Music',
  'Language',
  'Memory',
];

export default function StorySubmissionSection() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestions = useMemo(() => {
    const query = category.trim().toLowerCase();
    return STORY_CATEGORIES.filter((item) => item.toLowerCase().includes(query));
  }, [category]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;

    if (!title.trim() || !description.trim()) {
      setSuccess('');
      setError('Please add a title and story description before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      setSuccess('Your story has been submitted for review. Thank you for sharing!');
      setTitle('');
      setCategory('');
      setDescription('');
      setIsSubmitting(false);
    }, 360);
  }, [description, isSubmitting, title]);

  return (
    <HeritageSection
      title="Share Your Story"
      subtitle="Submit a quick story about Sindhi culture, family heritage, or village memories."
      showDivider
    >
      <View style={styles.container}>
        <Text style={styles.leadText}>
          Tell us what makes Sindh feel like home. A short title, a category, and your story are all we need.
        </Text>

        <CulturalInput
          label="Story title"
          placeholder="Enter a memorable title"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.categoryWrap}>
          <CulturalInput
            label="Category"
            placeholder="Choose or type a category"
            value={category}
            onChangeText={setCategory}
            onFocus={() => setCategoryFocused(true)}
            onBlur={() => setTimeout(() => setCategoryFocused(false), 100)}
          />
          <Text style={styles.categoryHint}>
            Select a category or type one to narrow the suggestion list.
          </Text>

          {categoryFocused ? (
            <View style={styles.suggestions}>
              {suggestions.map((item) => (
                <Pressable
                  key={item}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionPressed,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setCategoryFocused(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <CulturalInput
          label="Story description"
          placeholder="Write your story in a few sentences"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          style={styles.textArea}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <AjrakButton
          label={isSubmitting ? 'Submitting…' : 'Submit Story'}
          onPress={handleSubmit}
          fullWidth
          disabled={isSubmitting}
          style={styles.submitButton}
        />
      </View>
    </HeritageSection>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: 24,
    backgroundColor: SagaColors.surface,
    borderWidth: 1,
    borderColor: SagaColors.border,
  },
  leadText: {
    ...Typography.body,
    color: SagaColors.textMuted,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  categoryWrap: {
    marginBottom: Spacing.md,
  },
  categoryLabel: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    marginBottom: 6,
    fontWeight: '600',
  },
  categoryInput: {
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.buttonRadius,
    backgroundColor: SagaColors.background,
    borderWidth: 2,
    borderColor: SagaColors.border,
  },
  categoryActive: {
    opacity: 0.92,
  },
  categoryFocused: {
    borderColor: SagaColors.brickRed,
  },
  categoryValue: {
    ...Typography.body,
    color: SagaColors.text,
  },
  categoryPlaceholder: {
    color: SagaColors.textMuted,
  },
  categoryHint: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    marginTop: 8,
  },
  suggestions: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: SagaColors.border,
    borderRadius: Spacing.buttonRadius,
    backgroundColor: SagaColors.surface,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  suggestionPressed: {
    backgroundColor: SagaColors.background,
  },
  suggestionText: {
    ...Typography.body,
    color: SagaColors.deepIndigo,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    color: SagaColors.brickRed,
    marginBottom: Spacing.sm,
    ...Typography.caption,
  },
  successText: {
    color: SagaColors.deepIndigo,
    marginBottom: Spacing.sm,
    ...Typography.caption,
  },
});

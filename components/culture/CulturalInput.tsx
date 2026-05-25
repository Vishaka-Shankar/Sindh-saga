/**
 * CulturalInput.tsx — Themed text input for future forms.
 * Location: components/culture/
 */

import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

type CulturalInputProps = TextInputProps & {
  label?: string;
};

export function CulturalInput({ label, style, ...rest }: CulturalInputProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={SagaColors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  label: {
    ...Typography.caption,
    color: SagaColors.deepIndigo,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: SagaColors.surface,
    borderWidth: 2,
    borderColor: SagaColors.border,
    borderRadius: Spacing.buttonRadius,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: SagaColors.text,
  },
});

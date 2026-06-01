/**
 * QuestsScreen.tsx — Learning Quests for Sindhi Cultural Knowledge
 *
 * This screen presents a quiz about Sindhi culture and heritage.
 * Users earn 30 energy points for completing all 5 questions correctly.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AjrakButton, CulturalHeader, PatternContainer } from '@/components/culture';
import { SagaColors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/context';
import { addPoints, POINT_VALUES } from '@/services/pointsService';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    question: "What is Ajrak?",
    options: ["A Sindhi block-printed cloth", "A type of food", "A dance form", "A musical instrument"],
    correct: 0,
  },
  {
    question: "Which river flows through Sindh?",
    options: ["Indus", "Ganges", "Chenab", "Jhelum"],
    correct: 0,
  },
  {
    question: "What is a Ralli quilt?",
    options: ["A patchwork quilt from Sindh", "A Sindhi song", "A pottery style", "A festival"],
    correct: 0,
  },
  {
    question: "What is Mohenjo-daro?",
    options: ["An ancient Indus Valley city", "A Sindhi dessert", "A folk dance", "A type of embroidery"],
    correct: 0,
  },
  {
    question: "What language is primarily spoken in Sindh?",
    options: ["Sindhi", "Punjabi", "Balochi", "Pashto"],
    correct: 0,
  },
];

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const handleAnswer = async (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question after short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) === QUESTIONS.length) {
          setShowCelebration(true);
          // Award points for completing quest
          if (userId) {
            try {
              addPoints(userId, POINT_VALUES.QUEST_COMPLETED, 'Learning Quest completed');
            } catch (error) {
              console.error('Failed to award quest points:', error);
            }
          }
        }
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowCelebration(false);
    setAnswered(false);
  };

  const renderQuestion = () => (
    <View style={styles.questionContainer}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correct;
          const showCorrect = answered && isCorrect;
          const showIncorrect = answered && isSelected && !isCorrect;

          return (
            <Pressable
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                showCorrect && styles.correctOption,
                showIncorrect && styles.incorrectOption,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={answered}
            >
              <Text
                style={[
                  styles.optionText,
                  (showCorrect || showIncorrect) && styles.optionTextWhite,
                ]}
              >
                {option}
              </Text>
              {showCorrect && (
                <MaterialIcons name="check-circle" size={24} color="#FFFFFF" style={styles.optionIcon} />
              )}
              {showIncorrect && (
                <MaterialIcons name="cancel" size={24} color="#FFFFFF" style={styles.optionIcon} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.resultCard}>
        {showCelebration ? (
          <>
            <MaterialIcons name="emoji-events" size={64} color={SagaColors.gold} />
            <Text style={styles.celebrationTitle}>🎉 Perfect Score!</Text>
            <Text style={styles.celebrationText}>
              You earned {POINT_VALUES.QUEST_COMPLETED} Energy Points!
            </Text>
          </>
        ) : (
          <>
            <MaterialIcons name="quiz" size={64} color={SagaColors.deepIndigo} />
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.resultScore}>
              You got {score} out of {QUESTIONS.length} correct
            </Text>
            {score === QUESTIONS.length ? (
              <Text style={styles.resultMessage}>Excellent work! You're a Sindhi culture expert!</Text>
            ) : score >= 3 ? (
              <Text style={styles.resultMessage}>Great job! Keep learning about Sindhi heritage!</Text>
            ) : (
              <Text style={styles.resultMessage}>Keep exploring Sindhi culture and try again!</Text>
            )}
          </>
        )}
        <AjrakButton
          label="Try Again"
          variant="primary"
          fullWidth
          onPress={handleRestart}
          style={styles.restartButton}
        />
      </View>
    </View>
  );

  return (
    <PatternContainer patternOpacity={0.05}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <CulturalHeader
          title="Learning Quests"
          subtitle="Test your knowledge of Sindhi culture and heritage"
        />

        {showResult ? renderResult() : renderQuestion()}
      </ScrollView>
    </PatternContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  questionContainer: {
    gap: Spacing.lg,
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressText: {
    ...Typography.caption,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: SagaColors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SagaColors.brickRed,
  },
  questionCard: {
    backgroundColor: SagaColors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: SagaColors.gold,
  },
  questionText: {
    ...Typography.h2,
    color: SagaColors.deepIndigo,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: SagaColors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: SagaColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    borderColor: SagaColors.deepIndigo,
  },
  correctOption: {
    backgroundColor: SagaColors.ruliGreen,
    borderColor: SagaColors.ruliGreen,
  },
  incorrectOption: {
    backgroundColor: SagaColors.error,
    borderColor: SagaColors.error,
  },
  optionText: {
    ...Typography.body,
    color: SagaColors.text,
    flex: 1,
  },
  optionTextWhite: {
    color: '#FFFFFF',
  },
  optionIcon: {
    marginLeft: Spacing.sm,
  },
  resultContainer: {
    paddingVertical: Spacing.xl,
  },
  resultCard: {
    backgroundColor: SagaColors.surface,
    borderRadius: 20,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: SagaColors.gold,
    gap: Spacing.md,
  },
  celebrationTitle: {
    ...Typography.h1,
    color: SagaColors.deepIndigo,
    textAlign: 'center',
  },
  celebrationText: {
    ...Typography.body,
    color: SagaColors.text,
    textAlign: 'center',
  },
  resultTitle: {
    ...Typography.h1,
    color: SagaColors.deepIndigo,
    textAlign: 'center',
  },
  resultScore: {
    ...Typography.h2,
    color: SagaColors.brickRed,
    textAlign: 'center',
  },
  resultMessage: {
    ...Typography.body,
    color: SagaColors.textMuted,
    textAlign: 'center',
  },
  restartButton: {
    marginTop: Spacing.md,
  },
});

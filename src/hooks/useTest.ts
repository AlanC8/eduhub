import { useState, useCallback, useEffect } from 'react';
import { Test, TestResult } from '@/types/test';
import { testService } from '@/services/testService';

export const useTest = (initialTestId?: number) => {
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);

  const fetchTest = useCallback(async (testId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getTestById(testId);
      setTest(data);
      // Reset answers when loading new test
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setTestResults(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch test');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAnswer = useCallback((questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [test, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const getCurrentQuestion = useCallback(() => {
    if (!test) return null;
    return test.questions[currentQuestionIndex];
  }, [test, currentQuestionIndex]);

  const getProgress = useCallback(() => {
    if (!test) return 0;
    return (Object.keys(selectedAnswers).length / test.questions.length) * 100;
  }, [test, selectedAnswers]);

  const checkAnswers = useCallback(() => {
    if (!test) return;

    const results: TestResult = {
      totalQuestions: test.questions.length,
      correctAnswers: 0,
      score: 0,
      details: []
    };

    test.questions.forEach(question => {
      const selectedOptionId = selectedAnswers[question.questionId];
      const correctOption = question.options.find(opt => opt.isCorrect);
      const correctOptionId = correctOption?.questionOptionId || 0;

      const isCorrect = selectedOptionId === correctOptionId;
      if (isCorrect) {
        results.correctAnswers++;
      }

      results.details.push({
        questionId: question.questionId,
        isCorrect,
        correctOptionId,
        selectedOptionId: selectedOptionId || 0
      });
    });

    results.score = (results.correctAnswers / results.totalQuestions) * 100;
    setTestResults(results);
    setShowResults(true);
  }, [test, selectedAnswers]);

  const isTestCompleted = useCallback(() => {
    if (!test) return false;
    return Object.keys(selectedAnswers).length === test.questions.length;
  }, [test, selectedAnswers]);

  const resetTest = useCallback(() => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setTestResults(null);
  }, []);

  // Load initial test if ID is provided
  useEffect(() => {
    if (initialTestId) {
      fetchTest(initialTestId);
    }
  }, [initialTestId, fetchTest]);

  return {
    test,
    loading,
    error,
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex,
    selectedAnswers,
    progress: getProgress(),
    showResults,
    testResults,
    isCompleted: isTestCompleted(),
    actions: {
      fetchTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      checkAnswers,
      resetTest
    }
  };
}; 
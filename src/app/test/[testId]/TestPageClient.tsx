'use client';

import { useTest } from '@/hooks/useTest';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TestPageClientProps {
  testId: number;
}

export default function TestPageClient({ testId }: TestPageClientProps) {
  const {
    test,
    loading,
    error,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    progress,
    showResults,
    testResults,
    isCompleted,
    actions
  } = useTest(testId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-violet-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-violet-500 text-xl">📝</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-red-100">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6">
            <div className="text-4xl animate-bounce">⚠️</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">Ошибка загрузки теста</h1>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => actions.fetchTest(testId)}
            className="mt-6 w-full py-3 px-6 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  const timeRemaining = new Date(test.endTime).getTime() - new Date().getTime();
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  if (showResults && testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-violet-100">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{testResults.score >= 70 ? '🎉' : '📝'}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{test.title}</h1>
                <p className="text-gray-600">Тест завершен</p>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-violet-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-violet-600 mb-2">
                    {Math.round(testResults.score)}%
                  </div>
                  <div className="text-sm text-violet-600">Общий результат</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {testResults.correctAnswers}
                  </div>
                  <div className="text-sm text-emerald-600">Правильных ответов</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {testResults.totalQuestions}
                  </div>
                  <div className="text-sm text-blue-600">Всего вопросов</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-violet-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Детальный разбор</h2>
            <div className="space-y-6">
              {test.questions.map((question, index) => {
                const result = testResults.details.find(d => d.questionId === question.questionId);
                if (!result) return null;

                return (
                  <div
                    key={question.questionId}
                    className={`p-6 rounded-2xl ${
                      result.isCorrect ? 'bg-emerald-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        result.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                      }`}>
                        {result.isCorrect ? '✓' : '×'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Вопрос {index + 1}: {question.text}
                        </h3>
                        <div className="space-y-3">
                          {question.options.map(option => (
                            <div
                              key={option.questionOptionId}
                              className={`p-4 rounded-xl ${
                                option.questionOptionId === result.correctOptionId
                                  ? 'bg-emerald-100 border-2 border-emerald-500'
                                  : option.questionOptionId === result.selectedOptionId && !result.isCorrect
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-white/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {option.questionOptionId === result.correctOptionId && (
                                  <span className="text-emerald-500">✓ Правильный ответ</span>
                                )}
                                {option.questionOptionId === result.selectedOptionId && !result.isCorrect && (
                                  <span className="text-red-500">× Ваш ответ</span>
                                )}
                                <span className={`${
                                  option.questionOptionId === result.correctOptionId
                                    ? 'text-emerald-700'
                                    : option.questionOptionId === result.selectedOptionId && !result.isCorrect
                                    ? 'text-red-700'
                                    : 'text-gray-700'
                                }`}>
                                  {option.text}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={actions.resetTest}
              className="px-6 py-4 rounded-2xl font-medium bg-white text-violet-600 hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Пройти тест заново
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Test Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-violet-100">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{test.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Преподаватель</div>
                    <div className="font-medium">{test.educatorFullName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    🕒
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Начало</div>
                    <div className="font-medium">
                      {format(new Date(test.startTime), 'dd MMMM HH:mm', { locale: ru })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">До окончания</div>
                    <div className="font-medium text-red-600">
                      {hours}ч {minutes}м
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-violet-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium">
                {currentQuestionIndex + 1}
              </div>
              <span className="text-sm font-medium text-gray-700">
                из {test.questions.length} вопросов
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse"></div>
              <span className="text-sm font-medium text-violet-600">
                {Math.round(progress)}% завершено
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-violet-100">
            <h2 className="text-2xl font-medium text-gray-800 mb-8">
              {currentQuestion.text}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.questionOptionId}
                  onClick={() => actions.selectAnswer(currentQuestion.questionId, option.questionOptionId)}
                  className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswers[currentQuestion.questionId] === option.questionOptionId
                      ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-lg'
                      : 'border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedAnswers[currentQuestion.questionId] === option.questionOptionId
                        ? 'border-violet-500 bg-violet-500 text-white'
                        : 'border-gray-300 group-hover:border-violet-300'
                    }`}>
                      {selectedAnswers[currentQuestion.questionId] === option.questionOptionId && '✓'}
                    </div>
                    <span className="text-lg font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={actions.previousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-violet-600 hover:bg-violet-50 shadow-lg hover:shadow-xl hover:scale-105'
            }`}
          >
            ← Предыдущий вопрос
          </button>
          {currentQuestionIndex === test.questions.length - 1 ? (
            <button
              onClick={actions.checkAnswers}
              disabled={!isCompleted}
              className={`flex-1 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform ${
                !isCompleted
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              Завершить тест
            </button>
          ) : (
            <button
              onClick={actions.nextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
              className="flex-1 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Следующий вопрос →
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 
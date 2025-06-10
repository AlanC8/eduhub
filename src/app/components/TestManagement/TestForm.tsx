'use client';

import { useState } from 'react';
import { CreateTestRequest, Question } from '@/types/test';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface TestFormProps {
  initialData?: Partial<CreateTestRequest>;
  onSubmit: (data: CreateTestRequest) => Promise<void>;
  educatorId: number;
  availableGroups: { id: number; name: string }[];
  availableDisciplines: { id: number; name: string }[];
}

export default function TestForm({
  initialData,
  onSubmit,
  educatorId,
  availableGroups,
  availableDisciplines,
}: TestFormProps) {
  const [formData, setFormData] = useState<Partial<CreateTestRequest>>({
    educatorId,
    title: '',
    disciplineId: undefined,
    groupIds: [],
    startTime: '',
    endTime: '',
    questions: [
      {
        text: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ],
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.disciplineId || (formData.groupIds && formData.groupIds.length === 0)) {
        throw new Error('Пожалуйста, заполните все обязательные поля');
      }

      if (!formData.startTime || !formData.endTime) {
        throw new Error('Пожалуйста, укажите время начала и окончания теста');
      }

      const questions = formData.questions || [];
      if (questions.length === 0) {
        throw new Error('Добавьте хотя бы один вопрос');
      }

      for (const question of questions) {
        if (!question.text) {
          throw new Error('Все вопросы должны иметь текст');
        }

        const options = question.options || [];
        if (options.length < 2) {
          throw new Error('Каждый вопрос должен иметь минимум 2 варианта ответа');
        }

        if (!options.some(opt => opt.isCorrect)) {
          throw new Error('Каждый вопрос должен иметь хотя бы один правильный ответ');
        }

        if (options.some(opt => !opt.text)) {
          throw new Error('Все варианты ответов должны иметь текст');
        }
      }

      await onSubmit(formData as CreateTestRequest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении теста');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          text: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index),
    }));
  };

  const addOption = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) =>
        i === questionIndex
          ? { ...q, options: [...(q.options || []), { text: '', isCorrect: false }] }
          : q
      ),
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options?.filter((_, j) => j !== optionIndex) }
          : q
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-violet-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Основная информация</h2>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Название теста *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
              placeholder="Введите название теста"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Дисциплина *
            </label>
            <select
              value={formData.disciplineId}
              onChange={e => setFormData(prev => ({ ...prev, disciplineId: Number(e.target.value) }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
            >
              <option value="">Выберите дисциплину</option>
              {availableDisciplines.map(discipline => (
                <option key={discipline.id} value={discipline.id} className="text-gray-900">
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Группы *
            </label>
            <div className="grid gap-3">
              {availableGroups.map(group => (
                <label key={group.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.groupIds?.includes(group.id)}
                    onChange={e => {
                      const groupId = group.id;
                      setFormData(prev => ({
                        ...prev,
                        groupIds: e.target.checked
                          ? [...(prev.groupIds || []), groupId]
                          : prev.groupIds?.filter(id => id !== groupId),
                      }));
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-gray-900">{group.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Время начала *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Время окончания *
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-violet-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Вопросы</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Добавить вопрос
          </button>
        </div>

        <div className="space-y-8">
          {formData.questions?.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-200"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Вопрос {questionIndex + 1} *
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={e => {
                      const newText = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        questions: prev.questions?.map((q, i) =>
                          i === questionIndex ? { ...q, text: newText } : q
                        ),
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
                    placeholder="Введите текст вопроса"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  title="Удалить вопрос"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-900">
                  Варианты ответов *
                </label>
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={e => {
                            const isCorrect = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              questions: prev.questions?.map((q, i) =>
                                i === questionIndex
                                  ? {
                                      ...q,
                                      options: q.options?.map((opt, j) =>
                                        j === optionIndex
                                          ? { ...opt, isCorrect }
                                          : opt
                                      ),
                                    }
                                  : q
                              ),
                            }));
                          }}
                          className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={e => {
                            const newText = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              questions: prev.questions?.map((q, i) =>
                                i === questionIndex
                                  ? {
                                      ...q,
                                      options: q.options?.map((opt, j) =>
                                        j === optionIndex
                                          ? { ...opt, text: newText }
                                          : opt
                                      ),
                                    }
                                  : q
                              ),
                            }));
                          }}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-900"
                          placeholder="Введите вариант ответа"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      title="Удалить вариант"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(questionIndex)}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Добавить вариант
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Сохранение...' : 'Сохранить тест'}
        </button>
      </div>
    </form>
  );
} 
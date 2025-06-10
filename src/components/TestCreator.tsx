import { useState } from 'react';
import { CreateTestRequest } from '@/types/test';
import { testService } from '@/services/testService';
import { Toast } from './Toast';

interface TestCreatorProps {
  onTestCreated?: () => void;
}

export default function TestCreator({ onTestCreated }: TestCreatorProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<CreateTestRequest>({
    educatorId: 0,
    disciplineId: 0,
    groupIds: [],
    title: '',
    startTime: '',
    endTime: '',
    questions: [
      {
        text: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await testService.createTest(formData);
      setToastMessage('Тест успешно создан!');
      setToastType('success');
      setShowToast(true);
      onTestCreated?.();
      
      // Reset form
      setFormData({
        educatorId: 0,
        disciplineId: 0,
        groupIds: [],
        title: '',
        startTime: '',
        endTime: '',
        questions: [
          {
            text: '',
            options: [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
          }
        ]
      });
    } catch (error) {
      setToastMessage('Ошибка при создании теста');
      setToastType('error');
      setShowToast(true);
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const addOption = (questionIndex: number) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
      return { ...prev, questions: newQuestions };
    });
  };

  const updateQuestion = (index: number, text: string) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index].text = text;
      return { ...prev, questions: newQuestions };
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string, isCorrect: boolean) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options[optionIndex] = { text, isCorrect };
      return { ...prev, questions: newQuestions };
    });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Test Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название теста
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Преподавателя
              </label>
              <input
                type="number"
                value={formData.educatorId}
                onChange={e => setFormData(prev => ({ ...prev, educatorId: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Дисциплины
              </label>
              <input
                type="number"
                value={formData.disciplineId}
                onChange={e => setFormData(prev => ({ ...prev, disciplineId: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время начала
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время окончания
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Групп (через запятую)
            </label>
            <input
              type="text"
              value={formData.groupIds.join(',')}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                groupIds: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
              }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="1, 2, 3"
              required
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Вопросы</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Добавить вопрос
            </button>
          </div>

          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Текст вопроса {qIndex + 1}
                </label>
                <input
                  type="text"
                  value={question.text}
                  onChange={e => updateQuestion(qIndex, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Варианты ответов</h4>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm text-violet-600 hover:text-violet-700"
                  >
                    + Добавить вариант
                  </button>
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={option.text}
                      onChange={e => updateOption(qIndex, oIndex, e.target.value, option.isCorrect)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder={`Вариант ${oIndex + 1}`}
                      required
                    />
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={e => updateOption(qIndex, oIndex, option.text, e.target.checked)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Правильный</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Создать тест
          </button>
        </div>
      </form>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
} 
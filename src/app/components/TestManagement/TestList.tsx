'use client';

import { Test } from '@/types/test';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TestListProps {
  tests: Test[];
  onEdit: (test: Test) => void;
  onDelete: (testId: number) => void;
}

export default function TestList({ tests, onEdit, onDelete }: TestListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tests.map(test => (
        <div
          key={test.testId}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-violet-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{test.title}</h3>
            <p className="text-sm text-gray-700">{test.educatorFullName}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">Начало:</span>
              <span className="font-medium text-gray-900">
                {format(new Date(test.startTime), 'PPp', { locale: ru })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">Окончание:</span>
              <span className="font-medium text-gray-900">
                {format(new Date(test.endTime), 'PPp', { locale: ru })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">Вопросов:</span>
              <span className="font-medium text-gray-900">{test.questions.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => onEdit(test)}
              className="p-2 rounded-xl text-violet-600 hover:bg-violet-50 transition-colors"
              title="Редактировать тест"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(test.testId)}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              title="Удалить тест"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 
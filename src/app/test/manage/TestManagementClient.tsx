'use client';

import { useState } from 'react';
import TestForm from '@/app/components/TestManagement/TestForm';
import TestList from '@/app/components/TestManagement/TestList';
import { CreateTestRequest, Test } from '@/types/test';
import { PlusIcon } from 'lucide-react';

interface TestManagementClientProps {
  educatorId: number;
  availableGroups: { id: number; name: string }[];
  availableDisciplines: { id: number; name: string }[];
}

export default function TestManagementClient({
  educatorId,
  availableGroups,
  availableDisciplines,
}: TestManagementClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [tests, setTests] = useState<Test[]>([]); // В реальном приложении здесь будет тип Test[]
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const isAdmin = educatorId === 0;

  const handleCreateTest = async (data: CreateTestRequest) => {
    try {
      // В реальном приложении здесь будет вызов API
      console.log('Creating test:', data);
      setShowForm(false);
      setSelectedTest(null);
      // После успешного создания обновить список тестов
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleEditTest = async (data: CreateTestRequest) => {
    try {
      // В реальном приложении здесь будет вызов API
      console.log('Updating test:', data);
      setShowForm(false);
      setSelectedTest(null);
      // После успешного обновления обновить список тестов
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    try {
      // В реальном приложении здесь будет вызов API
      console.log('Deleting test:', testId);
      // После успешного удаления обновить список тестов
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedTest ? 'Редактирование теста' : 'Создание теста'}
          </h2>
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedTest(null);
            }}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>

        <TestForm
          initialData={selectedTest}
          educatorId={educatorId}
          availableGroups={availableGroups}
          availableDisciplines={availableDisciplines}
          onSubmit={selectedTest ? handleEditTest : handleCreateTest}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Создать тест
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {isAdmin ? 'В системе пока нет тестов' : 'У вас пока нет созданных тестов'}
          </h3>
          <p className="text-gray-600">
            Нажмите кнопку "Создать тест", чтобы создать {isAdmin ? '' : 'свой '}первый тест
          </p>
        </div>
      ) : (
        <TestList
          tests={tests}
          onEdit={(test) => {
            setSelectedTest(test);
            setShowForm(true);
          }}
          onDelete={handleDeleteTest}
        />
      )}
    </div>
  );
} 
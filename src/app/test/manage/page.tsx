import { Metadata } from 'next';
import TestManagementClient from './TestManagementClient';

export const metadata: Metadata = {
  title: 'Управление тестами | EduHub',
  description: 'Создание и редактирование тестов',
};

export default async function TestManagementPage() {
  // В реальном приложении эти данные будут загружаться из API
  const mockGroups = [
    { id: 1, name: 'Группа 101' },
    { id: 2, name: 'Группа 102' },
    { id: 3, name: 'Группа 201' },
  ];

  const mockDisciplines = [
    { id: 1, name: 'Математика' },
    { id: 2, name: 'Физика' },
    { id: 3, name: 'Информатика' },
  ];

  // В реальном приложении ID преподавателя будет браться из сессии
  const mockEducatorId = 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Управление тестами</h1>
          <p className="mt-2 text-gray-600">
            Создавайте и редактируйте тесты для ваших студентов
          </p>
        </div>

        <TestManagementClient
          educatorId={mockEducatorId}
          availableGroups={mockGroups}
          availableDisciplines={mockDisciplines}
        />
      </div>
    </div>
  );
} 
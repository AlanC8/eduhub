'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import { useUsers } from '../hooks/useUsers';

type Appeal = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
};

const mockAppeals: Appeal[] = [
  {
    id: '1',
    title: 'Запрос на перезачет предмета',
    description: 'Прошу рассмотреть возможность перезачета предмета "Математический анализ" на основании...',
    status: 'pending',
    date: '2024-03-20',
    category: 'Академические вопросы',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Проблема с доступом к курсу',
    description: 'Не могу получить доступ к материалам курса "Программирование на Python"...',
    status: 'in_progress',
    date: '2024-03-19',
    category: 'Технические проблемы',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Уточнение по стипендии',
    description: 'Прошу разъяснить порядок начисления повышенной стипендии за научную деятельность...',
    status: 'resolved',
    date: '2024-03-15',
    category: 'Финансовые вопросы',
    priority: 'low'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'На рассмотрении',
  in_progress: 'В обработке',
  resolved: 'Решено',
  rejected: 'Отклонено'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export default function Appeals() {
  const { currentUser, loading } = useUsers();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [filter, setFilter] = useState('all');

  const filteredAppeals = mockAppeals.filter(appeal => {
    if (filter === 'all') return true;
    return appeal.status === filter;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-white px-6 py-3 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          <span className="text-indigo-600">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
          <Header activePage="appeals" />

          <div className="flex-1 p-6">
            {/* Header section */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Обращения</h1>
              <p className="mt-1 text-sm text-gray-500">
                Управление обращениями и заявками
              </p>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={filter === 'all'
                    ? 'px-3 py-1.5 text-sm rounded-lg transition bg-indigo-600 text-white'
                    : 'px-3 py-1.5 text-sm rounded-lg transition bg-white text-gray-600 hover:bg-gray-50'}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={filter === 'pending'
                    ? 'px-3 py-1.5 text-sm rounded-lg transition bg-indigo-600 text-white'
                    : 'px-3 py-1.5 text-sm rounded-lg transition bg-white text-gray-600 hover:bg-gray-50'}
                >
                  На рассмотрении
                </button>
                <button
                  onClick={() => setFilter('in_progress')}
                  className={filter === 'in_progress'
                    ? 'px-3 py-1.5 text-sm rounded-lg transition bg-indigo-600 text-white'
                    : 'px-3 py-1.5 text-sm rounded-lg transition bg-white text-gray-600 hover:bg-gray-50'}
                >
                  В обработке
                </button>
                <button
                  onClick={() => setFilter('resolved')}
                  className={filter === 'resolved'
                    ? 'px-3 py-1.5 text-sm rounded-lg transition bg-indigo-600 text-white'
                    : 'px-3 py-1.5 text-sm rounded-lg transition bg-white text-gray-600 hover:bg-gray-50'}
                >
                  Решенные
                </button>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
              >
                <span className="material-icons-round text-base">add</span>
                Создать обращение
              </button>
            </div>

            {/* Appeals list */}
            <div className="grid gap-4">
              {filteredAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedAppeal(appeal)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{appeal.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {appeal.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[appeal.status]}`}>
                          {statusLabels[appeal.status]}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[appeal.priority]}`}>
                          Приоритет: {priorityLabels[appeal.priority]}
                        </span>
                        <span className="text-gray-500">{appeal.category}</span>
                      </div>
                    </div>
                    <time className="text-sm text-gray-500">{new Date(appeal.date).toLocaleDateString('ru-RU')}</time>
                  </div>
                </div>
              ))}
            </div>

            {/* Create appeal modal */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  <div className="relative rounded-xl bg-white p-6 shadow-xl max-w-lg w-full">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">Новое обращение</h3>
                      <button
                        onClick={() => setIsCreateModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="material-icons-round">close</span>
                      </button>
                    </div>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Тема
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Введите тему обращения"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Категория
                        </label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                          <option>Академические вопросы</option>
                          <option>Технические проблемы</option>
                          <option>Финансовые вопросы</option>
                          <option>Другое</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Описание
                        </label>
                        <textarea
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={4}
                          placeholder="Опишите вашу проблему или запрос подробно"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Приоритет
                        </label>
                        <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                          <option value="low">Низкий</option>
                          <option value="medium">Средний</option>
                          <option value="high">Высокий</option>
                        </select>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCreateModalOpen(false)}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                        >
                          Отправить
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* View appeal modal */}
            {selectedAppeal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  <div className="relative rounded-xl bg-white p-6 shadow-xl max-w-lg w-full">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">{selectedAppeal.title}</h3>
                      <button
                        onClick={() => setSelectedAppeal(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="material-icons-round">close</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedAppeal.status]}`}>
                            {statusLabels[selectedAppeal.status]}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[selectedAppeal.priority]}`}>
                            Приоритет: {priorityLabels[selectedAppeal.priority]}
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                          {selectedAppeal.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Детали</h4>
                        <dl className="mt-2 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Категория:</dt>
                            <dd className="text-gray-900">{selectedAppeal.category}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Дата создания:</dt>
                            <dd className="text-gray-900">
                              {new Date(selectedAppeal.date).toLocaleDateString('ru-RU')}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setSelectedAppeal(null)}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
}

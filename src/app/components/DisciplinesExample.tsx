'use client';

import { useEffect, useState } from 'react';
import { useDisciplines } from '../hooks/useDisciplines';
import { DisciplineCreateRequest } from '../../types';

export default function DisciplinesExample() {
  const { 
    disciplines, 
    selectedDiscipline, 
    educationalPrograms,
    loading, 
    error, 
    total,
    getAllDisciplines, 
    getDisciplineById, 
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    getAllEducationalPrograms,
    clearError,
    clearSelectedDiscipline 
  } = useDisciplines();

  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState<DisciplineCreateRequest>({
    author: "system",
    author_modified: "system",
    computer: false,
    description: "",
    educational_program_id: 1,
    enabled: true,
    labs: 0,
    lectures: 0,
    online: false,
    practices: 0,
    title: ""
  });

  useEffect(() => {
    getAllDisciplines();
    getAllEducationalPrograms();
  }, [getAllDisciplines, getAllEducationalPrograms]);

  const handleDisciplineSelect = async (disciplineId: number) => {
    setSelectedDisciplineId(disciplineId);
    try {
      await getDisciplineById(disciplineId);
    } catch (error) {
      console.error('Error loading discipline details:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedDisciplineId(null);
    setShowEditForm(false);
    clearSelectedDiscipline();
  };

  const resetForm = () => {
    setNewDiscipline({
      author: "system",
      author_modified: "system",
      computer: false,
      description: "",
      educational_program_id: (educationalPrograms && educationalPrograms[0]?.educational_program_id) || 1,
      enabled: true,
      labs: 0,
      lectures: 0,
      online: false,
      practices: 0,
      title: ""
    });
  };

  const handleCreateDiscipline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiscipline(newDiscipline);
      resetForm();
      setShowCreateForm(false);
      getAllDisciplines();
    } catch (error) {
      console.error('Error creating discipline:', error);
    }
  };

  const getDisciplineTypeIcon = (discipline: any) => {
    if (discipline.computer) return '💻';
    if (discipline.online) return '🌐';
    return '📚';
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Ошибка</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={clearError}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Скрыть ошибку
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Управление дисциплинами</h2>
          <p className="text-gray-600">Создавайте и настраивайте учебные дисциплины</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            resetForm();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="text-lg">{showCreateForm ? '✕' : '➕'}</span>
          {showCreateForm ? 'Отмена' : 'Создать дисциплину'}
        </button>
      </div>
      
      {loading && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-xl border border-blue-200">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-700 font-medium">Загрузка...</span>
          </div>
        </div>
      )}

      {/* Форма создания дисциплины */}
      {showCreateForm && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-blue-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">✨</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Создать новую дисциплину</h3>
              <p className="text-gray-600">Заполните информацию о дисциплине</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateDiscipline} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Название дисциплины *
                </label>
                <input
                  type="text"
                  value={newDiscipline.title}
                  onChange={(e) => setNewDiscipline({...newDiscipline, title: e.target.value})}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                  placeholder="Введите название дисциплины"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Образовательная программа *
                </label>
                <select
                  value={newDiscipline.educational_program_id}
                  onChange={(e) => setNewDiscipline({
                    ...newDiscipline, 
                    educational_program_id: parseInt(e.target.value)
                  })}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                  required
                >
                  {(educationalPrograms || []).map(program => (
                    <option key={program.educational_program_id} value={program.educational_program_id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Описание
              </label>
              <textarea
                value={newDiscipline.description}
                onChange={(e) => setNewDiscipline({...newDiscipline, description: e.target.value})}
                className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none resize-none"
                rows={3}
                placeholder="Описание дисциплины"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Лекции (часов)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDiscipline.lectures}
                  onChange={(e) => setNewDiscipline({...newDiscipline, lectures: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Практики (часов)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDiscipline.practices}
                  onChange={(e) => setNewDiscipline({...newDiscipline, practices: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Лабораторные (часов)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newDiscipline.labs}
                  onChange={(e) => setNewDiscipline({...newDiscipline, labs: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Настройки дисциплины</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDiscipline.enabled}
                    onChange={(e) => setNewDiscipline({...newDiscipline, enabled: e.target.checked})}
                    className="h-5 w-5 text-blue-600 rounded-lg border-2 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Активна</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDiscipline.computer}
                    onChange={(e) => setNewDiscipline({...newDiscipline, computer: e.target.checked})}
                    className="h-5 w-5 text-purple-600 rounded-lg border-2 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Компьютерная</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDiscipline.online}
                    onChange={(e) => setNewDiscipline({...newDiscipline, online: e.target.checked})}
                    className="h-5 w-5 text-emerald-600 rounded-lg border-2 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Онлайн</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                <span className="text-lg">✅</span>
                Создать дисциплину
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex items-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                <span className="text-lg">↩️</span>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Список дисциплин */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">📚</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Список дисциплин</h3>
              <p className="text-gray-600">Всего дисциплин: {total}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {(disciplines || []).map((discipline) => (
              <div 
                key={discipline.discipline_id}
                className={`group relative overflow-hidden rounded-2xl p-4 border-2 cursor-pointer transition-all duration-300 mx-2 my-2 ${
                  selectedDisciplineId === discipline.discipline_id 
                    ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-101' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md'
                }`}
                onClick={() => handleDisciplineSelect(discipline.discipline_id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getDisciplineTypeIcon(discipline)}</span>
                      <h4 className="font-semibold text-gray-800 truncate">{discipline.title || 'Без названия'}</h4>
                    </div>
                    {discipline.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{discipline.description}</p>
                    )}
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      <span>Лекции: {discipline.lectures}ч</span>
                      <span>Практики: {discipline.practices}ч</span>
                      <span>Лабы: {discipline.labs}ч</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">ID: {discipline.discipline_id}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      discipline.enabled 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {discipline.enabled ? '✅ Активна' : '❌ Отключена'}
                    </span>
                    
                    <div className="flex gap-1">
                      {discipline.computer && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                          💻
                        </span>
                      )}
                      {discipline.online && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                          🌐
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Детали дисциплины */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Детали дисциплины</h3>
                <p className="text-gray-600">Подробная информация</p>
              </div>
            </div>
            {selectedDiscipline && (
              <button 
                onClick={handleClearSelection}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Очистить выбор"
              >
                ✕
              </button>
            )}
          </div>

          {selectedDiscipline ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  Основная информация
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">ID:</span>
                    <p className="text-gray-600">{selectedDiscipline.discipline_id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Название:</span>
                    <p className="text-gray-600">{selectedDiscipline.title || 'Не указано'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-700">Описание:</span>
                    <p className="text-gray-600">{selectedDiscipline.description || 'Не указано'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Программа ID:</span>
                    <p className="text-gray-600">{selectedDiscipline.educational_program_id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Автор:</span>
                    <p className="text-gray-600">{selectedDiscipline.author || 'Не указан'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Создана:</span>
                    <p className="text-gray-600">{new Date(selectedDiscipline.created).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Изменена:</span>
                    <p className="text-gray-600">{new Date(selectedDiscipline.modified).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl p-6 border border-emerald-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>⏰</span>
                  Распределение часов
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedDiscipline.lectures}</div>
                    <div className="text-sm text-gray-600">Лекции</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedDiscipline.practices}</div>
                    <div className="text-sm text-gray-600">Практики</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedDiscipline.labs}</div>
                    <div className="text-sm text-gray-600">Лабораторные</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-200 text-center">
                  <div className="text-xl font-bold text-gray-800">
                    Всего: {selectedDiscipline.lectures + selectedDiscipline.practices + selectedDiscipline.labs} часов
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-2xl p-6 border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  Свойства дисциплины
                </h4>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    selectedDiscipline.enabled 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {selectedDiscipline.enabled ? '✅ Активна' : '❌ Отключена'}
                  </span>
                  {selectedDiscipline.computer && (
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold border border-purple-200">
                      💻 Компьютерная дисциплина
                    </span>
                  )}
                  {selectedDiscipline.online && (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200">
                      🌐 Онлайн формат
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 opacity-50">📚</div>
              <p className="text-gray-500 text-lg mb-2">Выберите дисциплину для просмотра деталей</p>
              <p className="text-gray-400 text-sm">Кликните на дисциплину из списка слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
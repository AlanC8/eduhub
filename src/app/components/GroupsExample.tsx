'use client';

import { useEffect, useState } from 'react';
import { useGroups } from '../hooks/useGroups';
import { GroupCreateRequest } from '../../types';

export default function GroupsExample() {
  const { 
    groups, 
    selectedGroup, 
    groupUsers, 
    loading, 
    error, 
    total,
    getAllGroups, 
    getGroupById, 
    createGroup,
    deleteGroup,
    getGroupUsers,
    clearError,
    clearSelectedGroup 
  } = useGroups();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState<GroupCreateRequest>({
    author: "system",
    author_modified: "system",
    description: "",
    educational_program_id: null,
    enabled: true,
    is_main_group: false,
    is_study_group: true,
    title: ""
  });

  useEffect(() => {
    // Загружаем список групп при монтировании компонента
    getAllGroups();
  }, [getAllGroups]);

  const handleGroupSelect = async (groupId: number) => {
    setSelectedGroupId(groupId);
    try {
      await getGroupById(groupId);
      await getGroupUsers(groupId);
    } catch (error) {
      console.error('Error loading group details:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedGroupId(null);
    clearSelectedGroup();
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup(newGroup);
      setNewGroup({
        author: "system",
        author_modified: "system",
        description: "",
        educational_program_id: null,
        enabled: true,
        is_main_group: false,
        is_study_group: true,
        title: ""
      });
      setShowCreateForm(false);
      // Перезагружаем список групп
      getAllGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      try {
        await deleteGroup(groupId);
        if (selectedGroupId === groupId) {
          handleClearSelection();
        }
        // Перезагружаем список групп
        getAllGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Управление группами</h2>
          <p className="text-gray-600">Создавайте и настраивайте учебные группы</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="text-lg">{showCreateForm ? '✕' : '➕'}</span>
          {showCreateForm ? 'Отмена' : 'Создать группу'}
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

      {/* Форма создания группы */}
      {showCreateForm && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-blue-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">✨</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Создать новую группу</h3>
              <p className="text-gray-600">Заполните информацию о группе</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateGroup} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Название группы *
                </label>
                <input
                  type="text"
                  value={newGroup.title}
                  onChange={(e) => setNewGroup({...newGroup, title: e.target.value})}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                  placeholder="Введите название группы"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  ID образовательной программы
                </label>
                <input
                  type="number"
                  value={newGroup.educational_program_id || ''}
                  onChange={(e) => setNewGroup({
                    ...newGroup, 
                    educational_program_id: e.target.value ? parseInt(e.target.value) : null
                  })}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none"
                  placeholder="ID программы (опционально)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Описание
              </label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                className="w-full border-2 border-gray-200 focus:border-blue-500 text-gray-800 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none resize-none"
                rows={3}
                placeholder="Описание группы"
              />
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Настройки группы</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroup.enabled}
                    onChange={(e) => setNewGroup({...newGroup, enabled: e.target.checked})}
                    className="h-5 w-5 text-blue-600 rounded-lg border-2 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Активна</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroup.is_main_group}
                    onChange={(e) => setNewGroup({...newGroup, is_main_group: e.target.checked})}
                    className="h-5 w-5 text-purple-600 rounded-lg border-2 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Основная группа</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroup.is_study_group}
                    onChange={(e) => setNewGroup({...newGroup, is_study_group: e.target.checked})}
                    className="h-5 w-5 text-emerald-600 rounded-lg border-2 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Учебная группа</span>
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
                Создать группу
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
        {/* Список групп */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🏫</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Список групп</h3>
              <p className="text-gray-600">Всего групп: {total}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {groups.map((group) => (
              <div 
                key={group.group_id}
                className={`group relative overflow-hidden rounded-2xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                  selectedGroupId === group.group_id 
                    ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md'
                }`}
                onClick={() => handleGroupSelect(group.group_id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{group.title || 'Без названия'}</h4>
                    {group.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{group.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">ID: {group.group_id}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      group.enabled 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {group.enabled ? '✅ Активна' : '❌ Отключена'}
                    </span>
                    
                    <div className="flex gap-1">
                      {group.is_main_group && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                          Основная
                        </span>
                      )}
                      {group.is_study_group && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                          Учебная
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.group_id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      title="Удалить группу"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Детали группы */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Детали группы</h3>
                <p className="text-gray-600">Подробная информация</p>
              </div>
            </div>
            {selectedGroup && (
              <button 
                onClick={handleClearSelection}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Очистить выбор"
              >
                ✕
              </button>
            )}
          </div>

          {selectedGroup ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  Основная информация
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">ID:</span>
                    <p className="text-gray-600">{selectedGroup.group_id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Название:</span>
                    <p className="text-gray-600">{selectedGroup.title || 'Не указано'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-gray-700">Описание:</span>
                    <p className="text-gray-600">{selectedGroup.description || 'Не указано'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Программа ID:</span>
                    <p className="text-gray-600">{selectedGroup.educational_program_id || 'Не указано'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Автор:</span>
                    <p className="text-gray-600">{selectedGroup.author || 'Не указан'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Создана:</span>
                    <p className="text-gray-600">{new Date(selectedGroup.created).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Изменена:</span>
                    <p className="text-gray-600">{new Date(selectedGroup.modified).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-2xl p-6 border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  Свойства группы
                </h4>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    selectedGroup.enabled 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {selectedGroup.enabled ? '✅ Активна' : '❌ Отключена'}
                  </span>
                  {selectedGroup.is_main_group && (
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold border border-purple-200">
                      👑 Основная группа
                    </span>
                  )}
                  {selectedGroup.is_study_group && (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200">
                      📚 Учебная группа
                    </span>
                  )}
                </div>
              </div>

              {groupUsers.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl p-6 border border-emerald-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>👥</span>
                    Пользователи группы ({groupUsers.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {groupUsers.map((user) => (
                      <div key={user.user_id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{user.login}</p>
                            {user.fio && <p className="text-sm text-gray-600">{user.fio}</p>}
                            {user.position && <p className="text-xs text-gray-500">{user.position}</p>}
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {user.is_admin && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                                Admin
                              </span>
                            )}
                            {user.is_student && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                                Student
                              </span>
                            )}
                            {user.is_service && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                                Service
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              user.enabled 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.enabled ? 'Активен' : 'Отключен'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 opacity-50">🏫</div>
              <p className="text-gray-500 text-lg mb-2">Выберите группу для просмотра деталей</p>
              <p className="text-gray-400 text-sm">Кликните на группу из списка слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
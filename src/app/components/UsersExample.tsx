'use client';

import { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';

export default function UsersExample() {
  const { 
    users, 
    selectedUser, 
    userGroups, 
    loading, 
    error, 
    total,
    getAllUsers, 
    getUserById, 
    getUserGroups,
    clearError,
    clearSelectedUser 
  } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    // Загружаем список пользователей при монтировании компонента
    getAllUsers();
  }, [getAllUsers]);

  const handleUserSelect = async (userId: number) => {
    setSelectedUserId(userId);
    try {
      await getUserById(userId);
      await getUserGroups(userId);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedUserId(null);
    clearSelectedUser();
  };

  // Функция для определения роли пользователя
  const getUserRole = (user: any) => {
    if (user.is_admin) return { label: 'Администратор', color: 'purple', icon: '👑' };
    if (user.is_student) return { label: 'Студент', color: 'blue', icon: '🎓' };
    if (user.is_service) return { label: 'Сервисный', color: 'gray', icon: '⚙️' };
    return { label: 'Преподаватель', color: 'emerald', icon: '👨‍🏫' };
  };

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🚨</div>
            <div>
              <h3 className="text-2xl font-bold text-red-800">Произошла ошибка</h3>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          </div>
          <button 
            onClick={clearError}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="text-lg">✕</span>
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Управление пользователями</h2>
          <p className="text-gray-600">Просматривайте и управляйте учетными записями пользователей</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-sm text-gray-600">Всего пользователей</p>
                <p className="text-2xl font-bold text-blue-700">{total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-xl border border-blue-200">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-700 font-medium">Загрузка пользователей...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Список пользователей */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">👤</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Список пользователей</h3>
              <p className="text-gray-600">Активных пользователей: {users.filter(u => u.enabled).length}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {users.map((user) => {
              const role = getUserRole(user);
              return (
                <div 
                  key={user.user_id}
                  className={`group relative overflow-hidden rounded-2xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                    selectedUserId === user.user_id 
                      ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-105' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md'
                  }`}
                  onClick={() => handleUserSelect(user.user_id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${role.color}-500 to-${role.color}-600 flex items-center justify-center text-white text-lg font-semibold shadow-lg`}>
                        {role.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{user.login}</h4>
                        {user.fio && (
                          <p className="text-sm text-gray-600 truncate">{user.fio}</p>
                        )}
                        {user.position && (
                          <p className="text-xs text-gray-500 truncate">{user.position}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">ID: {user.user_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.enabled 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.enabled ? '✅ Активен' : '❌ Отключен'}
                      </span>
                      
                      {/* Role */}
                      <span className={`bg-${role.color}-100 text-${role.color}-700 px-2 py-1 rounded-lg text-xs font-medium`}>
                        {role.label}
                      </span>
                      
                      {/* Additional badges */}
                      <div className="flex gap-1">
                        {user.local && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium">
                            Локальный
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Детали пользователя */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Детали пользователя</h3>
                <p className="text-gray-600">Подробная информация</p>
              </div>
            </div>
            {selectedUser && (
              <button 
                onClick={handleClearSelection}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Очистить выбор"
              >
                ✕
              </button>
            )}
          </div>

          {selectedUser ? (
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  Основная информация
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">ID пользователя:</span>
                    <p className="text-gray-600">{selectedUser.user_id}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Логин:</span>
                    <p className="text-gray-600">{selectedUser.login}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">ФИО:</span>
                    <p className="text-gray-600">{selectedUser.fio || 'Не указано'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Должность:</span>
                    <p className="text-gray-600">{selectedUser.position || 'Не указано'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">SID:</span>
                    <p className="text-gray-600">{selectedUser.sid || 'Не указан'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Тип аккаунта:</span>
                    <p className="text-gray-600">{selectedUser.local ? 'Локальный' : 'Внешний'}</p>
                  </div>
                </div>
              </div>

              {/* Роли и права */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-2xl p-6 border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  Роли и права доступа
                </h4>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    selectedUser.enabled 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {selectedUser.enabled ? '✅ Аккаунт активен' : '❌ Аккаунт отключен'}
                  </span>
                  
                  {selectedUser.is_admin && (
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold border border-purple-200">
                      👑 Администратор
                    </span>
                  )}
                  {selectedUser.is_student && (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200">
                      🎓 Студент
                    </span>
                  )}
                  {selectedUser.is_service && (
                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200">
                      ⚙️ Сервисный аккаунт
                    </span>
                  )}
                  {!selectedUser.is_admin && !selectedUser.is_student && !selectedUser.is_service && (
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-200">
                      👨‍🏫 Преподаватель
                    </span>
                  )}
                  
                  {selectedUser.local && (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-semibold border border-yellow-200">
                      🏠 Локальный аккаунт
                    </span>
                  )}
                </div>
              </div>

              {/* Группы пользователя */}
              {userGroups.length > 0 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl p-6 border border-emerald-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🏫</span>
                    Участие в группах ({userGroups.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {userGroups.map((group) => (
                      <div key={group.group_id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-gray-800">{group.title || 'Без названия'}</h5>
                            {group.description && (
                              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">ID группы: {group.group_id}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              group.enabled 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {group.enabled ? 'Активна' : 'Отключена'}
                            </span>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50/50 rounded-2xl p-6 border border-gray-200">
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 opacity-50">🏫</div>
                    <p className="text-gray-500 text-lg">Пользователь не состоит в группах</p>
                    <p className="text-gray-400 text-sm">Группы не назначены</p>
                  </div>
                </div>
              )}

              {/* Дополнительные данные */}
              {selectedUser.data && Object.keys(selectedUser.data).length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Дополнительные данные
                  </h4>
                  <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                      {JSON.stringify(selectedUser.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4 opacity-50">👤</div>
              <p className="text-gray-500 text-lg mb-2">Выберите пользователя для просмотра деталей</p>
              <p className="text-gray-400 text-sm">Кликните на пользователя из списка слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
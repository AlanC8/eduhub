'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import UsersExample from '../components/UsersExample';
import GroupsExample from '../components/GroupsExample';
import ApiTester from '../components/ApiTester';

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'groups' | 'api-test'>('dashboard');

  /* «живые» метрики */
  const stats = [
    {
      icon: '👥',
      label: 'Пользователей',
      value: '1,342',
      change: '+12%',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      icon: '🎓',
      label: 'Студентов',
      value: '1,102',
      change: '+8%',
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
    {
      icon: '👨‍🏫',
      label: 'Преподавателей',
      value: '204',
      change: '+3%',
      gradient: 'from-violet-500 via-violet-600 to-violet-700',
      bgGradient: 'from-violet-50 to-violet-100',
    },
    {
      icon: '⚙️',
      label: 'Админов',
      value: '6',
      change: '0%',
      gradient: 'from-amber-500 via-amber-600 to-amber-700',
      bgGradient: 'from-amber-50 to-amber-100',
    },
  ];

  const quickActions = [
    { 
      title: 'Управление пользователями', 
      description: 'Добавить, редактировать или удалить пользователей',
      icon: '👤', 
      color: 'blue',
      action: () => setActiveTab('users')
    },
    { 
      title: 'Управление группами', 
      description: 'Создать и настроить учебные группы',
      icon: '👥', 
      color: 'purple',
      action: () => setActiveTab('groups')
    },
    { 
      title: 'API Тестирование', 
      description: 'Проверить работоспособность системы',
      icon: '🧪', 
      color: 'green',
      action: () => setActiveTab('api-test')
    },
    { 
      title: 'Настройки системы', 
      description: 'Конфигурация и безопасность',
      icon: '⚙️', 
      color: 'orange',
      action: () => {}
    },
    { 
      title: 'Аналитика', 
      description: 'Отчеты и статистика использования',
      icon: '📊', 
      color: 'indigo',
      action: () => {}
    },
    { 
      title: 'Резервное копирование', 
      description: 'Создать резервную копию данных',
      icon: '💾', 
      color: 'teal',
      action: () => {}
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text">
              Панель администратора
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Полный контроль над образовательной платформой
            </p>
            <div className="flex items-center gap-2 text-white/80">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm">Система работает стабильно</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              <span className="text-lg">➕</span>
              Быстрые действия
            </button>
            <button className="inline-flex items-center gap-2 bg-emerald-500 border border-emerald-400 px-6 py-3 rounded-xl text-white font-medium hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span className="text-lg">📊</span>
              Экспорт отчета
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon, label, value, change, gradient, bgGradient }) => (
          <div
            key={label}
            className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/50`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                {icon}
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-10">
              <div className="text-4xl">{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-3xl">⚡</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Быстрые действия</h2>
            <p className="text-gray-600">Управляйте системой эффективно</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map(({ title, description, icon, color, action }) => (
            <button
              key={title}
              onClick={action}
              className={`group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-${color}-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-left`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl p-3 rounded-xl bg-${color}-100 group-hover:bg-${color}-200 transition-colors duration-300`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700">{description}</p>
                </div>
              </div>
              <div className={`absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity duration-300`}>
                <div className="text-4xl">{icon}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">💚</div>
            <h3 className="text-xl font-semibold text-gray-800">Состояние системы</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Сервер</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-emerald-700 font-medium">Онлайн</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">База данных</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-emerald-700 font-medium">Работает</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">API</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-emerald-700 font-medium">Доступно</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📈</div>
            <h3 className="text-xl font-semibold text-gray-800">Активность сегодня</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Входов в систему</span>
              <span className="text-xl font-bold text-blue-700">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">API запросов</span>
              <span className="text-xl font-bold text-blue-700">24,891</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Новых пользователей</span>
              <span className="text-xl font-bold text-blue-700">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-gray-500 from-gray-50 via-blue-50/30 to-indigo-50/50">
        <Sidebar />

        <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
          <Header activePage="admin" />

          {/* Modern Tabs */}
          <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
            <nav className="flex space-x-1 px-6 py-2">
              {[
                { key: 'dashboard', label: 'Дашборд', icon: '📊' },
                { key: 'users', label: 'Пользователи', icon: '👥' },
                { key: 'groups', label: 'Группы', icon: '🏫' },
                { key: 'api-test', label: 'API Тесты', icon: '🧪' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    activeTab === key
                      ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <section className="flex-1 p-6 z-0">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <UsersExample />
                </div>
              )}
              {activeTab === 'groups' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <GroupsExample />
                </div>
              )}
              {activeTab === 'api-test' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <ApiTester />
                </div>
              )}
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
}

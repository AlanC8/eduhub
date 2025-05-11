'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminHome() {
  /* «живые» метрики (мокаем) */
  const stats = [
    {
      icon: 'groups',
      label: 'Пользователей',
      value: '1 342',
      gradient: 'from-indigo-500 to-sky-500',
    },
    {
      icon: 'school',
      label: 'Студентов',
      value: '1 102',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: 'person',
      label: 'Преподавателей',
      value: '204',
      gradient: 'from-fuchsia-600 to-pink-500',
    },
    {
      icon: 'admin_panel_settings',
      label: 'Админов',
      value: '6',
      gradient: 'from-amber-400 to-yellow-400',
    },
  ];

  const panels = [
    { title: 'Пользователи', icon: 'badge', color: 'primary' },
    { title: 'Дисциплины', icon: 'menu_book', color: 'secondary' },
    { title: 'Настройки системы', icon: 'tune', color: 'accent' },
    { title: 'Интеграции', icon: 'hub', color: 'info' },
    { title: 'Мониторинг', icon: 'monitor_heart', color: 'success' },
    { title: 'Feature Flags', icon: 'flag', color: 'warning' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
        <Header activePage="admin" />

        <section className="p-4  sm:p-6 animate-fade-in flex-1 flex flex-col gap-6">
          {/* HERO */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 via-indigo-600 to-fuchsia-600 text-white shadow-xl">
            {/* декоративная текстура */}
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[url('/pattern.svg')] before:opacity-10" />
            <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center text-white justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold drop-shadow">
                  Панель администратора
                </h1>
                <p className="opacity-90">
                  Полный контроль над системой и пользователями
                </p>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-white border border-white px-4 py-2 rounded-xl text-sm  transition shadow"
              >
                <span className="material-icons-round text-base">add</span>
                Добавить администратора
              </Link>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ icon, label, value, gradient }) => (
              <div
                key={label}
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}
                  >
                    <span className="material-icons-round">{icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-2xl font-semibold text-gray-800 leading-none">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MANAGEMENT GRID */}
          <div className="bg-white rounded-3xl shadow-soft p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-icons-round text-accent">settings</span>
              Управление
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {panels.map(({ title, icon, color }) => (
                <Link
                  key={title}
                  href="#"
                  className="border rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3 group"
                >
                  <span
                    className={`material-icons-round text-${color} group-hover:scale-110 transform transition `}
                  >
                    {icon}
                  </span>
                  <span className="font-medium text-gray-700 group-hover:text-${color}">
                    {title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

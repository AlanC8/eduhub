'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Calendar from './components/calendar/Calendar';
import ProtectedRoute from './components/ProtectedRoute';

const stats = [
  { icon: 'assignment', label: 'Задания', value: '24', sub: '4 просрочено' },
  { icon: 'event_note', label: 'События', value: '7',  sub: 'ближайших'   },
  { icon: 'grade',      label: 'Средний балл', value: '3.78'              },
  { icon: 'timer',      label: 'Часы учёбы',   value: '426', sub: 'в семестре' },
];

export default function Home() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [],
  );

  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />

        <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
          <Header activePage="home" />

          {/* ---------- MAIN ---------- */}
          <section className="flex-1 p-4 sm:p-6 flex flex-col gap-6">

            {/* Hero — нейтральная карточка */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h1 className="text-2xl font-semibold">Добро пожаловать, Алан!</h1>
                <p className="text-sm text-gray-500 mt-1">{today} · Весенний семестр</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm">Вы в сети</span>
              </div>
            </div>

            {/* Stats — плоские карточки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map(({ icon, label, value, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-white shadow-xs p-4 flex items-center gap-4 hover:shadow-md transition"
                >
                  <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-gray-100">
                    <span className="material-icons-round text-indigo-600">{icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-lg font-medium">
                      {value}{' '}
                      {sub && <span className="text-xs text-red-500 ml-1">{sub}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* App banner — лёгкий акцент */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-lg font-medium mb-1">EduHub в телефоне</h2>
                <p className="text-sm text-gray-500">Скачай приложение и получай уведомления.</p>
                <div className="flex gap-3 mt-4">
                  {['apple', 'android'].map((p) => (
                    <button
                      key={p}
                      className="flex items-center gap-2 text-sm border border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                    >
                      <span className="material-icons-round text-base">{p}</span>
                      {p === 'apple' ? 'iOS' : 'Android'}
                    </button>
                  ))}
                </div>
              </div>
              <span className="material-icons-round text-6xl text-gray-200">smartphone</span>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Calendar */}
              <div className="w-full lg:w-2/3 space-y-6">
                <Calendar />
              </div>

              {/* Right column */}
              <div className="w-full lg:w-1/3 space-y-6">
                {/* Notifications */}
                <Panel
                  title="Уведомления"
                  icon="notifications"
                  items={[
                    { text: 'Анкетирование «Информационный лист».', date: '04.04 07:00' },
                    { text: 'Запись в транскрипт «Основы ИБ».', date: '02.04 02:14' },
                    { text: 'Запись в транскрипт «Управление проектами».', date: '02.04 12:16' },
                  ]}
                />

                {/* Announcements */}
                <Panel
                  title="Объявления"
                  icon="campaign"
                  items={[
                    { text: 'Назначено анкетирование (multilang).', date: '04.04 09:55' },
                    { text: 'Тест Final_ISB_1 до 15.04.', date: '19.03 08:12' },
                  ]}
                />
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
}

/* ------------ helpers -------------- */

function Panel({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: { text: string; date: string }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xs p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="flex items-center gap-2 font-medium">
          <span className="material-icons-round text-indigo-600">{icon}</span>
          {title}
        </h3>
        <Link href="#" className="text-sm text-indigo-600 hover:underline">
          Все
        </Link>
      </div>
      <ul className="space-y-3">
        {items.map(({ text, date }) => (
          <li key={text} className="flex gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-2" />
            <div>
              <p className="text-sm">{text}</p>
              <time className="block text-xs text-gray-400">{date}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

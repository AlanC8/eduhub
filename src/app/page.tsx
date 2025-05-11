'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  /* вычисляем дату один раз в рендере */
  const today = useMemo(() => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
        <Header activePage="home" />

        {/* ─────────────────────  HERO  ───────────────────── */}
        <section className="p-4 sm:p-6 animate-fade-in flex flex-col gap-6 flex-1">
          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-600 text-white shadow-xl">
            {/* decorative blobs */}
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[url('/pattern.svg')] before:opacity-10 before:mix-blend-overlay" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8">
              <div>
                <h1 className="text-3xl font-bold leading-tight drop-shadow">
                  Добро пожаловать, Алан!
                </h1>
                <p className="opacity-90 mt-1">{today} · Весенний семестр</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="font-medium tracking-wide">Вы в сети</span>
              </div>
            </div>
          </div>

          {/* ─────────────────────  QUICK STATS  ───────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                icon: 'assignment',
                label: 'Задания',
                value: '24',
                sub: '(4 просрочено)',
                color: 'from-blue-500 to-sky-400',
              },
              {
                icon: 'event_note',
                label: 'События',
                value: '7',
                sub: 'ближайших',
                color: 'from-purple-500 to-fuchsia-500',
              },
              {
                icon: 'grade',
                label: 'Средний балл',
                value: '3.78',
                sub: '',
                color: 'from-amber-400 to-yellow-400',
              },
              {
                icon: 'timer',
                label: 'Часы учёбы',
                value: '426',
                sub: 'в семестре',
                color: 'from-emerald-500 to-teal-400',
              },
            ].map(({ icon, label, value, sub, color }) => (
              <div
                key={label}
                className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}
                  >
                    <span className="material-icons-round">{icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-2xl font-semibold text-gray-800 leading-none">
                      {value}{' '}
                      {sub && (
                        <span className="text-xs font-normal text-red-500 ml-1">
                          {sub}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─────────────────────  APP  BANNER  ───────────────────── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 text-white shadow-xl">
            <button className="absolute right-3 top-3 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition">
              <span className="material-icons-round">close</span>
            </button>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div>
                <h2 className="text-2xl font-bold mb-1 drop-shadow">
                  EduHub на твоём телефоне
                </h2>
                <p className="opacity-90 text-sm">
                  Скачай приложение и получай уведомления мгновенно
                </p>

                <div className="flex gap-3 mt-5">
                  {[
                    { icon: 'apple', label: 'iOS' },
                    { icon: 'android', label: 'Android' },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 bg-white/10 border border-white/30 px-4 py-2 rounded-xl text-sm text-white/90 hover:bg-white/20 transition shadow"
                    >
                      <span className="material-icons-round text-base">
                        {icon}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <span className="material-icons-round text-[120px] opacity-20 md:opacity-40 lg:opacity-50">
                smartphone
              </span>
            </div>

            {/* blurred circles */}
            <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-white/10 rounded-full" />
            <div className="absolute -top-16 -left-24 w-64 h-64 bg-white/5 rounded-full" />
          </div>

          {/* ─────────────────────  CONTENT  ───────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* CALENDAR PLACEHOLDER (scrollable) */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="bg-white rounded-3xl shadow-soft overflow-hidden flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                      <span className="material-icons-round">chevron_left</span>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                      <span className="material-icons-round">chevron_right</span>
                    </button>
                    <h2 className="text-lg font-medium text-gray-700">
                      Май 2025
                    </h2>
                  </div>

                  <div className="flex border rounded-xl overflow-hidden text-sm">
                    {['Месяц', 'Неделя', 'День'].map((v, i) => (
                      <button
                        key={v}
                        className={`px-4 py-1 ${
                          i === 0
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </header>

                {/* заглушка календаря (вместо громоздкой сетки) */}
                <div className="flex items-center justify-center flex-1 py-16 text-gray-400 text-sm">
                  📅 Здесь будет интерактивный календарь
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-3xl shadow-soft p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <span className="material-icons-round text-primary">
                      notifications
                    </span>
                    Уведомления
                  </h3>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Все
                  </Link>
                </div>

                <ul className="space-y-3">
                  {[
                    {
                      color: 'primary',
                      text: 'Назначено анкетирование «Информационный лист» (20.04 – 30.04).',
                      date: '04.04 07:00',
                    },
                    {
                      color: 'success',
                      text: 'Добавлена запись в транскрипт «Основы ИБ».',
                      date: '02.04 02:14',
                    },
                    {
                      color: 'secondary',
                      text: 'Добавлена запись в транскрипт «Управление проектами».',
                      date: '02.04 12:16',
                    },
                  ].map(({ color, text, date }) => (
                    <li
                      key={text}
                      className={`p-3 border-l-4 border-${color} rounded-r-xl bg-${color}-50/40 hover:bg-${color}-50 transition shadow-sm`}
                    >
                      <p className="text-sm text-gray-700">{text}</p>
                      <time className="block text-xs text-gray-400 mt-1">
                        {date}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-3xl shadow-soft p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <span className="material-icons-round text-accent">
                      campaign
                    </span>
                    Объявления
                  </h3>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Все
                  </Link>
                </div>

                <ul className="space-y-3">
                  {[
                    {
                      color: 'accent',
                      text: 'Вам назначено анкетирование (мультиязычное).',
                      date: '04.04 09:55',
                    },
                    {
                      color: 'info',
                      text: 'Новое тестирование Final_ISB_1. Пройти до 15.04.',
                      date: '19.03 08:12',
                    },
                  ].map(({ color, text, date }) => (
                    <li
                      key={text}
                      className={`p-3 border-l-4 border-${color} rounded-r-xl bg-${color}-50/40 hover:bg-${color}-50 transition shadow-sm`}
                    >
                      <p className="text-sm text-gray-700">{text}</p>
                      <time className="block text-xs text-gray-400 mt-1">
                        {date}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

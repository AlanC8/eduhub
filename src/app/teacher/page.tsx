'use client';

import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TeacherHome() {
  const kpis = [
    {
      icon: 'people',
      label: 'Групп',
      value: '4',
      gradient: 'from-sky-500 to-blue-400',
    },
    {
      icon: 'assignment_turned_in',
      label: 'Проверить работ',
      value: '27',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: 'insert_chart',
      label: 'Средний балл',
      value: '4.1',
      gradient: 'from-amber-400 to-yellow-400',
    },
    {
      icon: 'timer',
      label: 'Часы лекций',
      value: '142',
      gradient: 'from-emerald-500 to-teal-400',
    },
  ];

  const courses = [
    { title: 'Алгоритмы и структуры данных', code: 'CS-202' },
    { title: 'Информационная безопасность', code: 'IS-305' },
    { title: 'Веб-технологии', code: 'WT-210' },
    { title: 'Управление проектами', code: 'PM-330' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-[70px] lg:ml-[76px] w-full flex flex-col">
        <Header activePage="teacher" />

        <section className="p-4 sm:p-6 animate-fade-in flex-1 flex flex-col gap-6">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-600 text-white shadow-xl">
            <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[url('/pattern.svg')] before:opacity-10" />
            <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold leading-tight drop-shadow">
                  Добро пожаловать, преподаватель!
                </h1>
                <p className="opacity-90 mt-1">
                  Управляйте курсами, заданиями и прогрессом студентов
                </p>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 px-4 py-2 rounded-xl text-sm text-white/90 hover:bg-white/20 transition shadow"
              >
                <span className="material-icons-round text-base">add</span>
                Новое объявление
              </Link>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(({ icon, label, value, gradient }) => (
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

          {/* MY COURSES */}
          <div className="bg-white rounded-3xl shadow-soft p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-icons-round text-secondary">menu_book</span>
              Мои курсы
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map(({ title, code }) => (
                <div
                  key={code}
                  className="border rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{code}</p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                    >
                      Студенты
                      <span className="material-icons-round text-base">
                        group
                      </span>
                    </Link>
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                    >
                      Задания
                      <span className="material-icons-round text-base">
                        assignment
                      </span>
                    </Link>
                    <Link
                      href="#"
                      className="ml-auto flex items-center text-primary hover:text-primary-dark"
                    >
                      <span className="material-icons-round text-base">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

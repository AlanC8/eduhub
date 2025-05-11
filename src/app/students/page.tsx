'use client';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function StudentHome() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-[70px] lg:ml-[76px] w-full">
        <Header activePage="student" />

        {/* DASHBOARD */}
        <div className="p-4 sm:p-6 animate-fade-in">
          {/* Greeting */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Привет, студент! 🎓
            </h1>
            <p className="text-gray-600 mt-1">
              Здесь собрана твоя учёба одним взглядом.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
              { icon: 'assignment', label: 'Задания', value: '12' },
              { icon: 'grade', label: 'Средний балл', value: '3.9' },
              { icon: 'event', label: 'События', value: '5' },
              { icon: 'schedule', label: 'Сегодня пар', value: '3' },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mr-4">
                    <span className="material-icons-round">{icon}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="material-icons-round text-blue-500 mr-2">
                timetable
              </span>
              Ближайшие пары
            </h2>

            <ul className="divide-y divide-gray-200">
              {['09:00 — 10:30', '10:45 — 12:15', '13:00 — 14:30'].map(
                (time, i) => (
                  <li key={time} className="py-3 flex justify-between text-gray-700">
                    <span className="font-medium">{time} — Веб-технологии</span>
                    <span className="text-sm text-gray-500">Ауд. 504</span>
                  </li>
                ),
              )}
            </ul>

            <Link
              href="#"
              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Полное расписание
              <span className="material-icons-round text-base ml-1">
                chevron_right
              </span>
            </Link>
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}

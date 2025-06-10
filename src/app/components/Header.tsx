'use client';

import { useState } from 'react';
import Link from 'next/link';
import NotificationsDropdown from './NotificationsDropdown';

/**
 * Страницы, которые могут передаваться в Header.
 * Расширили список: теперь без ошибок собираются student/teacher/admin-экраны.
 */
export type PageKey = 'home' | 'map' | 'student' | 'teacher' | 'admin' | 'appeals';

interface HeaderProps {
  /** Какая страница сейчас активна (нужно для подсветки кнопок, если надо) */
  activePage?: PageKey;
}

export default function Header({ activePage = 'home' }: HeaderProps) {
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-3 border-b bg-white/70 backdrop-blur-md sticky top-0 z-9999999 shadow-soft">
      <div className="flex items-center">
        <span className="material-icons-round text-black mr-2"> </span>
        <span className="text-gray-600 hidden sm:inline"> </span>
      </div>

      <div className="flex items-center space-x-3">
        <form className="hidden md:flex relative max-w-xs ">
          <input
            type="text"
            placeholder="Поиск..."
            className="py-2 pl-9 pr-4 w-full rounded-full text-black text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <span className="material-icons-round text-gray-400 absolute left-3 top-2">
            search
          </span>
        </form>

        <Link
          href="/map"
          className={`${activePage === 'map'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            px-4 py-2 rounded-full flex items-center text-sm transition-all duration-200 shadow-sm`}
        >
          <span className="material-icons-round text-sm mr-1">map</span>
          <span className="hidden sm:inline">Карта сайта</span>
        </Link>

        <NotificationsDropdown />

        <div className="relative">
          <button
            className="text-gray-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowEmailDropdown(!showEmailDropdown)}
          >
            <span className="material-icons-round">email</span>
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1 shadow-md">
              3
            </span>
          </button>

          {showEmailDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-slide-up">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Сообщения</h3>
                <Link
                  href="#"
                  className="text-sm text-primary hover:text-primary-dark transition-colors"
                >
                  Все сообщения
                </Link>
              </div>

              <div className="max-h-[240px] overflow-y-auto divide-y">
                {[
                  {
                    initials: 'ИП',
                    color: 'blue',
                    name: 'Иван Петров',
                    time: '10:23',
                    text: 'Добрый день, когда будет следующая лекция по информатике?',
                  },
                  {
                    initials: 'АС',
                    color: 'purple',
                    name: 'Анна Смирнова',
                    time: 'Вчера',
                    text: 'Спасибо за помощь с заданием!',
                  },
                  {
                    initials: 'ЕК',
                    color: 'amber',
                    name: 'Елена Кузнецова',
                    time: 'Пн',
                    text: 'Пожалуйста, отправьте материалы по семинару',
                  },
                ].map(({ initials, color, name, time, text }) => (
                  <div
                    key={time + initials}
                    className="p-3 hover:bg-gray-50 transition-colors flex gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}
                    >
                      <span className={`font-medium text-${color}-600`}>
                        {initials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-800">
                          {name}
                        </h4>
                        <span className="text-xs text-gray-400">{time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-100">
                <div className="flex rounded-lg overflow-hidden border">
                  <input
                    type="text"
                    placeholder="Написать..."
                    className="flex-1 px-3 py-2 text-sm border-none focus:outline-none"
                  />
                  <button className="bg-primary text-white px-3 flex items-center">
                    <span className="material-icons-round text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Аватар / выпадающее меню */}
        <div className="relative group">
          <button className="overflow-hidden rounded-full flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/30">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center text-white font-medium">
              AЖ
            </div>
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
            <div className="py-2">
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <span className="material-icons-round text-gray-400 mr-2 text-sm">
                  person
                </span>
                Профиль
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <span className="material-icons-round text-gray-400 mr-2 text-sm">
                  settings
                </span>
                Настройки
              </Link>
              <hr className="my-1" />
              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center"
              >
                <span className="material-icons-round text-red-400 mr-2 text-sm">
                  logout
                </span>
                Выйти
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

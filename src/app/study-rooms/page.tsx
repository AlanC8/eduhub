// app/study-rooms/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
// Иконки
import { Home, ChevronRight, Calendar, CheckSquare, Users, LogIn, Filter as FilterIcon, ChevronDown, AlertCircle } from 'lucide-react';

// --- Типы данных (без изменений) ---
interface StudyRoomEntry {
  id: string;
  disciplineName: string;
  disciplineCode: string;
  studyStream: string;
  status: string;
  academicPeriod: string;
  currentlyInRoom: number;
  roomId: string;
  termId: string;
  year: number;
}
interface Filters {
  year: string;
  academicPeriod: string;
  status: string;
}
interface SelectOption {
  value: string;
  label: string;
}
interface CustomSelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  id: string; // Добавляем id для label
}

// --- Моковые данные (без изменений) ---
const mockStudyRoomsData: StudyRoomEntry[] = [
  { id: 'sr1', disciplineName: 'Основы научно-исследовательской работы', disciplineCode: 'RM6301', studyStream: 'RM6301-10-L', status: 'Лекции', academicPeriod: '1', currentlyInRoom: 0, roomId: '39982', termId: '1', year: 2024 },
  { id: 'sr2', disciplineName: 'Основы научно-исследовательской работы', disciplineCode: 'RM6301', studyStream: 'RM6301-12-SRSP', status: 'Самостоятельная работа студента и преподавателя', academicPeriod: '1', currentlyInRoom: 0, roomId: '47708', termId: '1', year: 2024 },
  { id: 'sr3', disciplineName: 'Основы научно-исследовательской работы', disciplineCode: 'RM6301', studyStream: 'RM6301-17-P', status: 'Практики, Семинары', academicPeriod: '1', currentlyInRoom: 0, roomId: '41852', termId: '1', year: 2024 },
  { id: 'sr4', disciplineName: 'Программирование на PL/SQL', disciplineCode: 'SFT6303', studyStream: 'SFT6303-27-L', status: 'Лекции', academicPeriod: '1', currentlyInRoom: 0, roomId: '39989', termId: '1', year: 2024 },
  { id: 'sr5', disciplineName: 'Программирование на PL/SQL', disciplineCode: 'SFT6303', studyStream: 'SFT6303-27-SRSP', status: 'Самостоятельная работа студента и преподавателя', academicPeriod: '1', currentlyInRoom: 0, roomId: '47736', termId: '1', year: 2024 },
  { id: 'sr6', disciplineName: 'Программирование на PL/SQL', disciplineCode: 'SFT6303', studyStream: 'SFT6303-30-Lab', status: 'Лабораторные работы', academicPeriod: '1', currentlyInRoom: 0, roomId: '41800', termId: '1', year: 2024 },
  { id: 'sr7', disciplineName: 'Системное программирование', disciplineCode: 'SFT6308', studyStream: 'SFT6308-26-L', status: 'Лекции', academicPeriod: '1', currentlyInRoom: 0, roomId: '39988', termId: '1', year: 2024 },
  { id: 'sr8', disciplineName: 'Технология блокчейн', disciplineCode: 'SFT6319', studyStream: 'SFT6319-3-L', status: 'Лекции', academicPeriod: '2', currentlyInRoom: 0, roomId: '38406', termId: '2', year: 2023 }, // Другой год и период для теста
  { id: 'sr9', disciplineName: 'Введение в искусственный интеллект', disciplineCode: 'SFT6322', studyStream: 'SFT6322-13-Lab', status: 'Лабораторные работы', academicPeriod: '1', currentlyInRoom: 0, roomId: '41883', termId: '1', year: 2024 },
  { id: 'sr10', disciplineName: 'Full Stack разработка', disciplineCode: 'SFT6314', studyStream: 'SFT6314-14--L', status: 'Лекции', academicPeriod: '1', currentlyInRoom: 0, roomId: '41720', termId: '1', year: 2024 },
];
const yearOptions = [ { value: '2022', label: '2022-2023' }, { value: '2023', label: '2023-2024' }, { value: '2024', label: '2024-2025' }, { value: '2025', label: '2025-2026' }, { value: '2026', label: '2026-2027' },];
const academicPeriodOptions = [ { value: '0', label: 'Все' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '-1', label: 'Дополнительный академический период 1' }, { value: '-2', label: 'Дополнительный академический период 2' },];
const statusOptions = [ { value: '0', label: 'Все' }, { value: '103', label: 'Лабораторные работы' }, { value: '101', label: 'Лекции' }, { value: '102', label: 'Практики, Семинары' }, { value: '200', label: 'Преддипломная практика' }, { value: '106', label: 'Производственная практика' }, { value: '107', label: 'Самостоятельная работа студента и преподавателя' }, { value: '109', label: 'Студийные занятия' }, { value: '104', label: 'Учебная практика' },];

// --- Компонент Select ---
const CustomSelect: React.FC<CustomSelectProps> = ({ id, label, options, value, onChange, icon: Icon }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full py-2.5 border border-gray-300 bg-white text-black rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-150 appearance-none ${Icon ? 'pl-10 pr-8' : 'pl-4 pr-8'}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="text-black">{option.label}</option>
          ))}
        </select>
        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

// --- Основной компонент страницы ---
const StudyRoomsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    year: '2024',
    academicPeriod: '1',
    status: '0',
  });

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredRooms = useMemo(() => {
    return mockStudyRoomsData.filter(room => {
      const yearMatch = filters.year === '' || room.year.toString() === filters.year;
      const periodMatch = filters.academicPeriod === '0' || room.academicPeriod === filters.academicPeriod;
      let statusMatch = filters.status === '0';
      if (!statusMatch) {
          const selectedStatusObject = statusOptions.find(opt => opt.value === filters.status);
          if (selectedStatusObject) {
            statusMatch = room.status === selectedStatusObject.label;
          }
      }
      return yearMatch && periodMatch && statusMatch;
    });
  }, [filters]);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-5 sm:p-8 font-sans text-black">
      <div className="max-w-11/12 mx-auto"> {/* Изменено на max-w-full для более широкого использования пространства */}
        {/* Хлебные крошки */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/map" className="hover:text-violet-700 transition-colors flex items-center"><Home size={18} className="mr-2" />Главная</a></li>
            <li><ChevronRight size={18} className="text-gray-400" /></li>
            <li className="font-semibold text-violet-700">Учебная аудитория</li>
          </ol>
        </nav>

        {/* Карточка с фильтрами и таблицей */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden"> {/* Усилена тень и скругление */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h2 className="text-2xl font-bold text-violet-700 mb-3 sm:mb-0 flex items-center">
                    <FilterIcon size={24} className="mr-3 text-violet-600"/>
                    Фильтры Учебной Аудитории
                </h2>
                {/* Можно добавить кнопку "Сбросить фильтры" или "Применить" если нужно */}
            </div>
            <form onSubmit={(e) => e.preventDefault()} name="form">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mt-4">
                <CustomSelect
                  id="year-select"
                  label="Учебный год"
                  options={yearOptions}
                  value={filters.year}
                  onChange={(val) => handleFilterChange('year', val)}
                  icon={Calendar}
                />
                <CustomSelect
                  id="period-select"
                  label="Академический период"
                  options={academicPeriodOptions}
                  value={filters.academicPeriod}
                  onChange={(val) => handleFilterChange('academicPeriod', val)}
                  icon={CheckSquare}
                />
                <CustomSelect
                  id="status-select"
                  label="Статус занятия"
                  options={statusOptions}
                  value={filters.status}
                  onChange={(val) => handleFilterChange('status', val)}
                  icon={Users}
                />
              </div>
            </form>
          </div>

          <div className="pb-4"> {/* Добавлен небольшой отступ снизу для таблицы */}
            {filteredRooms.length === 0 ? (
                <div className="text-center py-16 text-gray-500 flex flex-col items-center">
                    <AlertCircle size={48} className="text-violet-400 mb-4" />
                    <p className="text-lg font-medium">Аудитории не найдены</p>
                    <p className="text-sm">Попробуйте изменить параметры фильтрации.</p>
                </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full"> {/* Убрал divide-y, стилизуем через border-b на tr */}
                <thead className="bg-violet-600 text-white sticky top-0 z-10"> {/* Шапка таблицы фиолетовая и "липкая" */}
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Дисциплина</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Учебный поток</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Статус</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Акад. период</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">В аудитории</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Вход</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredRooms.map((room, index) => (
                    <tr key={room.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-violet-100 transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-black">{room.disciplineName}</div>
                        <div className="text-xs text-gray-600 font-mono">({room.disciplineCode})</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.studyStream}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${room.status === 'Лекции' ? 'bg-blue-100 text-blue-800' :
                            room.status === 'Практики, Семинары' ? 'bg-green-100 text-green-800' :
                            room.status === 'Лабораторные работы' ? 'bg-yellow-100 text-yellow-800' :
                            room.status === 'Самостоятельная работа студента и преподавателя' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{room.academicPeriod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">{room.currentlyInRoom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <a
                          href={`/v7/#/student/study_room/${room.roomId}?term=${room.termId}`}
                          className="inline-flex items-center justify-center p-2.5 rounded-lg text-violet-600 bg-violet-100 hover:bg-violet-200 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-violet-500 transition-all duration-150 group"
                          title="Войти в аудиторию"
                        >
                          <LogIn size={18} className="group-hover:scale-110 transition-transform"/>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
        
         <footer className="text-center mt-16 mb-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Учебное заведение. Все права защищены.</p>
        </footer>
      </div>
    </main>
  );
};

export default StudyRoomsPage;
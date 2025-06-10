// app/schedule/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
// Иконки
import { Home, ChevronRight, Calendar, CheckSquare, CalendarClock, Clock, BookOpen, Users, AlertCircle, Info, ExternalLink, ChevronDown } from 'lucide-react';

// --- Типы данных ---
interface Lesson {
  id: string;
  subject: string;
  type: 'Л' | 'ПЗ' | 'ЛЗ' | 'СРСП' | 'СПЗ' | string; // Лекция, Практика, Лабораторная, СРСП и т.д.
  teacher?: string;
  location?: string; // Аудитория или "онлайн"
  room?: string; // Конкретная аудитория или онлайн-платформа
  link?: string; // Ссылка на онлайн-занятие
  isMooc?: boolean; // Массовый открытый онлайн курс
}

interface TimeSlot {
  time: string; // "08:00 - 08:50"
  lesson: Lesson | null; // null если нет занятия
}

interface DaySchedule {
  dayName: string;
  timeSlots: TimeSlot[];
}

interface Filters {
  year: string;
  academicPeriod: string;
  week: string;
}

interface SemesterInfo {
  start: string;
  end: string;
}

// --- Моковые данные ---
const mockSemesterInfo: SemesterInfo = {
  start: '2024-09-02',
  end: '2024-12-17',
};

// Функция для генерации временных слотов
const generateTimeSlots = (startTime: string = "08:00", endTime: string = "22:20", lessonDuration: number = 50, shortBreak: number = 10, longBreakAfter: number = 4, longBreakDuration: number = 20): string[] => {
    const slots: string[] = [];
    let currentHour = parseInt(startTime.split(':')[0]);
    let currentMinute = parseInt(startTime.split(':')[1]);
    let lessonsInRow = 0;

    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const slotStartHour = currentHour;
        const slotStartMinute = currentMinute;

        currentMinute += lessonDuration;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute %= 60;
        }
        
        const slotEndHour = currentHour;
        const slotEndMinute = currentMinute;

        slots.push(
            `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMinute).padStart(2, '0')} - ${String(slotEndHour).padStart(2, '0')}:${String(slotEndMinute).padStart(2, '0')}`
        );
        
        lessonsInRow++;

        if (currentHour > endHour || (currentHour === endHour && currentMinute >= endMinute)) break;


        if (lessonsInRow % longBreakAfter === 0) {
            currentMinute += longBreakDuration;
        } else {
            currentMinute += shortBreak;
        }
        
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute %= 60;
        }
    }
    return slots;
};

const timeSlotStrings = generateTimeSlots();

const mockScheduleData: DaySchedule[] = [
  {
    dayName: 'Понедельник',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
  {
    dayName: 'Вторник',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
  {
    dayName: 'Среда',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
  {
    dayName: 'Четверг',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
  {
    dayName: 'Пятница',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
  {
    dayName: 'Суббота',
    timeSlots: timeSlotStrings.map(time => ({ time, lesson: null })),
  },
];

// Заполняем моковые данные (только для примера, в реальности это будет приходить с API)
// Понедельник
if (mockScheduleData[0]) {
    mockScheduleData[0].timeSlots[9].lesson = { id: 'mon1', subject: 'Технология блокчейн', type: 'СРСП', teacher: 'Джолдасбаев С.К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[0].timeSlots[10].lesson = { id: 'mon2', subject: 'Full Stack разработка', type: 'Л', teacher: 'Ембердіева А.Б.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[0].timeSlots[11].lesson = { id: 'mon3', subject: 'Full Stack разработка', type: 'Л', teacher: 'Ембердіева А.Б.', location: 'МООК', room: 'МООК', isMooc: true };
}
// Вторник
if (mockScheduleData[1]) {
    mockScheduleData[1].timeSlots[5].lesson = { id: 'tue1', subject: 'Системное программирование', type: 'Л', teacher: 'Meer J.', location: 'онлайн', room: 'онлайн 11', link: '#' };
    mockScheduleData[1].timeSlots[6].lesson = { id: 'tue2', subject: 'Системное программирование', type: 'Л', teacher: 'Meer J.', location: 'онлайн', room: 'online 1', link: '#' };
    mockScheduleData[1].timeSlots[10].lesson = { id: 'tue3', subject: 'Технология блокчейн', type: 'ЛЗ', teacher: 'МООК К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[1].timeSlots[11].lesson = { id: 'tue4', subject: 'Системное программирование', type: 'СРСП', teacher: 'Meer J.', location: 'онлайн', room: 'онлайн 15', link: '#' };
}
// И так далее для других дней и занятий...
// Среда
if (mockScheduleData[2]) {
    mockScheduleData[2].timeSlots[0].lesson = { id: 'wed1', subject: 'Введение в искусственный интеллект', type: 'ЛЗ', teacher: 'Ali A.', location: 'онлайн', room: 'онлайн 13', link: '#' };
    mockScheduleData[2].timeSlots[1].lesson = { id: 'wed2', subject: 'Введение в искусственный интеллект', type: 'ЛЗ', teacher: 'Ali A.', location: 'онлайн', room: 'онлайн 11', link: '#' };
    mockScheduleData[2].timeSlots[9].lesson = { id: 'wed3', subject: 'Full Stack разработка', type: 'СРСП', teacher: 'Ембердіева А.Б.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[2].timeSlots[10].lesson = { id: 'wed4', subject: 'Full Stack разработка', type: 'СПЗ', teacher: 'МООК К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[2].timeSlots[11].lesson = { id: 'wed5', subject: 'Программирование на PL/SQL', type: 'СРСП', teacher: 'Толғанбаева Г.А.', location: 'онлайн', room: 'онлайн 16', link: '#' };
}
// Четверг
if (mockScheduleData[3]) {
    mockScheduleData[3].timeSlots[6].lesson = { id: 'thu1', subject: 'Основы научно-исследовательской работы', type: 'Л', teacher: 'Бектемысова Г.У.', location: 'Главный', room: '901' };
    mockScheduleData[3].timeSlots[7].lesson = { id: 'thu2', subject: 'Основы научно-исследовательской работы', type: 'Л', teacher: 'Бектемысова Г.У.', location: 'Главный', room: '901' };
    mockScheduleData[3].timeSlots[10].lesson = { id: 'thu3', subject: 'Технология блокчейн', type: 'ЛЗ', teacher: 'МООК К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[3].timeSlots[11].lesson = { id: 'thu4', subject: 'Введение в искусственный интеллект', type: 'СРСП', teacher: 'Ali A.', location: 'онлайн', room: 'онлайн 12', link: '#' };
}
// Пятница
if (mockScheduleData[4]) {
    mockScheduleData[4].timeSlots[0].lesson = { id: 'fri1', subject: 'Введение в искусственный интеллект', type: 'Л', teacher: 'Ali A.', location: 'онлайн', room: 'онлайн 14', link: '#' };
    mockScheduleData[4].timeSlots[1].lesson = { id: 'fri2', subject: 'Введение в искусственный интеллект', type: 'Л', teacher: 'Ali A.', location: 'онлайн', room: 'онлайн 15', link: '#' };
    mockScheduleData[4].timeSlots[4].lesson = { id: 'fri3', subject: 'Системное программирование', type: 'ЛЗ', teacher: 'Сарсенбек Қ.', location: 'Главный', room: '606' };
    mockScheduleData[4].timeSlots[5].lesson = { id: 'fri4', subject: 'Программирование на PL/SQL', type: 'ЛЗ', teacher: 'Садуақасова Б.Е.', location: 'Главный', room: '605' };
    mockScheduleData[4].timeSlots[6].lesson = { id: 'fri5', subject: 'Программирование на PL/SQL', type: 'ЛЗ', teacher: 'Садуақасова Б.Е.', location: 'Главный', room: '605' };
    mockScheduleData[4].timeSlots[9].lesson = { id: 'fri6', subject: 'Full Stack разработка', type: 'ЛЗ', teacher: 'МООК К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[4].timeSlots[10].lesson = { id: 'fri7', subject: 'Full Stack разработка', type: 'ЛЗ', teacher: 'МООК К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[4].timeSlots[11].lesson = { id: 'fri8', subject: 'Основы научно-исследовательской работы', type: 'СРСП', teacher: 'Бектемысова Г.У.', location: 'онлайн', room: 'онлайн 16', link: '#' };
}
// Суббота
if (mockScheduleData[5]) {
    mockScheduleData[5].timeSlots[3].lesson = { id: 'sat1', subject: 'Основы научно-исследовательской работы', type: 'СПЗ', teacher: 'Арманқызы Р.', location: 'Главный', room: '601' };
    mockScheduleData[5].timeSlots[4].lesson = { id: 'sat2', subject: 'Программирование на PL/SQL', type: 'Л', teacher: 'Толғанбаева Г.А.', location: 'Главный', room: '901' };
    mockScheduleData[5].timeSlots[5].lesson = { id: 'sat3', subject: 'Программирование на PL/SQL', type: 'Л', teacher: 'Толғанбаева Г.А.', location: 'Главный', room: '901' };
    mockScheduleData[5].timeSlots[10].lesson = { id: 'sat4', subject: 'Технология блокчейн', type: 'Л', teacher: 'Джолдасбаев С.К.', location: 'МООК', room: 'МООК', isMooc: true };
    mockScheduleData[5].timeSlots[11].lesson = { id: 'sat5', subject: 'Технология блокчейн', type: 'Л', teacher: 'Джолдасбаев С.К.', location: 'МООК', room: 'МООК', isMooc: true };
}


// Опции для селектов
const yearOptions = [ { value: '2024', label: '2024-2025' }]; // Пока только один год
const academicPeriodOptions = [ { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '-1', label: 'Дополнительный академический период 1' }];
const weekOptions = Array.from({ length: 15 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));

// --- Компонент Select (из предыдущего примера, если он у вас есть) ---
interface SelectOption { value: string; label: string; }
interface CustomSelectProps { id: string; label: string; options: SelectOption[]; value: string; onChange: (value: string) => void; icon?: React.ElementType; }

const CustomSelect: React.FC<CustomSelectProps> = ({ id, label, options, value, onChange, icon: Icon }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full py-2.5 border border-gray-300 bg-white text-black rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-150 appearance-none ${Icon ? 'pl-10 pr-8' : 'pl-4 pr-8'}`}>
          {options.map(option => (<option key={option.value} value={option.value} className="text-black">{option.label}</option>))}
        </select>
        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

// Компонент для отображения одного занятия
const LessonBlock: React.FC<{ lesson: Lesson | null }> = ({ lesson }) => {
  if (!lesson) {
    return <div className="h-full min-h-[60px] flex items-center justify-center text-gray-300 italic text-xs">Нет занятия</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Л': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'ПЗ': case 'СПЗ': return 'bg-green-100 text-green-700 border-green-300';
      case 'ЛЗ': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'СРСП': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={`p-2.5 rounded-md shadow-sm border text-xs h-full flex flex-col justify-between ${getTypeColor(lesson.type)}`}>
      <div>
        <p className="font-semibold text-sm mb-0.5">{lesson.subject} <span className="font-normal text-xs">({lesson.type})</span></p>
        {lesson.teacher && <p className="text-gray-600 flex items-center"><Users size={12} className="mr-1.5 opacity-70" />{lesson.teacher}</p>}
        {lesson.location && <p className="text-gray-600 flex items-center"><Home size={12} className="mr-1.5 opacity-70" />{lesson.location}{lesson.room && `, ${lesson.room}`}</p>}
      </div>
      {lesson.link && (
        <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="mt-1.5 text-violet-600 hover:text-violet-800 hover:underline font-medium flex items-center text-xs self-start">
          Перейти <ExternalLink size={12} className="ml-1" />
        </a>
      )}
    </div>
  );
};


// --- Основной компонент страницы ---
const SchedulePage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    year: '2024',
    academicPeriod: '1',
    week: '1',
  });
  const [semesterInfo, setSemesterInfo] = useState<SemesterInfo>(mockSemesterInfo);
  // В реальном приложении scheduleData будет загружаться на основе фильтров
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(mockScheduleData);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // TODO: Загрузить новые данные расписания и информацию о семестре на основе фильтров
    // Например: fetchSchedule(newFilters).then(data => setScheduleData(data));
    // fetchSemesterInfo(newFilters).then(info => setSemesterInfo(info));
    console.log(`Filters changed, new state: `, { ...filters, [filterName]: value });
  };
  
  // Фильтрация МООК курсов (если они есть в отдельном списке)
  const moocCourses = useMemo(() => {
      const allLessons = scheduleData.flatMap(day => day.timeSlots.map(slot => slot.lesson).filter(Boolean));
      const uniqueMoocs = new Map<string, { subject: string, teacher?: string }>();
      allLessons.forEach(lesson => {
          if (lesson && lesson.isMooc && !uniqueMoocs.has(lesson.subject)) {
              uniqueMoocs.set(lesson.subject, { subject: lesson.subject, teacher: lesson.teacher });
          }
      });
      return Array.from(uniqueMoocs.values());
  }, [scheduleData]);


  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-5 sm:p-8 font-sans text-black">
      <div className="max-w-full mx-auto">
        {/* Хлебные крошки */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/map" className="hover:text-violet-700 transition-colors flex items-center"><Home size={18} className="mr-2" />Главная</a></li>
            <li><ChevronRight size={18} className="text-gray-400" /></li>
            <li className="font-semibold text-violet-700">Расписание занятий</li>
          </ol>
        </nav>

        {/* Кнопка расписания экзаменов */}
        <div className="mb-6">
          <a href="#/schedule" // Обновите ссылку, если нужно
            className="inline-flex items-center px-6 py-2.5 text-white text-sm font-medium rounded-lg shadow-md hover:bg-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all">
            <CalendarClock size={18} className="mr-2" />
            Расписание экзаменов
          </a>
        </div>

        {/* Фильтры и информация о семестре */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-6">
            <CustomSelect id="year-select" label="Год" options={yearOptions} value={filters.year} onChange={(val) => handleFilterChange('year', val)} icon={Calendar} />
            <CustomSelect id="period-select" label="Академический период" options={academicPeriodOptions} value={filters.academicPeriod} onChange={(val) => handleFilterChange('academicPeriod', val)} icon={CheckSquare} />
            <CustomSelect id="week-select" label="Неделя" options={weekOptions} value={filters.week} onChange={(val) => handleFilterChange('week', val)} icon={CalendarClock} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Начало семестра</label>
              <p className="text-black bg-gray-100 px-3 py-2 rounded-md text-sm">{semesterInfo.start}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Конец семестра</label>
              <p className="text-black bg-gray-100 px-3 py-2 rounded-md text-sm">{semesterInfo.end}</p>
            </div>
          </div>
        </div>

        {/* Сетка расписания */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {scheduleData.map((day) => (
            <div key={day.dayName} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <h3 className="text-lg font-semibold text-violet-700 bg-violet-50 p-4 border-b border-gray-200 flex items-center">
                <Clock size={20} className="mr-2.5 text-violet-600"/>
                {day.dayName}
              </h3>
              <div className="p-1 sm:p-2 divide-y divide-gray-100 max-h-[70vh] overflow-y-auto"> {/* Ограничение высоты и скролл */}
                {day.timeSlots.map((slot) => (
                  <div key={slot.time} className="flex items-stretch"> {/* items-stretch чтобы LessonBlock занимал всю высоту */}
                    <div className="w-1/4 sm:w-1/5 md:w-1/4 lg:w-1/3 xl:w-1/4 px-2.5 py-3 text-xs font-medium text-gray-600 border-r border-gray-100 flex items-center justify-center text-center">
                      {slot.time}
                    </div>
                    <div className="w-3/4 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/4 p-1.5">
                      <LessonBlock lesson={slot.lesson} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Массовые открытые онлайн курсы */}
        {moocCourses.length > 0 && (
            <div className="mt-10 bg-white rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-violet-700 bg-violet-50 p-4 border-b border-gray-200 flex items-center">
                    <Info size={20} className="mr-2.5 text-violet-600"/>
                    Массовые открытые онлайн курсы (MOOК)
                </h3>
                <div className="p-4 overflow-x-auto">
                    {moocCourses.length === 0 ? (
                         <p className="text-sm text-gray-500 italic py-3">Нет зарегистрированных MOOК на эту неделю/семестр.</p>
                    ) : (
                    <table className="min-w-full">
                        <thead className="border-b border-gray-300">
                            <tr>
                                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase">Наименование дисциплины</th>
                                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-700 uppercase">ФИО преподавателя</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moocCourses.map(mooc => (
                                <tr key={mooc.subject} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2.5 px-3 text-sm text-black">{mooc.subject}</td>
                                    <td className="py-2.5 px-3 text-sm text-gray-700">{mooc.teacher || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        )}

         <footer className="text-center mt-16 mb-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Учебное заведение. Все права защищены.</p>
        </footer>
      </div>
    </main>
  );
};

export default SchedulePage;
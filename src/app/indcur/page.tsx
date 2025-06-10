'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Filter, Info, BookOpen, ChevronDown, ChevronUp, ListChecks, UserCheck, Edit, Tag, CalendarDays
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Tutor {
  name: string;
}
interface Discipline {
  id: string;
  number: number;
  type: string;
  code: string;
  name: string;
  credits: number;
  studyLang: string;
  tutors: Tutor[];
  paymentMethod?: string;
  courseWork?: boolean;
}
interface AcademicPeriod {
  id: string;
  name: string;
  disciplines: Discipline[];
  totalCreditsPeriod: number;
}
interface CourseYear {
  id: string;
  name: string;
  periods: AcademicPeriod[];
  totalCreditsYear: number;
}
interface StudentInfo {
  fullName: string;
  academicDegree: string;
  transcriptNumber?: string;
  programGroup: string;
  educationalProgram: string;
  diplomaTopic?: string;
  studyForm: string;
  course: string;
  studyLanguage: string;
  academicYear: string;
}
interface FilterOptions {
  showTutor: boolean;
  showFromTranscript: boolean;
  hideAdditionalTerm: boolean;
  showDisciplineStudyLang: boolean;
  showCourseWork: boolean;
}

// --- Моковые данные ---
const mockStudentInfo: StudentInfo = {
  fullName: 'Жумадуллаев Давлат Илхомұлы',
  academicDegree: 'Бакалавр',
  transcriptNumber: '123456789',
  programGroup: 'Информационные технологии (B057)',
  educationalProgram: 'Программная инженерия (6B06110)',
  diplomaTopic: 'Разработка портала для ВУЗа',
  studyForm: 'Очное 4 года, 4 г.',
  course: '4',
  studyLanguage: 'английский',
  academicYear: '2024 - 2025',
};

const mockCurriculumData: CourseYear[] = [
  {
    id: 'course-2',
    name: '2 Курс обучения 2022-2023 учебный год',
    totalCreditsYear: 60,
    periods: [
      {
        id: 'period-3',
        name: '3 Академический период',
        totalCreditsPeriod: 27,
        disciplines: [
          { id: 'd1', number: 1, type: 'ОК', code: 'PhC6003', name: 'Физическая культура', credits: 2, studyLang: 'По выбору', tutors: [{ name: 'Серикжанов Акжол Серикжанович' }], paymentMethod: '' },
          { id: 'd2', number: 2, type: 'ВК', code: 'SFT6301', name: 'Алгоритмизация и программирование', credits: 4, studyLang: 'По выбору', tutors: [{ name: 'Тоқанов Олжас Сержанұлы' }, { name: 'Джолдасбаев Серик Капарович' }], paymentMethod: '' },
          { id: 'd3', number: 3, type: 'ВК', code: 'MAT6005', name: 'Дискретная математика', credits: 4, studyLang: 'По выбору', tutors: [{ name: 'Айтжанов Серик Ерсултанович' }, { name: 'Момынқулов Зейнель Зейнуллаұлы' }], paymentMethod: '' },
          { id: 'd4', number: 4, type: 'ВК', code: 'LAN6003PA', name: 'Профессионально-ориентированный иностранный язык', credits: 3, studyLang: 'По выбору', tutors: [{ name: 'Vasquez Marco Angelo' }], paymentMethod: '' },
          { id: 'd5', number: 5, type: 'КВ', code: '===PnYaP 2217', name: 'Программирование на языке Python', credits: 4, studyLang: 'По выбору', tutors: [{ name: 'Толғанбаева Гауһартас Алғабасқызы' }], paymentMethod: '', courseWork: true },
        ],
      },
      {
        id: 'period-4',
        name: '4 Академический период',
        totalCreditsPeriod: 33,
        disciplines: [
          { id: 'd8', number: 8, type: 'ОК', code: 'SPS6001', name: 'Философия', credits: 5, studyLang: 'По выбору', tutors: [{ name: 'Тулегенов Спартак Владимирович' }], paymentMethod: '' },
          { id: 'd11', number: 11, type: 'ВК', code: 'SFT6002', name: 'Объектно-ориентированное программирование', credits: 6, studyLang: 'Казахский', tutors: [{ name: 'Тоқанов Олжас Сержанұлы' }, {name: 'Балғабек Асқар Айдарұлы'}], paymentMethod: '' },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    name: '3 Курс обучения 2023-2024 учебный год',
    totalCreditsYear: 60,
    periods: [
        {
            id: 'period-5',
            name: '5 Академический период',
            totalCreditsPeriod: 24,
            disciplines: [
                { id: 'd16', number: 16, type: 'ОК', code: 'SPS6005', name: 'Психология', credits: 2, studyLang: 'Русский', tutors: [{ name: 'Ельбаева Зарина Уразбаевна' }, { name: 'Гумерова Альфия Анваровна' }], paymentMethod: '' },
                { id: 'd20', number: 20, type: 'ВК', code: 'SFT6307', name: 'Web-технологии', credits: 6, studyLang: 'Английский', tutors: [{ name: 'Муханов Самат Бакытжанович' }, { name: 'Махметова Қуралай Бақытқызы' }], paymentMethod: '', courseWork: true },
            ]
        }
    ]
  }
];

// Статические объекты для производительности
const FILTER_LABELS: Record<keyof FilterOptions, string> = {
  showTutor: 'Преподаватель',
  showFromTranscript: 'Отображать все дисциплины из транскрипта (неактивно)',
  hideAdditionalTerm: 'Скрывать дополнительный академический период (неактивно)',
  showDisciplineStudyLang: 'Язык изучения дисциплины',
  showCourseWork: 'Курсовая работа',
};

const FILTER_ICONS: Record<keyof FilterOptions, React.ElementType> = {
  showTutor: UserCheck,
  showFromTranscript: ListChecks,
  hideAdditionalTerm: CalendarDays,
  showDisciplineStudyLang: Edit,
  showCourseWork: BookOpen,
};

const STUDENT_INFO_ITEMS = [
  { label: "Обучающийся", value: mockStudentInfo.fullName, description: "Фамилия Имя Отчество" },
  { label: "Академическая степень", value: mockStudentInfo.academicDegree },
  { label: "Номер транскрипта", value: mockStudentInfo.transcriptNumber },
  { label: "Группа образовательных программ", value: mockStudentInfo.programGroup, description: "Наименование группы образовательной программы (шифр)" },
  { label: "Образовательная программа", value: mockStudentInfo.educationalProgram, description: "Наименование образовательной программы" },
  { label: "Тема дипломной работы", value: mockStudentInfo.diplomaTopic || "Не указана" },
  { label: "Форма обучения", value: mockStudentInfo.studyForm, description: "Наименование, количество лет обучения" },
  { label: "Курс", value: mockStudentInfo.course },
  { label: "Язык обучения", value: mockStudentInfo.studyLanguage },
  { label: "Учебный год", value: mockStudentInfo.academicYear },
];

const IndCurPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showTutor: true,
    showFromTranscript: false,
    hideAdditionalTerm: true,
    showDisciplineStudyLang: true,
    showCourseWork: false,
  });
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  // Мемоизированная инициализация состояний расширения
  const initialExpandedState = useMemo(() => {
    const initialCourses: Record<string, boolean> = {};
    const initialPeriods: Record<string, boolean> = {};
    mockCurriculumData.forEach(course => {
      initialCourses[course.id] = true;
      course.periods.forEach(period => {
        initialPeriods[period.id] = true;
      });
    });
    return { initialCourses, initialPeriods };
  }, []);

  useEffect(() => {
    setExpandedCourses(initialExpandedState.initialCourses);
    setExpandedPeriods(initialExpandedState.initialPeriods);
  }, [initialExpandedState]);

  // Мемоизированные callback функции
  const handleFilterChange = useCallback((option: keyof FilterOptions) => {
    setFilterOptions(prev => ({ ...prev, [option]: !prev[option] }));
  }, []);

  const toggleCourse = useCallback((courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  }, []);

  const togglePeriod = useCallback((periodId: string) => {
    setExpandedPeriods(prev => ({ ...prev, [periodId]: !prev[periodId] }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Оптимизированная фильтрация данных
  const filteredData = useMemo(() => {
    if (!searchTerm && !filterOptions.showCourseWork) {
      return mockCurriculumData;
    }

    const searchTermLower = searchTerm.toLowerCase();
    
    return mockCurriculumData.map(course => ({
      ...course,
      periods: course.periods.map(period => ({
        ...period,
        disciplines: period.disciplines.filter(discipline => {
          let searchCondition = true;
          if (searchTerm) {
            const nameMatch = discipline.name.toLowerCase().includes(searchTermLower);
            const codeMatch = discipline.code.toLowerCase().includes(searchTermLower);
            const tutorMatch = filterOptions.showTutor && discipline.tutors.some(tutor => 
              tutor.name.toLowerCase().includes(searchTermLower)
            );
            searchCondition = nameMatch || codeMatch || tutorMatch;
          }
          
          const courseWorkCondition = filterOptions.showCourseWork ? !!discipline.courseWork : true;
          return searchCondition && courseWorkCondition;
        }),
      })).filter(period => period.disciplines.length > 0),
    })).filter(course => course.periods.length > 0);
  }, [searchTerm, filterOptions.showTutor, filterOptions.showCourseWork]);

  const totalCredits = useMemo(() => {
    return mockCurriculumData.reduce((sum, course) => 
      sum + course.periods.reduce((pSum, period) => pSum + period.totalCreditsPeriod, 0), 
      0
    );
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[70px] lg:ml-[76px]">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">

            {/* Параметры и Поиск */}
            <div className="mb-8 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
              <h2 className="text-2xl font-semibold text-violet-600 mb-6 flex items-center">
                <Filter size={24} className="mr-3" />Параметры и Поиск
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Чекбоксы */}
                <div className="space-y-3">
                  {(Object.keys(filterOptions) as Array<keyof FilterOptions>).map((optionKey) => {
                    const Icon = FILTER_ICONS[optionKey];
                    return (
                      <div key={optionKey} className="flex items-center">
                        <input
                          type="checkbox"
                          id={optionKey}
                          name={optionKey}
                          checked={filterOptions[optionKey]}
                          onChange={() => handleFilterChange(optionKey)}
                          className="h-5 w-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500 cursor-pointer"
                          disabled={optionKey === 'showFromTranscript' || optionKey === 'hideAdditionalTerm'}
                        />
                        <label htmlFor={optionKey} className={`ml-3 text-sm font-medium text-black flex items-center ${ (optionKey === 'showFromTranscript' || optionKey === 'hideAdditionalTerm') ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <Icon className="mr-2 h-5 w-5 text-violet-500" />
                          {FILTER_LABELS[optionKey]}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {/* Поиск */}
                <div className="relative">
                  <label htmlFor="search-discipline" className="block text-sm font-medium text-black mb-1">Поиск по плану</label>
                  <input
                    type="text"
                    id="search-discipline"
                    placeholder="Название, код, преподаватель..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                  <Search size={20} className="absolute left-3 top-10 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Информация об обучающемся */}
            <div className="mb-8 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
              <h2 className="text-2xl font-semibold text-violet-600 mb-6 flex items-center">
                <Info size={24} className="mr-3" />Информация об обучающемся
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {STUDENT_INFO_ITEMS.map(item => (
                  <div key={item.label} className="text-sm">
                    <span className="font-medium text-gray-600">{item.label}: </span>
                    <span className="text-black underline decoration-dotted decoration-gray-400 hover:decoration-solid">{item.value}</span>
                    {item.description && <div className="text-xs text-gray-500 italic mt-0.5">{item.description}</div>}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Таблица учебного плана */}
            <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
              <h2 className="text-2xl font-semibold text-violet-600 p-6 border-b border-gray-200 flex items-center">
                <BookOpen size={24} className="mr-3" />Учебный план
              </h2>
              {filteredData.length === 0 && (
                <p className="p-6 text-center text-gray-500">По вашему запросу ничего не найдено или все дисциплины скрыты фильтрами.</p>
              )}
              {filteredData.map(course => (
                <div key={course.id} className="border-b border-gray-200 last:border-b-0">
                  <div 
                    className="bg-violet-50 p-4 cursor-pointer hover:bg-violet-100 transition-colors flex justify-between items-center"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <h3 className="text-lg font-semibold text-violet-700">{course.name}</h3>
                    {expandedCourses[course.id] ? <ChevronUp size={20} className="text-violet-700"/> : <ChevronDown size={20} className="text-violet-700"/>}
                  </div>
                  {expandedCourses[course.id] && (
                    <div className="divide-y divide-gray-200">
                      {course.periods.map(period => (
                        <div key={period.id}>
                           <div 
                            className="bg-gray-50 p-3 pl-8 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                            onClick={() => togglePeriod(period.id)}
                          >
                            <h4 className="text-md font-medium text-gray-700">{period.name}</h4>
                             {expandedPeriods[period.id] ? <ChevronUp size={18} className="text-gray-600"/> : <ChevronDown size={18} className="text-gray-600"/>}
                          </div>
                          {expandedPeriods[period.id] && period.disciplines.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[5%]">№</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Тип</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Код</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">Название</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Кредиты</th>
                                    {filterOptions.showDisciplineStudyLang && <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Язык</th>}
                                    {filterOptions.showTutor && <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">Преподаватель</th>}
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {period.disciplines.map((discipline) => (
                                    <tr key={discipline.id} className="hover:bg-violet-50 transition-colors">
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center">{discipline.number}</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{discipline.type}</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-mono">{discipline.code}</td>
                                      <td className="px-4 py-3 text-sm text-black font-medium">{discipline.name}{discipline.courseWork && <span title='Курсовая работа'><Tag className="inline-block ml-2 h-4 w-4 text-violet-500"/></span>}</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-center font-semibold">{discipline.credits}</td>
                                      {filterOptions.showDisciplineStudyLang && <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{discipline.studyLang}</td>}
                                      {filterOptions.showTutor && (
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                          {discipline.tutors.map((tutor, i) => <div key={i} className="truncate max-w-[200px]">{tutor.name}</div>)}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50 font-semibold">
                                    <td colSpan={filterOptions.showDisciplineStudyLang && filterOptions.showTutor ? 4 : (filterOptions.showDisciplineStudyLang || filterOptions.showTutor ? 3 : 2)} className="px-4 py-2.5 text-right text-sm text-gray-700">Общее количество кредитов за период:</td>
                                    <td className="px-4 py-2.5 text-center text-sm text-violet-700">{period.totalCreditsPeriod}</td>
                                    {filterOptions.showDisciplineStudyLang && <td className="px-4 py-2.5"></td>}
                                    {filterOptions.showTutor && <td className="px-4 py-2.5"></td>}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          {expandedPeriods[period.id] && period.disciplines.length === 0 && (
                             <p className="p-4 text-sm text-center text-gray-500">Нет дисциплин, соответствующих текущим фильтрам, в этом периоде.</p>
                          )}
                        </div>
                      ))}
                       <div className="bg-violet-100 p-3 text-right font-bold text-violet-700">
                        Общее количество кредитов за курс: {course.totalCreditsYear}
                      </div>
                    </div>
                  )}
                </div>
              ))}
               <div className="p-6 border-t border-gray-300 text-right">
                  <span className="text-md font-bold text-black">Общее количество кредитов теоретического и практического обучения: </span>
                  <span className="text-lg font-bold text-violet-600">
                    {totalCredits}
                  </span>
                </div>
            </div>

             {/* Подписи */}
            <div className="mt-10 mb-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200 text-sm">
                <h3 className="text-xl font-semibold text-violet-600 mb-6">Подписи</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                        <p className="font-medium text-black">Регистратор:</p>
                        <p className="mt-2 text-gray-700">_______________________</p>
                        <p className="mt-1 text-gray-500 text-xs">Подпись</p>
                        <p className="mt-2 text-gray-700">_______________ 20__ г.</p>
                         <p className="mt-1 text-gray-500 text-xs">Дата</p>
                    </div>
                    <div>
                        <p className="font-medium text-black">Эдвайзер: <span className="font-normal">Дауренбаева Нуркамиля Алдангаровна</span></p>
                         <p className="mt-2 text-gray-700">_______________________</p>
                        <p className="mt-1 text-gray-500 text-xs">Подпись</p>
                        <p className="mt-2 text-gray-700">_______________ 20__ г.</p>
                         <p className="mt-1 text-gray-500 text-xs">Дата</p>
                    </div>
                    <div>
                        <p className="font-medium text-black">Обучающийся: <span className="font-normal">{mockStudentInfo.fullName}</span></p>
                         <p className="mt-2 text-gray-700">_______________________</p>
                        <p className="mt-1 text-gray-500 text-xs">Подпись</p>
                        <p className="mt-2 text-gray-700">_______________ 20__ г.</p>
                         <p className="mt-1 text-gray-500 text-xs">Дата</p>
                    </div>
                </div>
            </div>

            <footer className="text-center mt-12 py-6 border-t border-gray-300">
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} Учебное заведение. Все права защищены.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(IndCurPage); 
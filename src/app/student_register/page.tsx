// app/grades/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
// Иконки
import {
  Home, ChevronRight, Calendar, CheckSquare, Users, BookOpen, AlertCircle, TrendingUp, Star, HelpCircle, Eye, Info,
  Award, Target, Edit3, ClipboardCheck, Maximize2, X, GraduationCap, ChevronDown
} from 'lucide-react';

// --- Типы данных ---
interface GradeDetail {
  id: string;
  name: string; // Ср.тек. 1, РК 1, Экз.
  shortName?: string; // РК1, ЭКЗ
  mark: number | string; // Оценка или "N/A"
  maxMark?: number; // Максимально возможная оценка для этого типа
  icon?: React.ElementType; // Иконка для типа оценки
}

interface SubjectGrade {
  id: string;
  subjectName: string;
  subjectCode?: string;
  streamInfo?: string; // (Лекция, группа FIT-201)
  teachers: string[];
  overallPercentage: number;
  finalGradeLetter?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F' | 'P' | 'I'; // Буквенная оценка
  credits?: number;
  grades: GradeDetail[];
  queryID?: number;
  absencePercentageInfo?: string;
}

interface Filters {
  year: string;
  academicPeriod: string;
}

interface ModalContent {
  subject: SubjectGrade;
  detailedMarks?: GradeDetail[]; // Предположим, что тут будут все-все оценки
}

// --- Моковые данные ---
const mockGradesData: SubjectGrade[] = [
  {
    id: 'subj1',
    subjectName: 'Основы научно-исследовательской работы и академического письма в условиях цифровизации',
    subjectCode: 'RM6301-EXTRALONGCODEFORTESTINGOVERFLOW',
    streamInfo: 'Лекция, Поток 1 для студентов бакалавриата и магистратуры, а также аспирантов',
    teachers: ['Арманқызы Р.', 'Бектемысова Г.У', 'Оченьдлинноеимя Фамилия Отчествовна'],
    overallPercentage: 97.0,
    finalGradeLetter: 'A',
    credits: 3,
    grades: [
      { id: 'g1-3', name: 'Рубежный контроль 1: Основы и принципы исследовательской деятельности', shortName: 'РК1', mark: 96.00, maxMark: 100, icon: Target },
      { id: 'g1-4', name: 'Рубежный контроль 2: Продвинутые техники и анализ данных', shortName: 'РК2', mark: 97.00, maxMark: 100, icon: Target },
      { id: 'g1-5', name: 'Рейтинговая оценка по всем модулям курса', shortName: 'Рейтинг', mark: 97.00, maxMark: 100, icon: TrendingUp },
      { id: 'g1-6', name: 'Итоговый Экзамен по всему курсу с защитой проекта', shortName: 'Экз.', mark: 97.00, maxMark: 100, icon: Award },
    ],
    queryID: 3158,
    absencePercentageInfo: "Пропущено 2 занятия из 30 (6.67%).\n1 пропуск по уважительной причине (медицинская справка).\n1 пропуск без уважительной причины."
  },
  {
    id: 'subj2',
    subjectName: 'Введение в искусственный интеллект и машинное обучение',
    subjectCode: 'SFT6322',
    teachers: ['Ali A.'],
    overallPercentage: 93.0,
    finalGradeLetter: 'A',
    credits: 4,
    grades: [
      { id: 'g2-3', name: 'Рубежный контроль 1', shortName: 'РК1', mark: 95.00, maxMark: 100, icon: Target },
      { id: 'g2-4', name: 'Рубежный контроль 2', shortName: 'РК2', mark: 88.00, maxMark: 100, icon: Target },
      { id: 'g2-5', name: 'Рейтинговая оценка', shortName: 'Рейтинг', mark: 92.00, maxMark: 100, icon: TrendingUp },
      { id: 'g2-6', name: 'Экзамен', shortName: 'Экз.', mark: 95.00, maxMark: 100, icon: Award },
    ],
    queryID: 4878,
  },
  {
    id: 'subj3',
    subjectName: 'Системное программирование и операционные системы',
    subjectCode: 'SFT6308',
    teachers: ['Meer J.', 'Сарсенбек Қ.'],
    overallPercentage: 72.5,
    finalGradeLetter: 'B',
    credits: 3,
    grades: [
      { id: 'g3-3', name: 'Рубежный контроль 1', shortName: 'РК1', mark: 70, maxMark: 100, icon: Target },
      { id: 'g3-4', name: 'Рубежный контроль 2', shortName: 'РК2', mark: 65, maxMark: 100, icon: Target },
      { id: 'g3-5', name: 'Рейтинговая оценка', shortName: 'Рейтинг', mark: 72, maxMark: 100, icon: TrendingUp },
      { id: 'g3-6', name: 'Экзамен', shortName: 'Экз.', mark: 80, maxMark: 100, icon: Award },
    ],
    queryID: 2106,
  },
   {
    id: 'subj4',
    subjectName: 'Технология блокчейн и криптовалюты: основы и применение в современных финансовых системах',
    subjectCode: 'SFT6319VERYLONGCODEINDEED',
    teachers: ['Джолдасбаев С.К', 'МООК К.'],
    overallPercentage: 45.0,
    finalGradeLetter: 'F',
    credits: 3,
    grades: [
      { id: 'g4-3', name: 'Рубежный контроль 1', shortName: 'РК1', mark: 45, maxMark: 100, icon: Target },
      { id: 'g4-4', name: 'Рубежный контроль 2', shortName: 'РК2', mark: 35, maxMark: 100, icon: Target },
      { id: 'g4-5', name: 'Рейтинговая оценка', shortName: 'Рейтинг', mark: 45, maxMark: 100, icon: TrendingUp },
      { id: 'g4-6', name: 'Экзамен', shortName: 'Экз.', mark: "Н/Я", maxMark: 100, icon: Award },
    ],
    queryID: 4866,
    absencePercentageInfo: "Очень длинная строка информации о пропусках без пробелов fdsafsdfdsfsdffsdfsdfsdfsdfsdfsdfsdfsdsadasdas"
  },
];

// Опции для селектов
const yearOptions = [ { value: '2022', label: '2022' }, { value: '2023', label: '2023' }, { value: '2024', label: '2024' }];
const academicPeriodOptions = [ { value: '1', label: '1 семестр' }, { value: '2', label: '2 семестр' }, { value: '-1', label: 'Доп. семестр 1' }];

const getProgressBarColor = (percentage: number) => {
  if (percentage >= 90) return 'from-green-500 to-emerald-500';
  if (percentage >= 75) return 'from-sky-500 to-cyan-500';
  if (percentage >= 60) return 'from-yellow-500 to-amber-500';
  if (percentage >= 50) return 'from-orange-500 to-red-500';
  return 'from-red-600 to-rose-600';
};

const getGradeTextColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 75) return 'text-sky-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 50) return 'text-orange-600';
  return 'text-red-700';
};

const getGradePillColor = (mark: number | string, maxMark?: number) => {
  if (typeof mark !== 'number' || !maxMark || maxMark === 0) return 'bg-gray-200 text-gray-700 border border-gray-300';
  const percent = (mark / maxMark) * 100;
  if (percent >= 90) return 'text-green-700 border border-green-300';
  if (percent >= 75) return '  text-sky-700 border border-sky-300';
  if (percent >= 60) return '  text-yellow-700 border border-yellow-300';
  if (percent >= 50) return '  text-orange-700 border border-orange-300';
  return ' text-red-700 border border-red-300';
};

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

// Компонент для карточки предмета
const SubjectCard: React.FC<{ subject: SubjectGrade; onOpenModal: (subject: SubjectGrade) => void }> = ({ subject, onOpenModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col group min-h-[450px]">
      <div className={`p-5 bg-gradient-to-r ${getProgressBarColor(subject.overallPercentage)} text-white flex flex-col justify-between min-h-[140px]`}>
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-xl font-bold truncate" title={subject.subjectName}>{subject.subjectName}</h3>
                {subject.subjectCode && <p className="text-xs opacity-80 font-mono truncate" title={`${subject.subjectCode} ${subject.streamInfo || ''}`}>{subject.subjectCode} {subject.streamInfo && `- ${subject.streamInfo}`}</p>}
            </div>
            {subject.finalGradeLetter && (
                <div className={`shrink-0 text-3xl text-white font-black opacity-80 ${getGradeTextColor(subject.overallPercentage).replace('text-','bg-').replace('-600', '-100 px-2.5 py-1 rounded-md text-2xl')}`}>
                    {subject.finalGradeLetter}
                </div>
            )}
        </div>
        <div className="mt-2 text-xs opacity-90 flex items-center truncate" title={subject.teachers.join(', ')}>
            <Users size={14} className="mr-1.5 shrink-0" />
            <span className="truncate">{subject.teachers.join(', ')}</span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-700">Общий прогресс:</span>
            <span className={`text-2xl font-bold ${getGradeTextColor(subject.overallPercentage)}`}>
              {subject.overallPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${getProgressBarColor(subject.overallPercentage)} transition-all duration-500 ease-out`}
              style={{ width: `${subject.overallPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <p className="text-sm font-medium text-gray-600 mb-2">Ключевые оценки:</p>
          {subject.grades.slice(0, 4).map(grade => (
            <div key={grade.id} className="flex justify-between items-center text-sm p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-violet-200 transition-colors">
              <div className="flex items-center text-gray-700 flex-1 min-w-0 mr-2">
                {grade.icon && <grade.icon size={16} className="mr-2 text-violet-500 shrink-0" />}
                <span className="truncate" title={grade.name}>{grade.shortName || grade.name}</span>
              </div>
              <span className={`shrink-0 font-semibold px-2 py-0.5 rounded-md text-xs whitespace-nowrap ${getGradePillColor(grade.mark, grade.maxMark)}`}>
                {typeof grade.mark === 'number' ? `${grade.mark.toFixed(0)}/${grade.maxMark || 100}` : grade.mark}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
        <button
          onClick={() => onOpenModal(subject)}
          className="w-full py-2.5 px-4 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition-all flex items-center justify-center group-hover:scale-105 transform"
        >
          <Maximize2 size={16} className="mr-2" /> Детализация
        </button>
      </div>
    </div>
  );
};


// --- Основной компонент страницы ---
const GradesPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({ year: '2024', academicPeriod: '1' });
  const [gradesData, setGradesData] = useState<SubjectGrade[]>(mockGradesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    // TODO: Загрузить новые данные оценок на основе фильтров
    // console.log(`Filters changed, new state: `, { ...filters, [filterName]: value });
    // setGradesData(fetchGrades(newFilters)); // Пример
  };

  const openModal = (subject: SubjectGrade) => {
    // В реальном приложении здесь можно загрузить ВСЕ оценки для предмета
    const allDetailedMarks: GradeDetail[] = [ // Пример
        ...subject.grades, // Уже есть основные
        { id: 'extra1', name: 'Домашнее задание 1 по теме "Введение в цифровые технологии и анализ больших данных"', shortName: 'ДЗ1', mark: 90, maxMark: 100, icon: Edit3},
        { id: 'extra2', name: 'Текущий контроль 1: Проверка усвоения материала лекций 1-5 и практических занятий', shortName: 'ТК1', mark: 'N/A', icon: ClipboardCheck},
        { id: 'extra3', name: 'Финальный Проектная работа по курсу с презентацией результатов и ответами на вопросы комиссии', shortName: 'Проект', mark: 95, maxMark: 100, icon: BookOpen},
    ];
    setModalContent({ subject, detailedMarks: allDetailedMarks });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Фильтруем данные на клиенте (для мока)
  const filteredGrades = useMemo(() => {
      // Здесь можно добавить логику фильтрации по filters.year и filters.academicPeriod, если бы в mockGradesData были эти поля
      return gradesData;
  }, [filters, gradesData]);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-100 to-slate-200 p-5 sm:p-8 font-sans text-black">
      <div className="max-w-full mx-auto">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-violet-700 transition-colors flex items-center"><Home size={18} className="mr-2" />ГЛАВНАЯ</a></li>
            <li><ChevronRight size={18} className="text-gray-400" /></li>
            <li className="font-semibold text-violet-700">Журнал успеваемости</li>
          </ol>
        </nav>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-200/50 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                <h2 className="text-3xl font-extrabold text-violet-700 mb-4 sm:mb-0 flex items-center">
                    <GraduationCap size={30} className="mr-3 text-violet-600"/>
                    Мои Оценки
                </h2>
                <button type="button" disabled title="Инструкции пользователя (пока неактивно)" className="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg flex items-center cursor-not-allowed opacity-70">
                    <HelpCircle size={16} className="mr-2"/> Инструкции
                </button>
            </div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <CustomSelect id="year-select" label="Учебный год" options={yearOptions} value={filters.year} onChange={(val) => handleFilterChange('year', val)} icon={Calendar} />
              <CustomSelect id="period-select" label="Академический период" options={academicPeriodOptions} value={filters.academicPeriod} onChange={(val) => handleFilterChange('academicPeriod', val)} icon={CheckSquare} />
            </div>
          </form>
        </div>

        {filteredGrades.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
                <AlertCircle size={48} className="text-violet-400 mb-4" />
                <p className="text-lg font-medium text-black">Оценки не найдены</p>
                <p className="text-sm">Попробуйте изменить параметры фильтрации.</p>
            </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredGrades.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onOpenModal={openModal} />
          ))}
        </div>
        )}

        {isModalOpen && modalContent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-2xl font-bold text-violet-700 break-words">{modalContent.subject.subjectName}</h4>
                    <p className="text-sm text-gray-500 font-mono break-all">{modalContent.subject.subjectCode} {modalContent.subject.streamInfo && `- ${modalContent.subject.streamInfo}`}</p>
                    <p className="text-sm text-gray-600 mt-1 flex items-start">
                        <Users size={16} className="inline mr-1.5 mt-0.5 shrink-0"/> 
                        <span className="break-words">{modalContent.subject.teachers.join(', ')}</span>
                    </p>
                  </div>
                  <button onClick={closeModal} className="shrink-0 text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                <h5 className="text-lg font-semibold text-black mb-3">Детализация оценок:</h5>
                <div className="space-y-2">
                    {modalContent.detailedMarks?.map(grade => (
                         <div key={grade.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-violet-300 transition-colors">
                            <div className="flex items-center text-gray-800 flex-1 min-w-0 mr-2">
                                {grade.icon && <grade.icon size={18} className="mr-3 text-violet-600 shrink-0" />}
                                <span className="truncate" title={grade.name}>{grade.name}</span>
                            </div>
                            <span className={`shrink-0 font-bold px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${getGradePillColor(grade.mark, grade.maxMark)}`}>
                                {typeof grade.mark === 'number' ? `${grade.mark.toFixed(0)} / ${grade.maxMark || 100}` : grade.mark}
                            </span>
                        </div>
                    ))}
                    {!modalContent.detailedMarks?.length && <p className="text-gray-500 italic">Подробная информация об оценках отсутствует.</p>}
                </div>

                {modalContent.subject.absencePercentageInfo && (
                    <>
                        <h5 className="text-lg font-semibold text-black mt-6 mb-3">Информация о пропусках:</h5>
                        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap break-words">
                            {modalContent.subject.absencePercentageInfo}
                        </div>
                    </>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                <button onClick={closeModal} className="px-6 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 transition-colors">
                    Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
         <footer className="text-center mt-16 mb-8 py-6 border-t border-gray-300/50">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Учебное заведение. Все права защищены.</p>
        </footer>
      </div>
    </main>
  );
};

export default GradesPage;
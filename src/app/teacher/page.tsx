'use client';

import React, { useState } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { useDisciplines } from '@/hooks/useDisciplines';
import { useEducationalPrograms } from '@/hooks/useEducationalPrograms';
import AssignmentsService from '@/service/AssignmentsSettings';
import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Home, ChevronRight, ListChecks, Clock, CheckCircle, AlertTriangle, AlertCircle,
  Download, Eye, Trash2, X, User, CalendarDays, Star, BookOpen, GraduationCap
} from 'lucide-react';
import type { AssignmentFilter } from '@/types';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import GroupsExample from '../components/GroupsExample';

// Фильтры для UI
const filterOptions: { label: string; value: AssignmentFilter, icon: React.ElementType }[] = [
  { label: 'Предстоящие', value: 'upcoming', icon: Clock },
  { label: 'Просроченные', value: 'late', icon: AlertTriangle },
  { label: 'Выполненные', value: 'completed', icon: CheckCircle },
  { label: 'Все задания', value: 'all', icon: ListChecks },
];

export default function TeacherPage() {
  const { 
    assignments, 
    loading: assignmentsLoading, 
    error: assignmentsError, 
    currentFilter, 
    changeFilter,
    deleteAssignment 
  } = useAssignments(2, 3);

  const {
    disciplines,
    loading: disciplinesLoading,
    error: disciplinesError,
    deleteDiscipline
  } = useDisciplines();

  const {
    programs,
    loading: programsLoading,
    error: programsError,
    deleteProgram
  } = useEducationalPrograms();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingDiscipline, setIsDeletingDiscipline] = useState(false);
  const [isDeletingProgram, setIsDeletingProgram] = useState(false);

  const handleDelete = async (assignmentId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это задание?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAssignment(assignmentId);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Ошибка при удалении задания');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDiscipline = async (disciplineId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту дисциплину?')) {
      return;
    }

    setIsDeletingDiscipline(true);
    try {
      await deleteDiscipline(disciplineId);
    } catch (error) {
      console.error('Error deleting discipline:', error);
      alert('Ошибка при удалении дисциплины');
    } finally {
      setIsDeletingDiscipline(false);
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту образовательную программу?')) {
      return;
    }

    setIsDeletingProgram(true);
    try {
      await deleteProgram(programId);
    } catch (error) {
      console.error('Error deleting educational program:', error);
      alert('Ошибка при удалении образовательной программы');
    } finally {
      setIsDeletingProgram(false);
    }
  };

  const handleFilterChange = (newFilter: AssignmentFilter) => {
    changeFilter(newFilter);
  };

  if (assignmentsError) {
    return <div className="p-8 text-center text-red-600">Ошибка: {assignmentsError}</div>;
  }

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
    { id: 5, title: 'Алгоритмы и структуры данных', code: 'CS-202' },
    { id: 6, title: 'Информационная безопасность', code: 'IS-305' },
    { id: 7, title: 'Веб-технологии', code: 'WT-210' },
    { id: 8, title: 'Управление проектами', code: 'PM-330' },
  ];

  return (
    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
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
                {courses.map(({ id, title, code }) => (
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

            {/* DISCIPLINES */}
            <div className="bg-white rounded-3xl shadow-soft p-6 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                  <span className="material-icons-round text-secondary">school</span>
                  Дисциплины
                </h2>
                <Link
                  href="/teacher/disciplines/new"
                  className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <span className="material-icons-round text-base">add</span>
                  Добавить дисциплину
                </Link>
              </div>

              {disciplinesLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                  <p className="ml-4 text-gray-600">Загрузка дисциплин...</p>
                </div>
              )}

              {disciplinesError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md mb-6" role="alert">
                  <div className="flex items-center">
                    <AlertCircle size={24} className="mr-3" />
                    <div>
                      <p className="font-bold">Ошибка загрузки</p>
                      <p className="text-sm">{disciplinesError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {disciplines.map((discipline) => (
                  <Card
                    key={discipline.discipline_id}
                    className="p-5 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{discipline.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{discipline.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {discipline.lectures > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            <CalendarDays size={12} />
                            {discipline.lectures} лекций
                          </span>
                        )}
                        {discipline.practices > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            <ListChecks size={12} />
                            {discipline.practices} практик
                          </span>
                        )}
                        {discipline.labs > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            <Star size={12} />
                            {discipline.labs} лаб. работ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/teacher/disciplines/${discipline.discipline_id}/students`}
                        className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        Студенты
                        <User size={16} />
                      </Link>
                      <Link
                        href={`/teacher/disciplines/${discipline.discipline_id}/assignments`}
                        className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        Задания
                        <ListChecks size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteDiscipline(discipline.discipline_id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                        disabled={isDeletingDiscipline}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {!disciplinesLoading && !disciplinesError && disciplines.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Нет доступных дисциплин</p>
                </div>
              )}
            </div>

            {/* EDUCATIONAL PROGRAMS */}
            <div className="bg-white rounded-3xl shadow-soft p-6 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                  <span className="material-icons-round text-secondary">school</span>
                  Образовательные программы
                </h2>
                <Link
                  href="/teacher/programs/new"
                  className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <span className="material-icons-round text-base">add</span>
                  Добавить программу
                </Link>
              </div>

              {programsLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                  <p className="ml-4 text-gray-600">Загрузка программ...</p>
                </div>
              )}

              {programsError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md mb-6" role="alert">
                  <div className="flex items-center">
                    <AlertCircle size={24} className="mr-3" />
                    <div>
                      <p className="font-bold">Ошибка загрузки</p>
                      <p className="text-sm">{programsError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {programs.map((program) => (
                  <Card
                    key={program.educational_program_id}
                    className="p-5 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{program.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{program.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          <BookOpen size={12} />
                          {program.department_id ? 'Кафедра ' + program.department_id : 'Без кафедры'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          <GraduationCap size={12} />
                          {program.enabled ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/teacher/programs/${program.educational_program_id}/disciplines`}
                        className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        Дисциплины
                        <ListChecks size={16} />
                      </Link>
                      <Link
                        href={`/teacher/programs/${program.educational_program_id}/students`}
                        className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                      >
                        Студенты
                        <User size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProgram(program.educational_program_id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                        disabled={isDeletingProgram}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {!programsLoading && !programsError && programs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Нет доступных образовательных программ</p>
                </div>
              )}
            </div>

            {/* GROUPS */}
            <GroupsExample role="teacher" />

            {/* ASSIGNMENTS */}
            <div className="bg-white rounded-3xl shadow-soft p-6 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                  <span className="material-icons-round text-secondary">assignment</span>
                  Управление заданиями
                </h2>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={(e) => {
                        e.preventDefault(); // Предотвращаем стандартное поведение кнопки
                        handleFilterChange(opt.value);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all duration-150
                        ${currentFilter === opt.value
                          ? 'bg-violet-600 text-white shadow-md ring-2 ring-violet-300'
                          : 'bg-white text-gray-700 hover:bg-violet-50 border border-gray-300 hover:border-violet-300'
                        }`}
                    >
                      <opt.icon size={16} className="mr-2" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {assignmentsLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                  <p className="ml-4 text-gray-600">Загрузка заданий...</p>
                </div>
              )}

              {assignmentsError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md mb-6" role="alert">
                  <div className="flex items-center">
                    <AlertTriangle size={24} className="mr-3" />
                    <div>
                      <p className="font-bold">Ошибка загрузки</p>
                      <p className="text-sm">{assignmentsError}</p>
                    </div>
                  </div>
                </div>
              )}

              {!assignmentsLoading && !assignmentsError && assignments.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <AlertCircle size={48} className="mx-auto text-sky-400 mb-4" />
                  <p className="text-lg font-medium text-black">Нет заданий</p>
                  <p className="text-sm">Для текущего фильтра "{filterOptions.find(f => f.value === currentFilter)?.label || currentFilter}" задания отсутствуют.</p>
                </div>
              )}

              {!assignmentsLoading && assignments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assignments.map(assignment => {
                    const deadlineDate = parseISO(assignment.deadline);
                    const now = new Date();
                    const daysLeft = differenceInDays(deadlineDate, now);
                    const isPastDeadline = deadlineDate < now;

                    let statusText = '';
                    let statusColor = '';
                    let StatusIcon = Clock;

                    if (assignment.currentUserSubmission) {
                      if (assignment.currentUserSubmission.grade !== null) {
                        statusText = `Оценено: ${assignment.currentUserSubmission.grade}/100`;
                        statusColor = 'bg-green-100 text-green-700';
                        StatusIcon = CheckCircle;
                      } else if (assignment.currentUserSubmission.isLate) {
                        statusText = 'Сдано с опозданием';
                        statusColor = 'bg-yellow-100 text-yellow-700';
                        StatusIcon = AlertTriangle;
                      } else {
                        statusText = 'Сдано вовремя';
                        statusColor = 'bg-sky-100 text-sky-700';
                        StatusIcon = CheckCircle;
                      }
                    } else {
                      if (isPastDeadline) {
                        statusText = 'Просрочено';
                        statusColor = 'bg-red-100 text-red-700';
                        StatusIcon = AlertTriangle;
                      } else {
                        statusText = `Осталось: ${formatDistanceToNowStrict(deadlineDate, { addSuffix: false, locale: ru })}`;
                        if (daysLeft < 0) statusText = "Дедлайн сегодня";
                        else if (daysLeft < 3) statusColor = 'bg-orange-100 text-orange-700';
                        else statusColor = 'bg-blue-100 text-blue-700';
                        StatusIcon = Clock;
                      }
                    }

                    return (
                      <div key={assignment.assignmentId} className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="p-5 border-b border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-violet-700 hover:text-violet-800 cursor-pointer truncate flex-1 mr-3">
                              {assignment.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            <User size={12} className="inline mr-1 opacity-70" /> Преподаватель: {assignment.educatorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            <CalendarDays size={12} className="inline mr-1 opacity-70" /> Дедлайн: {format(deadlineDate, 'd MMMM yyyy, HH:mm', { locale: ru })}
                          </p>
                        </div>

                        <div className="p-5 flex-grow">
                          <p className="text-sm text-gray-700 mb-3 line-clamp-3" title={assignment.description}>
                            {assignment.description}
                          </p>
                          {assignment.files && assignment.files.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-500 mb-1.5">Прикрепленные файлы:</p>
                              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                {assignment.files.map(file => (
                                  <div key={file.fileId} className="flex text-black items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-2 text-xs transition-colors">
                                    <span className="truncate flex-grow mr-2">{file.filename}</span>
                                    <button
                                      onClick={() => {/* TODO: Implement download */}}
                                      className="ml-auto text-violet-600 hover:text-violet-800 p-1 rounded-full hover:bg-violet-100"
                                      title="Скачать файл"
                                    >
                                      <Download size={16} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                          <button className="px-4 py-2 text-sm font-medium text-violet-700 bg-violet-100 hover:bg-violet-200 rounded-lg transition-colors flex items-center">
                            <Eye size={16} className="mr-2" /> Подробнее
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.assignmentId)}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg transition-colors flex items-center"
                          >
                            <Trash2 size={16} className="mr-2" /> Удалить
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
}

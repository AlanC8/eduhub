// hooks/useAssignments.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import AssignmentsService from '@/service/AssignmentsSettings';
import type { Assignment, AssignmentFilter, ApiResponse } from '@/types';

interface UseAssignmentsState {
  assignments: Assignment[];
  selectedAssignmentDetail: Assignment | null; // Детали выбранного задания
  loading: boolean;
  loadingDetails: boolean; // Отдельный лоадер для деталей
  error: string | null;
  currentFilter: AssignmentFilter;
  isDeleting: boolean;
  // studentId и disciplineId будут передаваться в хук
}

// ID студента и дисциплины должны приходить извне
// const DEFAULT_STUDENT_ID = 2; // Убираем дефолтные значения отсюда
// const DEFAULT_DISCIPLINE_ID = 3;

export const useAssignments = (studentId: number, disciplineId: number) => {
  const [state, setState] = useState<UseAssignmentsState>({
    assignments: [],
    selectedAssignmentDetail: null,
    loading: false,
    loadingDetails: false,
    error: null,
    currentFilter: 'all',
    isDeleting: false,
  });

  const assignmentsService = AssignmentsService.getInstance();

  const fetchAssignmentsList = useCallback(async (filterToFetch: AssignmentFilter) => {
    if (!studentId || !disciplineId) {
        console.warn("Student ID or Discipline ID is not provided to fetchAssignmentsList.");
        setState(prev => ({ ...prev, assignments: [], loading: false, error: "Необходимы ID студента и дисциплины" }));
        return;
    }
    setState(prev => ({ ...prev, loading: true, error: null, currentFilter: filterToFetch }));
    try {
      const response = await assignmentsService.getAssignments(studentId, disciplineId, filterToFetch);
      setState(prev => ({
        ...prev,
        assignments: response.data || [],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить задания';
      console.error("Error in fetchAssignmentsList:", errorMessage, error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        assignments: [],
      }));
    }
  }, [assignmentsService, studentId, disciplineId]);

  const fetchAssignmentById = useCallback(async (assignmentId: number) => {
    if (!studentId) {
        console.warn("Student ID is not provided to fetchAssignmentById.");
        setState(prev => ({ ...prev, selectedAssignmentDetail: null, loadingDetails: false, error: "Необходим ID студента для деталей" }));
        return;
    }
    setState(prev => ({ ...prev, loadingDetails: true, error: null }));
    try {
      const response = await assignmentsService.getAssignmentById(assignmentId); // getAssignmentById takes only assignmentId
      setState(prev => ({
        ...prev,
        selectedAssignmentDetail: response.data,
        loadingDetails: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Не удалось загрузить детали задания ${assignmentId}`;
      console.error("Error in fetchAssignmentById:", errorMessage, error);
      setState(prev => ({ ...prev, error: errorMessage, loadingDetails: false, selectedAssignmentDetail: null }));
    }
  }, [assignmentsService, studentId]);

  const downloadFile = useCallback(async (fileId: number, filename: string) => {
    // Не меняем состояние loading для скачивания, это фоновая операция
    try {
      const blob = await assignmentsService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Не удалось скачать файл ${filename}`;
      console.error(`Error downloading file ${fileId}:`, error);
      // Можно установить состояние ошибки, если нужно уведомить пользователя
      setState(prev => ({ ...prev, error: errorMessage })); // Показываем ошибку
      // alert(`Не удалось скачать файл: ${filename}`); // Или используем alert
    }
  }, [assignmentsService]);

  const submitStudentAssignment = useCallback(async (assignmentId: number, comment: string | null, files: File[] | null) => {
    if (!studentId) {
        console.warn("Student ID is not provided for submitStudentAssignment.");
        setState(prev => ({ ...prev, error: "Необходим ID студента для сдачи задания", loading: false }));
        throw new Error("Student ID is required");
    }
    setState(prev => ({ ...prev, loading: true, error: null })); // Используем основной loading
    try {
      const response = await assignmentsService.submitAssignment(assignmentId, comment, files);
      setState(prev => ({ ...prev, loading: false }));
      // После успешной сдачи, обновляем список заданий (например, текущим фильтром)
      fetchAssignmentsList(state.currentFilter);
      return response.data; // Возвращаем данные о сдаче
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось отправить задание';
      console.error("Error in submitStudentAssignment:", errorMessage, error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, [assignmentsService, studentId, fetchAssignmentsList, state.currentFilter]);

  // Функция для смены фильтра
  const changeFilter = useCallback((newFilter: AssignmentFilter) => {
    fetchAssignmentsList(newFilter);
  }, [fetchAssignmentsList]);

  // Первичная загрузка данных при монтировании или изменении studentId/disciplineId
  useEffect(() => {
    if (studentId && disciplineId) {
      fetchAssignmentsList(state.currentFilter);
    } else {
      // Если ID нет, можно очистить список или показать сообщение
      setState(prev => ({...prev, assignments: [], error: "Выберите студента и дисциплину"}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, disciplineId]); // Загружаем только при изменении ID, фильтр меняется через changeFilter

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSelectedAssignmentDetail = useCallback(() => {
    setState(prev => ({ ...prev, selectedAssignmentDetail: null }));
  }, []);

  const deleteAssignment = useCallback(async (assignmentId: number) => {
    setState(prev => ({ ...prev, isDeleting: true, error: null }));
    try {
      await assignmentsService.deleteAssignment(assignmentId);
      // После успешного удаления обновляем список
      setState(prev => ({
        ...prev,
        assignments: prev.assignments.filter(a => a.assignmentId !== assignmentId),
        isDeleting: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось удалить задание';
      console.error("Error deleting assignment:", errorMessage);
      setState(prev => ({ ...prev, error: errorMessage, isDeleting: false }));
      throw error;
    }
  }, [assignmentsService]);

  return {
    ...state,
    // fetchAssignmentsList, // переименовал для ясности, что это список
    fetchAssignmentById,
    downloadFile,
    submitStudentAssignment, // новый метод
    changeFilter,
    clearError,
    clearSelectedAssignmentDetail,
    deleteAssignment,
  };
};
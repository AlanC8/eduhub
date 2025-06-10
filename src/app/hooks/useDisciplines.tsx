'use client';

import { useState, useCallback } from 'react';
import DisciplinesSettings from '../../service/DisciplinesSettings';
import { 
  DisciplinesListResponse, 
  DisciplineDetailResponse, 
  DisciplineCreateRequest, 
  Discipline,
  EducationalProgramsListResponse,
  EducationalProgram
} from '../../types';

interface UseDisciplinesState {
  disciplines: Discipline[];
  selectedDiscipline: Discipline | null;
  educationalPrograms: EducationalProgram[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useDisciplines = () => {
  const [state, setState] = useState<UseDisciplinesState>({
    disciplines: [],
    selectedDiscipline: null,
    educationalPrograms: [],
    loading: false,
    error: null,
    total: 0,
  });

  const disciplinesService = DisciplinesSettings.getInstance();

  const getAllDisciplines = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await disciplinesService.getAllDisciplines();
      setState(prev => ({ 
        ...prev, 
        disciplines: response.data, 
        total: response.total,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch disciplines';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const getDisciplineById = useCallback(async (disciplineId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await disciplinesService.getDisciplineById(disciplineId);
      setState(prev => ({ 
        ...prev, 
        selectedDiscipline: response.data, 
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch discipline';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const createDiscipline = useCallback(async (disciplineData: DisciplineCreateRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await disciplinesService.createDiscipline(disciplineData);
      setState(prev => ({ 
        ...prev, 
        disciplines: [...prev.disciplines, response.data],
        total: prev.total + 1,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create discipline';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const updateDiscipline = useCallback(async (disciplineId: number, disciplineData: Partial<DisciplineCreateRequest>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await disciplinesService.updateDiscipline(disciplineId, disciplineData);
      setState(prev => ({ 
        ...prev, 
        disciplines: prev.disciplines.map(discipline => 
          discipline.discipline_id === disciplineId ? response.data : discipline
        ),
        selectedDiscipline: prev.selectedDiscipline?.discipline_id === disciplineId ? response.data : prev.selectedDiscipline,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update discipline';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const deleteDiscipline = useCallback(async (disciplineId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await disciplinesService.deleteDiscipline(disciplineId);
      setState(prev => ({ 
        ...prev, 
        disciplines: prev.disciplines.filter(discipline => discipline.discipline_id !== disciplineId),
        total: Math.max(0, prev.total - 1),
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete discipline';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const getAllEducationalPrograms = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await disciplinesService.getAllEducationalPrograms();
      setState(prev => ({ 
        ...prev, 
        educationalPrograms: response.data,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch educational programs';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [disciplinesService]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSelectedDiscipline = useCallback(() => {
    setState(prev => ({ ...prev, selectedDiscipline: null }));
  }, []);

  return {
    ...state,
    getAllDisciplines,
    getDisciplineById,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    getAllEducationalPrograms,
    clearError,
    clearSelectedDiscipline,
  };
}; 
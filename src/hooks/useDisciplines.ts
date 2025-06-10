import { useState, useEffect } from 'react';
import DisciplinesSettings from '@/service/DisciplinesSettings';
import { DisciplinesListResponse, Discipline } from '@/types';

export const useDisciplines = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const disciplinesService = DisciplinesSettings.getInstance();

  const fetchDisciplines = async () => {
    try {
      setLoading(true);
      const response = await disciplinesService.getAllDisciplines();
      setDisciplines(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке дисциплин');
      console.error('Error fetching disciplines:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscipline = async (id: number) => {
    try {
      await disciplinesService.deleteDiscipline(id);
      await fetchDisciplines(); // Refresh the list after deletion
    } catch (err) {
      setError('Ошибка при удалении дисциплины');
      console.error('Error deleting discipline:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDisciplines();
  }, []);

  return {
    disciplines,
    loading,
    error,
    refreshDisciplines: fetchDisciplines,
    deleteDiscipline
  };
}; 
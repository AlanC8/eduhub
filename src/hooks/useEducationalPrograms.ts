import { useState, useEffect } from 'react';
import DisciplinesSettings from '@/service/DisciplinesSettings';
import { EducationalProgram } from '@/types';

export const useEducationalPrograms = () => {
  const [programs, setPrograms] = useState<EducationalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const disciplinesService = DisciplinesSettings.getInstance();

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await disciplinesService.getAllEducationalPrograms();
      setPrograms(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке образовательных программ');
      console.error('Error fetching educational programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProgram = async (id: number) => {
    try {
      await disciplinesService.deleteEducationalProgram(id);
      await fetchPrograms(); // Refresh the list after deletion
    } catch (err) {
      setError('Ошибка при удалении образовательной программы');
      console.error('Error deleting educational program:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    refreshPrograms: fetchPrograms,
    deleteProgram
  };
}; 
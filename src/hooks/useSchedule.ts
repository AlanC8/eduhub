import { useState, useEffect } from 'react';
import ScheduleService from '@/service/ScheduleService';
import type { Schedule } from '@/service/ScheduleService';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scheduleService = ScheduleService.getInstance();

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getSchedule();
      
      if (response && Array.isArray(response.data)) {
        setSchedule(response.data);
        setTotal(response.total);
        setError(null);
      } else {
        console.error('Unexpected schedule data format:', response);
        setSchedule([]);
        setTotal(0);
        setError('Неверный формат данных расписания');
      }
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setSchedule([]);
      setTotal(0);
      setError('Ошибка при загрузке расписания');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return {
    schedule,
    total,
    loading,
    error,
    refreshSchedule: fetchSchedule
  };
}; 
'use client';

import { useRef, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { useSchedule } from '@/hooks/useSchedule';
import type { Schedule } from '@/service/ScheduleService';

const VIEWS = {
  dayGridMonth: 'Месяц',
  timeGridWeek: 'Неделя',
  timeGridDay:  'День',
} as const;

export default function Calendar() {
  const calRef = useRef<FullCalendar | null>(null);
  const api = () => calRef.current?.getApi();
  const [view, setView] = useState<keyof typeof VIEWS>('timeGridWeek');
  const [modal, setModal] = useState<EventClickArg | null>(null);

  const { schedule, loading, error, total } = useSchedule();

  const calendarEvents = useMemo(() => {
    return schedule.map((item: Schedule) => ({
      title: item.title || 'Без названия',
      daysOfWeek: [item.day], // day is 1-7 in both FullCalendar and our API
      startTime: `${String(item.start_time_num).padStart(2, '0')}:00`,
      endTime: `${String(item.end_time_num).padStart(2, '0')}:00`,
      extendedProps: {
        discipline_id: item.discipline_id,
        group_id: item.group_id,
        room_id: item.room_id,
        teacher_id: item.teacher_id
      }
    }));
  }, [schedule]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs p-8 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600 border-t-transparent"></div>
          <span className="text-gray-600">Загрузка расписания...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white shadow-xs p-8">
        <div className="text-red-600">Ошибка загрузки расписания: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col">
        <header className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {['chevron_left', 'chevron_right'].map((ic, i) => (
              <button
                key={ic}
                aria-label={i ? 'Следующий' : 'Предыдущий'}
                onClick={() => (i ? api()?.next() : api()?.prev())}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition"
              >
                <span className="material-icons-round">{ic}</span>
              </button>
            ))}
            <h2 className="ml-2 text-lg font-medium select-none">{api()?.view?.title ?? ''}</h2>

            <button
              onClick={() => api()?.today()}
              className="ml-4 px-3 py-1.5 rounded-md text-sm font-medium
                         bg-violet-600 text-white hover:bg-violet-700 active:scale-95 transition"
            >
              Сегодня
            </button>
          </div>

          {/* view switch */}
          <div className="flex rounded-xl overflow-hidden text-sm ring-1 ring-gray-200">
            {(Object.entries(VIEWS) as [keyof typeof VIEWS, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => { api()?.changeView(k); setView(k); }}
                className={`px-4 py-1 transition
                  ${view === k
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* calendar core */}
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={ruLocale}
          initialView={view}
          headerToolbar={false}
          height="auto"
          allDaySlot={false}
          slotMinTime="08:00:00"
          dayMaxEvents
          nowIndicator
          selectable
          events={calendarEvents}
          eventClassNames="!bg-violet-600/90 !border-violet-600 !text-violet-700 hover:!bg-violet-600/80"
          eventClick={(arg) => setModal(arg)}
        />
      </div>

      {/* mini-modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="w-[90vw] max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">{modal.event.title}</h3>
            <p className="text-sm text-gray-600">
              {modal.event.allDay
                ? 'Событие на весь день'
                : `${modal.event.startStr.replace('T', ' ')} – ${modal.event.endStr?.replace('T', ' ')}`}
            </p>
            <div className="text-sm text-gray-600">
              <p>Аудитория: {modal.event.extendedProps.room_id || 'Онлайн'}</p>
              <p>Группа: {modal.event.extendedProps.group_id}</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

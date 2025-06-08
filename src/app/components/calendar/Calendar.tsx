'use client';

import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';

/* ——— label ↔︎ view map ——— */
const VIEWS = {
  dayGridMonth: 'Месяц',
  timeGridWeek: 'Неделя',
  timeGridDay:  'День',
} as const;

/* ——— WEEKLY CS SCHEDULE @ IITU ———
   daysOfWeek: 1-пон, 2-вт, 3-ср, 4-чт, 5-пт
   startRecur / endRecur — границы семестра               */
const seedEvents = [
  /* Monday */
  { title: 'Дискретная математика',      daysOfWeek: [1], startTime: '09:00', endTime: '10:30' },
  { title: 'Линейная алгебра',           daysOfWeek: [1], startTime: '10:45', endTime: '12:15' },
  { title: 'Английский для IT',          daysOfWeek: [1], startTime: '13:00', endTime: '14:30' },
  { title: 'Английский для IT',          daysOfWeek: [1], startTime: '14:45', endTime: '16:15' },
  { title: 'Английский для IT',          daysOfWeek: [1], startTime: '16:30', endTime: '18:00' },
  /* Tuesday */
  { title: 'Алгоритмы и структуры данных', daysOfWeek: [2], startTime: '09:00', endTime: '10:30' },
  { title: 'Операционные системы',         daysOfWeek: [2], startTime: '10:45', endTime: '12:15' },

  /* Wednesday */
  { title: 'Базы данных',                daysOfWeek: [3], startTime: '09:00', endTime: '10:30' },
  { title: 'Теория вероятностей',        daysOfWeek: [3], startTime: '10:45', endTime: '12:15' },
  { title: 'Теория вероятностей',        daysOfWeek: [3], startTime: '12:30', endTime: '14:00' },
  { title: 'Теория вероятностей',        daysOfWeek: [3], startTime: '14:15', endTime: '15:45' },
  /* Thursday */
  { title: 'Компьютерные сети',          daysOfWeek: [4], startTime: '09:00', endTime: '10:30' },
  { title: 'Лабораторная по ИБ',         daysOfWeek: [4], startTime: '13:00', endTime: '14:40' },

  /* Friday */
  { title: 'Веб-технологии',             daysOfWeek: [5], startTime: '09:00', endTime: '10:30' },
  { title: 'Проектный семинар',          daysOfWeek: [5], startTime: '10:45', endTime: '12:15' },

  /* one-off deadline example */
  { title: 'Сдача курсовой',             start: '2025-05-20', allDay: true },
];

/* ———————————————————————————————————— */

export default function Calendar() {
  const calRef = useRef<FullCalendar | null>(null);
  const api     = () => calRef.current?.getApi();
  const [view, setView] = useState<keyof typeof VIEWS>('timeGridWeek');
  const [modal, setModal] = useState<EventClickArg | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col">
        {/* top bar */}
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
          dayMaxEvents
          nowIndicator
          selectable
          events={seedEvents}
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

            <div className="flex justify-end gap-2 pt-1">
              <button
                aria-label="Удалить"
                onClick={() => { modal.event.remove(); setModal(null); }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-600/10 transition"
              >
                <span className="material-icons-round">delete</span>
              </button>
              <button
                onClick={() => setModal(null)}
                className="px-4 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700"
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

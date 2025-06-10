// app/calendar/page.tsx
'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import ruLocale from '@fullcalendar/core/locales/ru';
import { format as formatDateFns, parseISO } from 'date-fns';
import { ru as ruFnsLocale } from 'date-fns/locale';
import { useSchedule } from '@/hooks/useSchedule'; // Убедитесь, что путь правильный
import type { Schedule } from '@/service/ScheduleService'; // Убедитесь, что путь правильный

// Иконки Lucide
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ListChecks, X as CloseIcon, MapPin, Users2, Info, AlertTriangle, Loader2 } from 'lucide-react';

const VIEWS = {
  timeGridWeek: { label: 'Неделя', icon: <CalendarIcon size={16} /> },
  timeGridDay: { label: 'День', icon: <CalendarIcon size={16} /> },
  dayGridMonth: { label: 'Месяц', icon: <CalendarIcon size={16} /> }, // Можно использовать другую иконку, если есть более подходящая для месяца
  listWeek: { label: 'Список', icon: <ListChecks size={16} /> }
} as const;

type ViewKey = keyof typeof VIEWS;

export default function CalendarPage() {
  const calRef = useRef<FullCalendar | null>(null);
  const [currentView, setCurrentView] = useState<ViewKey>('timeGridWeek');
  const [modal, setModal] = useState<EventClickArg | null>(null);
  const [calendarTitle, setCalendarTitle] = useState('');

  const { schedule, loading, error } = useSchedule();

  const calendarEvents = useMemo(() => {
    if (!schedule) return [];
    return schedule.map((item: Schedule) => {
      const fcDay = item.day === 7 ? 0 : item.day;
      const startTimeStr = formatDateFns(item.start_time, 'HH:mm');
      const endTimeStr = formatDateFns(item.end_time, 'HH:mm');

      let eventColor = '#8b5cf6'; // Default: violet-500
      if (item.room_id === 0) { // Онлайн
        eventColor = '#7c3aed'; // violet-600
      } else if (item.title?.toLowerCase().includes('лекция')) {
        eventColor = '#6d28d9'; // violet-700
      } else if (item.title?.toLowerCase().includes('практика') || item.title?.toLowerCase().includes('семинар')) {
        eventColor = '#8b5cf6'; // violet-500
      } else if (item.title?.toLowerCase().includes('лабораторная')) {
        eventColor = '#9333ea'; // purple-600
      }

      return {
        id: `${item.discipline_id}-${item.group_id}-${item.day}-${item.start_time_num}`,
        title: item.title || 'Без названия',
        daysOfWeek: [fcDay],
        startTime: startTimeStr,
        endTime: endTimeStr,
        extendedProps: {
          discipline_id: item.discipline_id,
          group_id: item.group_id,
          room_id: item.room_id,
          teacher_id: item.teacher_id,
          apiEvent: item,
        },
        backgroundColor: eventColor,
        borderColor: eventColor,
        textColor: 'white',
        display: 'block',
        className: 'cursor-pointer hover:opacity-90 transition-opacity shadow-sm'
      };
    });
  }, [schedule]);

  useEffect(() => {
    const calendarApi = calRef.current?.getApi();
    if (calendarApi?.view?.title) {
      setCalendarTitle(calendarApi.view.title);
    }
  }, [currentView, calendarEvents]); // Обновляем при смене вида или обновлении событий

  const handleDatesSet = (arg: DatesSetArg) => {
    if (arg.view.title) {
      setCalendarTitle(arg.view.title);
    }
  };

  const renderEventContent = (eventInfo: EventClickArg | any) => {
    const props = eventInfo.event.extendedProps;
    const isList = eventInfo.view.type === 'listWeek';

    if (isList) {
      const startTime = eventInfo.event.start ? formatDateFns(parseISO(props.apiEvent.start_time), 'HH:mm') : '';
      const endTime = eventInfo.event.end ? formatDateFns(parseISO(props.apiEvent.end_time), 'HH:mm') : '';

      return (
        <div className="flex items-center justify-between w-full px-2 py-1.5 group">
          <div className="flex items-center gap-x-3">
            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: eventInfo.event.backgroundColor || '#6d28d9' }}></span>
            <span className="font-medium text-sm text-gray-700 group-hover:text-violet-600">{eventInfo.event.title}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-x-3">
            <span>{startTime} - {endTime}</span>
            <span>|</span>
            <span>{props.room_id === 0 ? 'Онлайн' : `Ауд. ${props.room_id}`}</span>
            <span>| Группа: {props.group_id}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-1.5 h-full flex flex-col justify-between overflow-hidden leading-tight">
        <div className="font-semibold text-[13px] truncate">{eventInfo.event.title}</div>
        <div className="flex flex-col text-[11px] text-white/90 mt-0.5">
          <div className="truncate">
            {props.room_id === 0 ? 'Онлайн' : `Ауд. ${props.room_id}`}
          </div>
          <div className="truncate">
            Группа: {props.group_id}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center bg-white p-8 min-h-[calc(100vh-160px)] rounded-lg shadow-sm">
        <Loader2 size={40} className="text-violet-600 animate-spin mb-4" />
        <span className="text-gray-700 text-md font-medium">Загрузка расписания...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center bg-red-50 text-red-700 p-8 rounded-lg shadow-sm border border-red-200 min-h-[calc(100vh-160px)]">
        <AlertTriangle size={40} className="text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
        <p className="text-center text-sm max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200/80">
        <header className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-5 py-3.5 border-b border-gray-200">
          <div className="flex items-center gap-1.5 mb-3 md:mb-0 w-full md:w-auto">
            <button
              title="Предыдущий период"
              onClick={() => calRef.current?.getApi()?.prev()}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-violet-600 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-300"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              title="Следующий период"
              onClick={() => calRef.current?.getApi()?.next()}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-violet-600 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-300"
            >
              <ChevronRight size={22} />
            </button>
            <h2 className="ml-2 text-lg font-medium text-black select-none flex-grow md:flex-grow-0 text-center md:text-left min-w-0">
              <span className="truncate" title={calendarTitle}>{calendarTitle}</span>
            </h2>
            <button
              onClick={() => calRef.current?.getApi()?.today()}
              className="ml-auto md:ml-3 px-3.5 py-1.5 rounded-md text-sm font-medium
                         bg-violet-600 text-white hover:bg-violet-700 active:scale-95 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1"
            >
              Сегодня
            </button>
          </div>

          <div className="flex rounded-md text-sm shadow-sm border border-gray-200 w-full md:w-auto justify-center">
            {(Object.entries(VIEWS) as [ViewKey, {label: string, icon: React.ReactNode}][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => {
                  calRef.current?.getApi()?.changeView(k);
                  setCurrentView(k);
                }}
                title={v.label}
                className={`flex-1 md:flex-auto rounded-md px-3.5 py-2 transition-colors duration-150 border-l border-gray-200 first:border-l-0 flex items-center justify-center gap-1.5
                  ${currentView === k
                    ? 'bg-violet-600 text-white font-medium'
                    : 'bg-white text-black hover:bg-gray-50'}`}
              >
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="p-0.5 sm:p-1 md:p-0 flex-grow fc-theme">
          <style jsx global>{`
            .fc-theme .fc-daygrid-day-number,
            .fc-theme .fc-col-header-cell-cushion {
              color: #374151;
              font-weight: 500;
              padding: 8px;
            }
            
            .fc-theme .fc-col-header-cell {
              padding: 8px 0;
              background-color: #f9fafb;
            }

            .fc-theme .fc-day-today {
              background-color: #f3e8ff !important;
            }

            .fc-theme .fc-timegrid-slot {
              height: 4rem !important;
            }

            .fc-theme .fc-timegrid-slot-label {
              color: #6b7280;
              font-size: 0.875rem;
              padding: 8px;
            }

            .fc-theme .fc-event {
              border-radius: 6px !important;
              padding: 2px !important;
              margin: 1px !important;
              min-height: 28px !important;
              border: none !important;
              background-color: var(--fc-event-bg-color) !important;
            }

            .fc-theme .fc-event-main {
              padding: 0;
            }

            .fc-theme .fc-event-time {
              font-size: 11px;
              font-weight: 500;
              opacity: 0.9;
              padding: 0 4px;
            }

            .fc-theme .fc-timegrid-event {
              background: var(--fc-event-bg-color) !important;
              border: none !important;
              margin: 0 1px !important;
            }

            .fc-theme .fc-timegrid-event-harness {
              margin: 1px !important;
            }

            .fc-theme .fc-timegrid-event .fc-event-main {
              padding: 0;
            }

            .fc-theme .fc-timegrid-event .fc-event-main-frame {
              height: 100%;
            }

            .fc-theme .fc-list-event {
              background: transparent !important;
            }

            .fc-theme .fc-list-day-cushion {
              background-color: #f9fafb !important;
            }

            .fc-theme .fc-timegrid-axis-frame {
              display: none;
            }

            .fc-theme .fc-timegrid-now-indicator-line {
              border-color: #dc2626 !important;
              border-width: 2px;
            }

            .fc-theme .fc-timegrid-now-indicator-arrow {
              border-color: #dc2626 !important;
              border-width: 5px;
            }

            .fc-theme .fc-col-header {
              border-radius: 8px 8px 0 0;
              overflow: hidden;
              margin: 1px;
            }

            .fc-theme .fc-scrollgrid {
              border-radius: 8px;
              border: 1px solid #e5e7eb !important;
            }

            .fc-theme .fc-scrollgrid td:last-of-type {
              border-right: 0;
            }

            .fc-theme .fc-scrollgrid tr:last-child td {
              border-bottom: 0;
            }
          `}</style>
          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            locale={ruLocale}
            initialView={currentView}
            headerToolbar={false}
            height="auto"
            contentHeight="calc(85vh - 200px)"
            aspectRatio={1.6}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            slotDuration="01:00:00"
            slotLabelInterval={{ hours: 1 }}
            nowIndicator
            selectable={false}
            selectMirror={false}
            unselectAuto={true}
            editable={false}
            events={calendarEvents}
            datesSet={handleDatesSet}
            eventContent={renderEventContent}
            eventClick={(arg) => {
              if (arg.event && arg.event.title) {
                setModal(arg);
              }
            }}
            slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: false, meridiem: false }}
            dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
            firstDay={1}
            weekends={true}
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: false, hour12: false }}
            displayEventEnd={true}
            dayMaxEvents={true}
            eventMinWidth={80}
            longPressDelay={300}
          />
        </div>
      </div>

      {modal && modal.event && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-150 ease-in-out"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 bg-violet-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{modal.event.title}</h3>
                <button onClick={() => setModal(null)} className="p-1 rounded-full text-violet-100 hover:bg-violet-500 hover:text-white transition-colors">
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-3 text-sm max-h-[60vh] overflow-y-auto">
              {[
                { icon: CalendarIcon, label: "Дата и время", value: `${formatDateFns(parseISO(modal.event.extendedProps.apiEvent.start_time), 'd MMMM yyyy, HH:mm', { locale: ruFnsLocale })} – ${formatDateFns(parseISO(modal.event.extendedProps.apiEvent.end_time), 'HH:mm', { locale: ruFnsLocale })}` },
                { icon: MapPin, label: "Место", value: modal.event.extendedProps.room_id === 0 ? 'Онлайн занятие' : `Аудитория ${modal.event.extendedProps.room_id}` },
                { icon: Users2, label: "Группа", value: modal.event.extendedProps.group_id },
                { icon: Users2, label: "Преподаватель ID", value: modal.event.extendedProps.teacher_id }, // Можно заменить на ФИО если есть
                modal.event.extendedProps.description && { icon: Info, label: "Описание", value: modal.event.extendedProps.description },
              ].filter(Boolean).map((item: any, index) => (
                <div key={index} className="flex items-start gap-2.5 text-gray-700">
                  <item.icon size={16} className="text-violet-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-medium text-black">{item.label}:</strong>{' '}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-md bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 transition-colors"
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
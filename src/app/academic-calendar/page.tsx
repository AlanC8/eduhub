// app/academic-calendar/page.tsx
import React from 'react';
import { BookOpen, CalendarDays, CheckCircle, Clock, Edit3, Flag, Layers, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface CalendarEvent {
  name: string;
  period: string;
  icon?: React.ElementType; // Опциональная иконка
}

interface CalendarSubSection {
  title: string;
  events: CalendarEvent[];
  icon?: React.ElementType;
}

interface CalendarSectionData {
  title: string;
  mainEvents?: CalendarEvent[];
  subSections: CalendarSubSection[];
  icon?: React.ElementType;
}

const academicCalendarData: {
  mainTitle: string;
  subTitleParts: string[];
  sections: CalendarSectionData[];
} = {
  mainTitle: "Академический календарь",
  subTitleParts: [
    "на 2024 - 2025 учебный год",
    "Бакалавриат для 4 и 3ССО курса"
  ],
  sections: [
    {
      title: "Күзгі семестр 2024-2025 оқу жылы / Осенний семестр 2024-2025 учебный год",
      icon: CalendarDays,
      mainEvents: [
        { name: "Начало семестра", period: "2 сентября", icon: Flag },
        { name: "Конец семестра", period: "17 декабря", icon: Flag },
        { name: "Дата выставления средней оценки за учебный период", period: "30 мая", icon: CheckCircle },
        { name: "Всего недель", period: "16", icon: Layers },
      ],
      subSections: [
        {
          title: "Регистрация",
          icon: Edit3,
          events: [
            { name: "Регистрация на курсы", period: "4 августа - 29 октября" },
          ],
        },
        {
          title: "Рубежные контроли",
          icon: Clock,
          events: [
            { name: "Аралық бақылау 1 / Рубежный контроль 1", period: "21-27 октября" },
            { name: "Аралық бақылау 2 / Рубежный контроль 2", period: "9-16 декабря" },
          ],
        },
        {
          title: "Сессия",
          icon: BookOpen,
          events: [
            { name: "Қысқы емтихан сессиясы / Зимняя экзаменационная сессия", period: "18 декабря - 31 декабря" },
          ],
        },
        {
          title: "Демалыс / Каникулы", // Заголовок для каникул, так как в HTML был пустой h5 перед этим
          icon: CalendarDays, // Можно подобрать другую иконку, если нужно
          events: [
            { name: "Демалыс / Каникулы", period: "1 января - 18 января" },
          ],
        },
      ],
    },
    {
      title: "4 курс студенттері үшін теориялық оқыту / Теоретическое обучение для студентов 4 курса",
      icon: Users,
      mainEvents: [
        { name: "Начало семестра", period: "20 января", icon: Flag },
        { name: "Конец семестра", period: "21 марта", icon: Flag },
        { name: "Дата выставления средней оценки за учебный период", period: "30 мая", icon: CheckCircle },
        { name: "Всего недель", period: "9", icon: Layers },
      ],
      subSections: [
        {
          title: "Регистрация",
          icon: Edit3,
          events: [
            { name: "Регистрация на курсы", period: "6-17 января" },
          ],
        },
        {
          title: "Рубежные контроли",
          icon: Clock,
          events: [
            { name: "Аралық бақылау 1 (4-ші оқу жылының студенттері үшін) / Рубежный контроль 1 (для студентов 4 года обучения)", period: "10-14 марта" },
            { name: "Аралық бақылау 2 (4-ші оқу жылының студенттері үшін) / Рубежный контроль 2 (для студентов 4 года обучения)", period: "17-21 марта" },
          ],
        },
        {
          title: "Сессия",
          icon: BookOpen,
          events: [
            { name: "4 оқу жылының студенттері үшін / для студентов 4 года обучения", period: "26 марта - 4 апреля" },
          ],
        },
        {
          title: "Практика",
          icon: Layers, // Можно заменить на более подходящую иконку для практики
          events: [
            { name: "Диплом алды тәжірибе / Преддипломная практика", period: "7 апреля - 10 мая" },
            { name: "Начало периода выставления итоговой оценки", period: "12 мая" },
            { name: "Конец периода выставления итоговой оценки", period: "17 мая" },
          ],
        },
        {
          title: "Защита дипломной работы",
          icon: CheckCircle, // Можно заменить
          events: [
            { name: "Дипломдық проектерді қорғау / Защита дипломных проектов", period: "1-21 июня" },
          ],
        },
      ],
    },
  ],
};

const AcademicCalendarPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-[70px] lg:ml-[76px]">
        <Header />
        
        <main className="flex-1 bg-white text-black p-4 sm:p-8 font-sans overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-violet-600">
                {academicCalendarData.mainTitle}
              </h1>
              {academicCalendarData.subTitleParts.map((part, index) => (
                <p key={index} className="text-md sm:text-lg text-gray-700 mt-1">
                  {part}
                </p>
              ))}
            </header>

            {academicCalendarData.sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="bg-white shadow-xl rounded-lg p-6 mb-8 transition-shadow duration-300 hover:shadow-2xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-violet-600 mb-6 pb-3 border-b-2 border-violet-200 flex items-center">
                  {section.icon && <section.icon className="mr-3 h-6 w-6" />}
                  {section.title}
                </h2>

                {section.mainEvents && section.mainEvents.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <tbody>
                        {section.mainEvents.map((event, eventIndex) => (
                          <tr key={eventIndex} className="border-b border-gray-200 last:border-b-0 hover:bg-violet-50 transition-colors duration-150">
                            <td className="w-2/5 sm:w-2/5 font-medium text-black py-3 px-4 flex items-center">
                              {event.icon && <event.icon className="mr-2 h-5 w-5 text-violet-500" />}
                              {event.name}
                            </td>
                            <td className="w-3/5 sm:w-3/5 text-black py-3 px-4 text-left">
                              {event.period}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.subSections.map((subSection, subIndex) => (
                  <div key={subIndex} className="mt-6">
                    <h3 className="text-xl font-semibold text-black mb-3 flex items-center">
                      {subSection.icon && <subSection.icon className="mr-2 h-5 w-5 text-violet-500" />}
                      {subSection.title}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px] border border-gray-200 rounded-md">
                        <tbody className="divide-y divide-gray-200">
                          {subSection.events.map((event, eventIndex) => (
                            <tr key={eventIndex} className="hover:bg-violet-50 transition-colors duration-150">
                              <td className="w-2/5 sm:w-2/5 font-medium text-black py-3 px-4">
                                {event.name}
                              </td>
                              <td className="w-3/5 sm:w-3/5 text-black py-3 px-4 text-left">
                                {event.period}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </section>
            ))}
            
            <footer className="text-center mt-12 py-6 border-t border-gray-300">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Учебное заведение. Все права защищены.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AcademicCalendarPage;
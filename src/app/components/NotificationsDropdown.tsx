import { useState } from 'react';
import Link from 'next/link';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Анкетирование',
      message: 'Вам назначено анкетирование «ИНФОРМАЦИОННЫЙ ЛИСТ»',
      time: '1 час назад',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Оценка',
      message: 'Новая оценка по предмету "Основы информационной безопасности"',
      time: '3 часа назад',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Дедлайн',
      message: 'Срок сдачи задания "Реферат" истекает завтра',
      time: '5 часов назад',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Расписание',
      message: 'Изменения в расписании на следующую неделю',
      time: '1 день назад',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getIconByType = (type: string) => {
    switch(type) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notifications';
    }
  };
  
  const getColorByType = (type: string) => {
    switch(type) {
      case 'info': return 'bg-primary text-white';
      case 'success': return 'bg-success text-white';
      case 'warning': return 'bg-warning text-white';
      case 'error': return 'bg-danger text-white';
      default: return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="text-gray-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons-round">notifications</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1 shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-slide-up">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Уведомления</h3>
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-500 hover:text-primary transition-colors">Отметить все</button>
              <button className="text-sm text-gray-500 hover:text-primary transition-colors">Настройки</button>
            </div>
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3 ${notification.read ? 'opacity-70' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full ${getColorByType(notification.type)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="material-icons-round text-sm">{getIconByType(notification.type)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 flex justify-center border-t border-gray-100">
            <Link 
              href="#" 
              className="text-sm text-primary hover:text-primary-dark transition-colors font-medium flex items-center"
            >
              Все уведомления
              <span className="material-icons-round text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 
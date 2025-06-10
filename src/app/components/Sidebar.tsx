'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../../types';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  { href: '/',                   icon: 'dashboard',              label: 'Главная',   roles: ['student', 'admin'] },
  { href: '/student_register',              icon: 'school',                 label: 'Оценки',     roles: ['student', 'admin'] },
  { href: '/indcur',             icon: 'checklist',              label: 'ИУП',       roles: ['student', 'admin'] },
  { href: '/schedule',           icon: 'schedule',               label: 'Расписание', roles: ['student', 'teacher', 'admin'] },
  { href: '/teacher',            icon: 'assignment_ind',         label: 'Препод.',   roles: ['teacher', 'admin'] },
  { href: '/admin',              icon: 'admin_panel_settings',   label: 'Админ',     roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useAuth();

  // Фильтруем навигационные элементы по ролям
  const filteredNavItems = navItems.filter(item => 
    role && item.roles.includes(role)
  );

  return (
    <aside className="fixed z-10 flex h-full w-[70px] lg:w-[76px] flex-col items-center
                      border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="py-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600 text-xl font-bold text-white shadow-inner">
          E
        </div>
        <span className="mt-1 block text-[10px] font-medium tracking-wider text-gray-600">
          EDUHUB
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex w-full flex-col space-y-1 px-1">
        {filteredNavItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col items-center rounded-xl py-3
                          ${active ? '' : ''}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-violet-600" />
              )}

              <span className="material-icons-round text-lg">{icon}</span>
              <span className="mt-0.5 text-[10px] leading-none text-black font-medium mt-2">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings and Logout */}
      <div className="mt-auto mb-6 flex flex-col space-y-2">
        <button
          aria-label="Настройки"
          className="rounded-full p-2 text-black hover:bg-gray-100 transition"
        >
          <span className="material-icons-round">settings</span>
        </button>
        <button
          onClick={logout}
          aria-label="Выйти"
          className="rounded-full p-2 text-red-600 hover:bg-red-50 transition"
        >
          <span className="material-icons-round">logout</span>
        </button>
      </div>
    </aside>
  );
}

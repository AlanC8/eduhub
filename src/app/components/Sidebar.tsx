import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-[70px] lg:w-[76px] bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex flex-col items-center fixed h-full z-10 shadow-2xl border-r border-white/10">
      {/* Лого */}
      <div className="py-6">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-inner backdrop-blur-sm">
          <span className="text-xl text-white font-bold">E</span>
        </div>
        <div className="text-[11px] text-gray-300 mt-2 font-medium">EDUHUB</div>
      </div>

      {/* Навигация */}
      <div className="flex flex-col space-y-2 mt-10 w-full px-1">
        {[
          { href: '/', icon: 'dashboard', label: 'Главная' },
          { href: '#', icon: 'school', label: 'Учеба' },
          { href: '#', icon: 'auto_stories', label: 'Материалы' },
          { href: '#', icon: 'groups', label: 'Люди' },
          { href: '#', icon: 'email', label: 'Почта' },
          { href: '#', icon: 'account_balance_wallet', label: 'Финансы' },
          { href: '#', icon: 'apps', label: 'Сервисы' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="group text-gray-300 hover:text-white w-full py-3 flex flex-col items-center relative transition-all">
            <div className="absolute inset-0 bg-white/5 scale-0 rounded-xl group-hover:scale-100 transition-transform duration-300"></div>
            <div className="absolute left-0 w-1 h-10 rounded-r-lg bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="material-icons-round z-10 mb-1 text-lg">{item.icon}</span>
            <span className="text-[10px] z-10">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Настройки */}
      <div className="mt-auto mb-6">
        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-300">
          <span className="material-icons-round">settings</span>
        </button>
      </div>
    </div>
  );
}

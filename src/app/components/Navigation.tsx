import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const { role } = useAuth();
  
  const linkClass = (path: string) => {
    const baseClass = "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors";
    return baseClass;
  };

  return (
    <nav className="flex flex-col gap-1">
      {role === 'teacher' && (
        <>
          <Link href="/teacher" className={linkClass('/teacher')}>
            <span className="material-icons-round">dashboard</span>
            Главная
          </Link>
          <Link href="/teacher/assignments" className={linkClass('/teacher/assignments')}>
            <span className="material-icons-round">assignment</span>
            Задания
          </Link>
        </>
      )}
      {/* ... остальная навигация ... */}
    </nav>
  );
} 
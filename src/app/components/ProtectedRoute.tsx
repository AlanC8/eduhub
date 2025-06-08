'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute:', { isAuthenticated, role, loading, allowedRoles });
    
    if (loading) return;

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.replace('/login');
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      console.log(`Role ${role} not allowed for this page. Allowed: ${allowedRoles.join(', ')}`);
      // Прямой редирект на страницу роли
      switch (role) {
        case "admin":
          console.log('Redirecting Admin to /admin');
          router.replace("/admin");
          break;
        case "teacher":
          console.log('Redirecting Teacher to /teacher');
          router.replace("/teacher");
          break;
        case "student":
          console.log('Redirecting Student to /');
          router.replace("/");
          break;
        default:
          console.log('Unknown role, redirecting to login');
          router.replace("/login");
      }
      return;
    }

    console.log('Access granted');
  }, [isAuthenticated, role, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Перенаправление на логин...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Перенаправление...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 
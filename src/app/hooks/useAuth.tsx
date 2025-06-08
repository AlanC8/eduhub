'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Interceptor from '../../service/Interceptor';
import { Role } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  userId: number | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    userId: null,
    loading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const interceptor = Interceptor.getInstance();
      const token = interceptor.getToken();
      const role = interceptor.getRole();
      const userId = interceptor.getUserId();

      console.log('useAuth checkAuth:', { token: !!token, role, userId });

      setAuthState({
        isAuthenticated: !!token,
        role,
        userId,
        loading: false,
      });
    };

    checkAuth();
  }, []);

  const logout = () => {
    const interceptor = Interceptor.getInstance();
    interceptor.clearUserData();
    setAuthState({
      isAuthenticated: false,
      role: null,
      userId: null,
      loading: false,
    });
    router.push('/login');
  };

  const hasRole = (requiredRole: Role): boolean => {
    return authState.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: Role[]): boolean => {
    return authState.role ? requiredRoles.includes(authState.role) : false;
  };

  const redirectBasedOnRole = () => {
    if (!authState.isAuthenticated) {
      router.push('/login');
      return;
    }

    switch (authState.role) {
      case "admin":
        router.push("/admin");
        break;
      case "teacher":
        router.push("/teacher");
        break;
      case "student":
        router.push("/");
        break;
      default:
        router.push("/");
    }
  };

  return {
    ...authState,
    logout,
    hasRole,
    hasAnyRole,
    redirectBasedOnRole,
  };
}; 
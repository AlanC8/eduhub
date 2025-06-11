'use client';

import { useState, useCallback, useEffect } from 'react';
import UsersService from '../../service/UsersService';
import { User, Group } from '../../types';

interface CurrentUser {
  enabled: boolean;
  fio: string;
  is_admin: boolean;
  is_service: boolean;
  is_student: boolean;
  local: boolean;
  login: string;
  position: string;
  sid: string;
  user_id: number;
}

interface UseUsersState {
  users: User[];
  selectedUser: User | null;
  userGroups: Group[];
  loading: boolean;
  error: string | null;
  total: number;
  currentUser: CurrentUser | null;
}

export const useUsers = () => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    selectedUser: null,
    userGroups: [],
    loading: false,
    error: null,
    total: 0,
    currentUser: null,
  });

  const usersService = UsersService.getInstance();

  // Добавляем функцию для получения текущего пользователя
  const getCurrentUser = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await usersService.getUserById(Number(userId));
      setState(prev => ({ 
        ...prev, 
        currentUser: response.data as CurrentUser,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current user';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      console.error('Error fetching current user:', error);
    }
  }, [usersService]);

  // Добавляем useEffect для автоматической загрузки данных текущего пользователя
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const getAllUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await usersService.getAllUsers();
      setState(prev => ({ 
        ...prev, 
        users: response.data, 
        total: response.total,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [usersService]);

  const getUserById = useCallback(async (userId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await usersService.getUserById(userId);
      setState(prev => ({ 
        ...prev, 
        selectedUser: response.data as User, 
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [usersService]);

  const getUserGroups = useCallback(async (userId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await usersService.getUserGroups(userId);
      setState(prev => ({ 
        ...prev, 
        userGroups: response.data, 
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user groups';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [usersService]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSelectedUser = useCallback(() => {
    setState(prev => ({ ...prev, selectedUser: null }));
  }, []);

  return {
    ...state,
    getAllUsers,
    getUserById,
    getUserGroups,
    clearError,
    clearSelectedUser,
    getCurrentUser,
  };
}; 
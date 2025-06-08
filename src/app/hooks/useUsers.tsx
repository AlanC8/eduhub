'use client';

import { useState, useCallback } from 'react';
import UsersService from '../../service/UsersService';
import { UsersListResponse, UserDetailResponse, UserGroupsResponse, User, Group } from '../../types';

interface UseUsersState {
  users: User[];
  selectedUser: User | null;
  userGroups: Group[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useUsers = () => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    selectedUser: null,
    userGroups: [],
    loading: false,
    error: null,
    total: 0,
  });

  const usersService = UsersService.getInstance();

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
        selectedUser: response.data, 
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
  };
}; 
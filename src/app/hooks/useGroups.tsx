'use client';

import { useState, useCallback } from 'react';
import GroupsSettings from '../../service/GroupsSettings';
import { GroupsListResponse, GroupDetailResponse, GroupCreateRequest, GroupUsersResponse, Group, User } from '../../types';

interface UseGroupsState {
  groups: Group[];
  selectedGroup: Group | null;
  groupUsers: User[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useGroups = () => {
  const [state, setState] = useState<UseGroupsState>({
    groups: [],
    selectedGroup: null,
    groupUsers: [],
    loading: false,
    error: null,
    total: 0,
  });

  const groupsService = GroupsSettings.getInstance();

  const getAllGroups = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await groupsService.getAllGroups();
      setState(prev => ({ 
        ...prev, 
        groups: response.data, 
        total: response.total,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch groups';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [groupsService]);

  const getGroupById = useCallback(async (groupId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await groupsService.getGroupById(groupId);
      setState(prev => ({ 
        ...prev, 
        selectedGroup: response.data, 
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch group';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [groupsService]);

  const createGroup = useCallback(async (groupData: GroupCreateRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await groupsService.createGroup(groupData);
      setState(prev => ({ 
        ...prev, 
        groups: [...prev.groups, response.data],
        total: prev.total + 1,
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create group';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [groupsService]);

  const deleteGroup = useCallback(async (groupId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await groupsService.deleteGroup(groupId);
      setState(prev => ({ 
        ...prev, 
        groups: prev.groups.filter(group => group.group_id !== groupId),
        total: Math.max(0, prev.total - 1),
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete group';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [groupsService]);

  const getGroupUsers = useCallback(async (groupId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await groupsService.getGroupUsers(groupId);
      setState(prev => ({ 
        ...prev, 
        groupUsers: response.data, 
        loading: false 
      }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch group users';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));
      throw error;
    }
  }, [groupsService]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSelectedGroup = useCallback(() => {
    setState(prev => ({ ...prev, selectedGroup: null }));
  }, []);

  return {
    ...state,
    getAllGroups,
    getGroupById,
    createGroup,
    deleteGroup,
    getGroupUsers,
    clearError,
    clearSelectedGroup,
  };
}; 
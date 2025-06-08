import Interceptor from './Interceptor';
import { GroupsListResponse, GroupDetailResponse, GroupCreateRequest, GroupUsersResponse } from '../types';

class GroupsSettings {
  private static instance: GroupsSettings;
  private interceptor = Interceptor.getInstance();

  private constructor() {}

  public static getInstance(): GroupsSettings {
    if (!GroupsSettings.instance) {
      GroupsSettings.instance = new GroupsSettings();
    }
    return GroupsSettings.instance;
  }

  /**
   * Получить список всех групп
   * GET /settings/groups
   */
  public async getAllGroups(): Promise<GroupsListResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<GroupsListResponse>('/settings/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }

  /**
   * Получить группу по ID
   * GET /settings/groups/{id}
   */
  public async getGroupById(groupId: number): Promise<GroupDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<GroupDetailResponse>(`/settings/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Создать новую группу
   * POST /settings/groups
   */
  public async createGroup(groupData: GroupCreateRequest): Promise<GroupDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().post<GroupDetailResponse>('/settings/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  /**
   * Удалить группу
   * DELETE /settings/groups?group_id={id}
   */
  public async deleteGroup(groupId: number): Promise<void> {
    try {
      await this.interceptor.getAxiosInstance().delete(`/settings/groups?group_id=${groupId}`);
    } catch (error) {
      console.error(`Error deleting group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Получить пользователей группы
   * GET /settings/groups/{id}/users
   */
  public async getGroupUsers(groupId: number): Promise<GroupUsersResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<GroupUsersResponse>(`/settings/groups/${groupId}/users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for group ${groupId}:`, error);
      throw error;
    }
  }
}

export default GroupsSettings;

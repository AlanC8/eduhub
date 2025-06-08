import Interceptor from './Interceptor';
import { UsersListResponse, UserDetailResponse, UserGroupsResponse } from '../types';

class UsersService {
  private static instance: UsersService;
  private interceptor = Interceptor.getInstance();

  private constructor() {}

  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  /**
   * Получить список всех пользователей
   * GET /settings/users
   */
  public async getAllUsers(): Promise<UsersListResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<UsersListResponse>('/settings/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Получить пользователя по ID
   * GET /settings/users/{id}
   */
  public async getUserById(userId: number): Promise<UserDetailResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<UserDetailResponse>(`/settings/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Получить группы пользователя
   * GET /settings/users/{id}/groups
   */
  public async getUserGroups(userId: number): Promise<UserGroupsResponse> {
    try {
      const response = await this.interceptor.getAxiosInstance().get<UserGroupsResponse>(`/settings/users/${userId}/groups`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching groups for user ${userId}:`, error);
      throw error;
    }
  }
}

export default UsersService;

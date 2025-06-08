import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Role } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://26.6.110.185:9000';

class Interceptor {
  private static instance: Interceptor;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): Interceptor {
    if (!Interceptor.instance) {
      Interceptor.instance = new Interceptor();
    }
    return Interceptor.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        
        if (token && config.headers) {
          config.headers.Token = token;
          console.log('🔑 Token header set:', `${token.substring(0, 20)}...`);
        } else {
          console.warn('⚠️ No token available for request');
        }
        
        // Логирование исходящего запроса
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
          params: config.params
        });
        
        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Логирование успешного ответа
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
        
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Логирование ошибки
        console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          requestHeaders: originalRequest?.headers
        });
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest) {
          console.error('🚨 401 Unauthorized - Clearing user data and redirecting to login');
          console.error('Token was:', localStorage.getItem('token') ? 'Present' : 'Missing');
          
          // Временно отключаем автоматический редирект для диагностики
          // this.clearUserData();
          // window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public removeToken(): void {
    localStorage.removeItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public setRole(role: Role): void {
    localStorage.setItem('userRole', role);
  }

  public removeRole(): void {
    localStorage.removeItem('userRole');
  }

  public getRole(): Role | null {
    return localStorage.getItem('userRole') as Role;
  }

  public setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  public removeUserId(): void {
    localStorage.removeItem('userId');
  }

  public getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  public clearUserData(): void {
    this.removeToken();
    this.removeRole();
    this.removeUserId();
  }
}

export default Interceptor;

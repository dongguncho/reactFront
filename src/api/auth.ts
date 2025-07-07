import { apiClient } from './axios';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authAPI = {
  // 회원가입
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  // 로그아웃 (클라이언트에서 토큰 제거)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
}; 
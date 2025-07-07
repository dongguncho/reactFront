import { apiClient } from './axios';
import { ApiResponse, User, UpdateUserRequest } from '../types';

export const userAPI = {
  // 내 프로필 조회
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  // 모든 사용자 조회
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  // 특정 사용자 조회
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // 사용자 정보 수정
  updateUser: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const params = new URLSearchParams();
    if (data.name) params.append('name', data.name);
    if (data.email) params.append('email', data.email);
    
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}?${params.toString()}`);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },
}; 
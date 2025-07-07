// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// 사용자 수정 요청 타입
export interface UpdateUserRequest {
  name?: string;
  email?: string;
} 
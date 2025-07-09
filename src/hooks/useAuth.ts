import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest } from '../types';

interface AuthCallbacks {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, login, logout, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { access_token, user } = response.data;
        login(user, access_token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      authAPI.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  const handleLogin = (data: LoginRequest, callbacks?: AuthCallbacks) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          const { access_token, user } = response.data;
          login(user, access_token);
          queryClient.invalidateQueries({ queryKey: ['user'] });
          callbacks?.onSuccess?.();
        }
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  const handleRegister = (data: RegisterRequest, callbacks?: AuthCallbacks) => {
    registerMutation.mutate(data, {
      onSuccess: (response) => {
        console.log('Register response:', response);
        if (response.success && response.data) {
          console.log('Register success - redirecting to login');
          // 회원가입 성공 시 콜백만 실행 (자동 로그인 하지 않음)
          callbacks?.onSuccess?.();
        } else {
          console.log('Register failed - no data in response');
        }
      },
      onError: (error) => {
        console.error('Register error:', error);
        callbacks?.onError?.(error);
      },
    });
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
}; 
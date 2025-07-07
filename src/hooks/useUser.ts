import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/user';
import { UpdateUserRequest } from '../types';

export const useUser = () => {
  const queryClient = useQueryClient();

  // 내 프로필 조회
  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userAPI.getProfile(),
    enabled: !!localStorage.getItem('access_token'),
  });

  // 모든 사용자 조회
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getAllUsers(),
    enabled: !!localStorage.getItem('access_token'),
  });

  // 특정 사용자 조회
  const useGetUserById = (id: string) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: () => userAPI.getUserById(id),
      enabled: !!id && !!localStorage.getItem('access_token'),
    });
  };

  // 사용자 정보 수정
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // 사용자 삭제
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    profile: profileQuery,
    users: usersQuery,
    getUserById: useGetUserById,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}; 
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useAuthStore } from '../store/authStore';

const Profile: React.FC = () => {
  const { profile, updateUser, isUpdating } = useUser();
  const { user, updateUser: updateAuthUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = () => {
    if (user) {
      updateUser(
        { id: user.id, data: editForm },
        {
          onSuccess: (response) => {
            if (response.success && response.data) {
              updateAuthUser(response.data);
              setIsEditing(false);
            }
          },
        }
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  if (profile.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (profile.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">프로필을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  const profileData = profile.data?.data || user;

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">프로필 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                수정
              </button>
            )}
          </div>
        </div>
        
        <div className="px-6 py-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profileData.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                상태
              </label>
              <p className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  profileData.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileData.isActive ? '활성' : '비활성'}
                </span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                가입일
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profileData.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                최종 수정일
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profileData.updatedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
            
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isUpdating ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
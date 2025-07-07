import React from 'react';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          KotlinBack에 오신 것을 환영합니다
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Spring Boot + Kotlin + JPA로 구축된 백엔드 API와 React 프론트엔드입니다.
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="btn btn-primary"
          >
            로그인
          </a>
          <a
            href="/register"
            className="btn btn-secondary"
          >
            회원가입
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          안녕하세요, {user?.name}님!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">
              사용자 관리
            </h2>
            <p className="text-indigo-700 mb-4">
              사용자 목록을 조회하고 관리할 수 있습니다.
            </p>
            <a
              href="/users"
              className="btn btn-primary"
            >
              사용자 목록 보기
            </a>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              프로필 관리
            </h2>
            <p className="text-green-700 mb-4">
              내 프로필 정보를 확인하고 수정할 수 있습니다.
            </p>
            <a
              href="/profile"
              className="btn btn-primary"
            >
              프로필 보기
            </a>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            기술 스택
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">Backend</div>
              <div className="text-sm text-gray-600">Spring Boot + Kotlin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Frontend</div>
              <div className="text-sm text-gray-600">React + TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">State</div>
              <div className="text-sm text-gray-600">Zustand + React Query</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Database</div>
              <div className="text-sm text-gray-600">MySQL + JPA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
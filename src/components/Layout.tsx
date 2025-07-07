import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="header">
        <div className="container">
          <div className="nav">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                KotlinBack
              </Link>
            </div>
            
            {isAuthenticated && (
              <nav className="nav-links">
                <Link
                  to="/"
                  className="nav-link"
                >
                  홈
                </Link>
                <Link
                  to="/users"
                  className="nav-link"
                >
                  사용자 목록
                </Link>
                <Link
                  to="/profile"
                  className="nav-link"
                >
                  프로필
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {user?.name}님
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    로그아웃
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 
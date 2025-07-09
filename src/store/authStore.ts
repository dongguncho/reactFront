import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        console.log('Login called with token:', token ? token.substring(0, 20) + '...' : 'No token');
        set({
          user,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Token saved to localStorage');
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      },
      
      updateUser: (user: User) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
      },

      initializeAuth: () => {
        console.log('initializeAuth called');
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        console.log('initializeAuth - token exists:', !!token);
        console.log('initializeAuth - user exists:', !!userStr);
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('initializeAuth - setting auth state with user:', user);
            set({
              user,
              token,
              isAuthenticated: true,
            });
            console.log('initializeAuth - auth state set successfully');
          } catch (error) {
            console.error('Failed to parse user data:', error);
            get().logout();
          }
        } else {
          console.log('initializeAuth - no token or user found, staying logged out');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 
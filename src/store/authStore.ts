import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  updateUsername as updateUsernameApi,
  updatePassword as updatePasswordApi,
} from '../services/api';
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from '../utils/tokenUtils';
import {
  AuthState,
  LoginRequest,
  RegisterRequest,
  UpdateUsernameRequest,
  UpdatePasswordRequest,
} from '../types/api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUsername: (data: UpdateUsernameRequest) => Promise<void>;
  updatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearError: () => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken(),
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await loginApi(credentials);
          
          if (response.success && response.data) {
            // 토큰 저장
            setAccessToken(response.data.tokens.accessToken);
            setRefreshToken(response.data.tokens.refreshToken);
            
            set({
              loading: false,
              isAuthenticated: true,
              user: response.data.user,
              accessToken: response.data.tokens.accessToken,
              refreshToken: response.data.tokens.refreshToken,
            });
          } else {
            set({
              loading: false,
              error: response.message || '로그인에 실패했습니다.',
            });
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || '로그인에 실패했습니다.',
          });
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await registerApi(userData);
          
          if (response.success && response.data) {
            // 토큰 저장
            setAccessToken(response.data.tokens.accessToken);
            setRefreshToken(response.data.tokens.refreshToken);
            
            set({
              loading: false,
              isAuthenticated: true,
              user: response.data.user,
              accessToken: response.data.tokens.accessToken,
              refreshToken: response.data.tokens.refreshToken,
            });
          } else {
            set({
              loading: false,
              error: response.message || '회원가입에 실패했습니다.',
            });
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || '회원가입에 실패했습니다.',
          });
        }
      },

      fetchCurrentUser: async () => {
        set({ loading: true, error: null });
        try {
          const response = await getCurrentUser();
          
          if (response.success && response.data) {
            set({
              loading: false,
              isAuthenticated: true,
              user: {
                user_id: response.data.user_id,
                username: response.data.username,
                is_active: true,
                created_at: response.data.created_at,
                last_login_at: response.data.last_login_at,
              },
            });
          } else {
            set({
              loading: false,
              error: response.message || '사용자 정보를 가져오는데 실패했습니다.',
            });
          }
        } catch (error: any) {
          clearTokens();
          set({
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            error: error.response?.data?.message || '사용자 정보를 가져오는데 실패했습니다.',
          });
        }
      },

      updateUsername: async (data: UpdateUsernameRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await updateUsernameApi(data);
          
          if (response.success && response.data) {
            set((state) => ({
              loading: false,
              user: state.user ? { ...state.user, username: response.data.username } : null,
            }));
          } else {
            set({
              loading: false,
              error: response.message || '사용자명 변경에 실패했습니다.',
            });
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || '사용자명 변경에 실패했습니다.',
          });
        }
      },

      updatePassword: async (data: UpdatePasswordRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await updatePasswordApi(data);
          
          if (response.success) {
            set({ loading: false });
          } else {
            set({
              loading: false,
              error: response.message || '비밀번호 변경에 실패했습니다.',
            });
          }
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || '비밀번호 변경에 실패했습니다.',
          });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await logoutApi();
          clearTokens();
          set({
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        } catch (error: any) {
          // 로그아웃은 실패해도 로컬 토큰은 삭제
          clearTokens();
          set({
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            error: error.response?.data?.message || '로그아웃에 실패했습니다.',
          });
        }
      },

      updateTokens: (tokens: { accessToken: string; refreshToken: string }) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      resetAuth: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

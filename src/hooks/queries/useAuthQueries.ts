import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  updateUsername as updateUsernameApi,
  updatePassword as updatePasswordApi,
} from '../../services/api';
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
} from '../../utils/tokenUtils';
import { useAuthStore } from '../../store/authStore';
import {
  LoginRequest,
  RegisterRequest,
  UpdateUsernameRequest,
  UpdatePasswordRequest,
} from '../../types/api';

/**
 * 현재 사용자 정보 조회
 */
export const useCurrentUser = () => {
  const accessToken = getAccessToken();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: (failureCount, error: unknown) => {
      // 401 에러인 경우 재시도하지 않음
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401) {
          return false;
        }
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // 토큰이 없으면 쿼리를 완전히 비활성화
    gcTime: 0, // 토큰이 없으면 캐시도 즉시 삭제
  });
};

/**
 * 로그인 뮤테이션
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await loginApi(credentials);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    },
    onSuccess: (data) => {
      // 토큰 저장
      setAccessToken(data.tokens.accessToken);
      setRefreshToken(data.tokens.refreshToken);
      
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(['currentUser'], data.user);
      
      // 쿼리 무효화하여 사용자 정보 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: () => {
      // 로그인 실패 시 토큰 정리
      clearTokens();
    },
  });
};

/**
 * 회원가입 뮤테이션
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await registerApi(userData);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || '회원가입에 실패했습니다.');
      }
    },
    onSuccess: (data) => {
      // 토큰 저장
      setAccessToken(data.tokens.accessToken);
      setRefreshToken(data.tokens.refreshToken);
      
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(['currentUser'], data.user);
      
      // 쿼리 무효화하여 사용자 정보 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: () => {
      // 회원가입 실패 시 토큰 정리
      clearTokens();
    },
  });
};

/**
 * 로그아웃 뮤테이션
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { resetAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await logoutApi();
      return response;
    },
    onSuccess: () => {
      // 토큰 정리
      clearTokens();
      // 인증 상태 초기화
      resetAuth();
      // 모든 쿼리 캐시 무효화
      queryClient.clear();
    },
    onError: (error) => {
      // API 에러가 발생해도 로컬 토큰은 삭제
      console.error('Logout API error:', error);
      clearTokens();
      // 인증 상태 초기화
      resetAuth();
      queryClient.clear();
    },
  });
};

/**
 * 사용자명 변경 뮤테이션
 */
export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUsernameRequest) => {
      const response = await updateUsernameApi(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || '사용자명 변경에 실패했습니다.');
      }
    },
    onSuccess: (data) => {
      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData(['currentUser'], (oldData: unknown) => {
        if (oldData && typeof oldData === 'object') {
          return {
            ...oldData,
            username: data.username,
          };
        }
        return { username: data.username };
      });
    },
  });
};

/**
 * 비밀번호 변경 뮤테이션
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePasswordRequest) => {
      const response = await updatePasswordApi(data);
      
      if (response.success) {
        return response.message || '비밀번호가 성공적으로 변경되었습니다.';
      } else {
        throw new Error(response.message || '비밀번호 변경에 실패했습니다.');
      }
    },
  });
};

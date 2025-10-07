import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  isTokenExpired,
} from '../utils/tokenUtils';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  MeResponse,
  RefreshTokenResponse,
  UpdateUsernameRequest,
  UpdateUsernameResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  LogoutResponse,
  ApiResponse,
} from '../types/api';

// API Base URLs (환경 변수에서 가져오거나 기본값 사용)
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000';
const QUIZ_API_BASE_URL = import.meta.env.VITE_QUIZNOX_API_GATEWAY_URL || 'http://localhost:3000';

// 인증 API용 Axios 인스턴스 생성
const authApiClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 퀴즈/모의고사 API용 Axios 인스턴스 생성
const quizApiClient: AxiosInstance = axios.create({
  baseURL: QUIZ_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중인지 여부 플래그
let isRefreshing = false;
// 토큰 갱신 중 대기 중인 요청들
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * 대기 중인 요청들 처리
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request 인터셉터: 모든 요청에 Access Token 자동 추가
 */
const addAuthHeader = (config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();
  
  if (accessToken && !isTokenExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
};

/**
 * 인증 API용 Request 인터셉터: Access Token 자동 추가
 */
authApiClient.interceptors.request.use(
  addAuthHeader,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 퀴즈 API용 Request 인터셉터: Access Token 자동 추가
 */
quizApiClient.interceptors.request.use(
  addAuthHeader,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 범용 토큰 갱신 함수
 */
const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  apiClient: AxiosInstance
) => {
  if (isRefreshing) {
    // 이미 토큰 갱신 중이면 큐에 추가
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    // Refresh Token이 없으면 로그아웃 처리
    processQueue(new Error('No refresh token'), null);
    clearTokens();
    window.location.href = '/login';
    throw new Error('No refresh token');
  }

  try {
    // 토큰 갱신 요청 (인증 API 사용)
    const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
      `${AUTH_API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      // 새로운 토큰 저장
      setAccessToken(accessToken);
      setRefreshToken(newRefreshToken);

      // 대기 중인 요청들 처리
      processQueue(null, accessToken);

      // 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (refreshError) {
    // 토큰 갱신 실패 시 로그아웃
    processQueue(refreshError as Error, null);
    clearTokens();
    window.location.href = '/login';
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

/**
 * 공통 Response 인터셉터 생성 함수
 */
const createResponseInterceptor = () => {
  return (response: AxiosResponse) => {
    return response;
  };
};

const createErrorInterceptor = (apiClient: AxiosInstance) => {
  return async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, 재시도하지 않은 요청이며, 로그인/회원가입 엔드포인트가 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      try {
        return await handleTokenRefresh(originalRequest, apiClient);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  };
};

/**
 * 인증 API용 Response 인터셉터: 401 에러 시 토큰 갱신 시도
 */
authApiClient.interceptors.response.use(
  createResponseInterceptor(),
  createErrorInterceptor(authApiClient)
);

/**
 * 퀴즈 API용 Response 인터셉터: 401 에러 시 토큰 갱신 시도
 */
quizApiClient.interceptors.response.use(
  createResponseInterceptor(),
  createErrorInterceptor(quizApiClient)
);

// ===== 인증 관련 API (인증 API Gateway 사용) =====

/**
 * 회원가입
 */
export const register = async (userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  const response = await authApiClient.post<ApiResponse<RegisterResponse>>('/auth/register', userData);
  return response.data;
};

/**
 * 로그인
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await authApiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  return response.data;
};

/**
 * 현재 사용자 정보 가져오기
 */
export const getCurrentUser = async (): Promise<ApiResponse<MeResponse>> => {
  const response = await authApiClient.get<ApiResponse<MeResponse>>('/auth/me');
  return response.data;
};

/**
 * 토큰 갱신
 */
export const refreshAccessToken = async (): Promise<ApiResponse<RefreshTokenResponse>> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
    `${AUTH_API_BASE_URL}/auth/refresh`,
    { refreshToken }
  );
  
  return response.data;
};

/**
 * 사용자명 변경
 */
export const updateUsername = async (data: UpdateUsernameRequest): Promise<ApiResponse<UpdateUsernameResponse>> => {
  const response = await authApiClient.put<ApiResponse<UpdateUsernameResponse>>('/auth/username', data);
  return response.data;
};

/**
 * 비밀번호 변경
 */
export const updatePassword = async (data: UpdatePasswordRequest): Promise<ApiResponse<UpdatePasswordResponse>> => {
  const response = await authApiClient.put<ApiResponse<UpdatePasswordResponse>>('/auth/password', data);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  try {
    const refreshToken = getRefreshToken();
    
    // refresh token이 없으면 성공으로 처리 (이미 로그아웃된 상태)
    if (!refreshToken) {
      console.log('Refresh token not found, treating as successful logout');
      return {
        success: true,
        status: 200,
        message: '이미 로그아웃된 상태입니다.',
        data: { message: '이미 로그아웃된 상태입니다.' }
      };
    }

    console.log('Logout API 호출 시작');
    const response = await authApiClient.post<ApiResponse<LogoutResponse>>('/auth/logout', {
      refreshToken
    });
    console.log('Logout API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout API 에러:', error);
    throw error;
  }
};

// ===== 퀴즈/모의고사 관련 API (기존 API Gateway 사용) =====

/**
 * 퀴즈 API 클라이언트 (기존 API와 호환)
 */
export const quizApi = quizApiClient;

/**
 * 인증 API 클라이언트
 */
export const authApi = authApiClient;

// 기본 export는 퀴즈 API 클라이언트 (기존 호환성 유지)
export default quizApiClient;
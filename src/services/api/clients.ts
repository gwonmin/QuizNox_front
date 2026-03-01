import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../../utils/tokenUtils";
import type { ApiResponse, RefreshTokenResponse } from "../../types/api";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:4000";
const QUIZ_API_BASE_URL =
  import.meta.env.VITE_QUIZNOX_API_GATEWAY_URL || "http://localhost:3000";

export const authApiClient: AxiosInstance = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const quizApiClient: AxiosInstance = axios.create({
  baseURL: QUIZ_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
const failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue.length = 0;
};

const addAuthHeader = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  // 토큰이 있으면 항상 헤더에 붙임. 만료됐어도 보내야 백엔드가 401로 응답하고
  // 응답 인터셉터에서 refresh 후 재시도가 가능함. (만료 시에만 생략하면 헤더가 없어 401 시 refresh 로직이 동일하게 동작하지만, 클라이언트 시계 오차 시에도 서버 검증을 받을 수 있음)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApiClient.interceptors.request.use(addAuthHeader, (e: AxiosError) => Promise.reject(e));
quizApiClient.interceptors.request.use(addAuthHeader, (e: AxiosError) => Promise.reject(e));

const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  apiClient: AxiosInstance,
) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    });
  }
  originalRequest._retry = true;
  isRefreshing = true;
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    processQueue(new Error("No refresh token"), null);
    clearTokens();
    window.location.href = "/login";
    throw new Error("No refresh token");
  }
  try {
    const res = await axios.post<ApiResponse<RefreshTokenResponse>>(
      `${AUTH_API_BASE_URL}/auth/refresh`,
      { refreshToken },
    );
    if (res.data.success && res.data.data) {
      const { accessToken, refreshToken: newRT } = res.data.data;
      setAccessToken(accessToken);
      setRefreshToken(newRT);
      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    }
    throw new Error("Token refresh failed");
  } catch (err) {
    processQueue(err as Error, null);
    clearTokens();
    window.location.href = "/login";
    throw err;
  } finally {
    isRefreshing = false;
  }
};

const createErrorInterceptor = (apiClient: AxiosInstance) => {
  return async (error: AxiosError) => {
    const req = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      !req._retry &&
      !req.url?.includes("/auth/login") &&
      !req.url?.includes("/auth/register")
    ) {
      try {
        return await handleTokenRefresh(req, apiClient);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  };
};

authApiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  createErrorInterceptor(authApiClient),
);
quizApiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  createErrorInterceptor(quizApiClient),
);

export { AUTH_API_BASE_URL, QUIZ_API_BASE_URL };

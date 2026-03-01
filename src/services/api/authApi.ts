import { authApiClient } from "./clients";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
  RefreshTokenResponse,
  UpdateUsernameRequest,
  UpdateUsernameResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  LogoutResponse,
} from "../../types/api";
import { getRefreshToken } from "../../utils/tokenUtils";
import { AUTH_API_BASE_URL } from "./clients";
import axios from "axios";

export const register = async (
  userData: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  const res = await authApiClient.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    userData,
  );
  return res.data;
};

export const login = async (
  credentials: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  const res = await authApiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    credentials,
  );
  return res.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<MeResponse>> => {
  const res = await authApiClient.get<ApiResponse<MeResponse>>("/auth/me");
  return res.data;
};

export const refreshAccessToken = async (): Promise<
  ApiResponse<RefreshTokenResponse>
> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");
  const res = await axios.post<ApiResponse<RefreshTokenResponse>>(
    `${AUTH_API_BASE_URL}/auth/refresh`,
    { refreshToken },
  );
  return res.data;
};

export const updateUsername = async (
  data: UpdateUsernameRequest,
): Promise<ApiResponse<UpdateUsernameResponse>> => {
  const res = await authApiClient.put<ApiResponse<UpdateUsernameResponse>>(
    "/auth/username",
    data,
  );
  return res.data;
};

export const updatePassword = async (
  data: UpdatePasswordRequest,
): Promise<ApiResponse<UpdatePasswordResponse>> => {
  const res = await authApiClient.put<ApiResponse<UpdatePasswordResponse>>(
    "/auth/password",
    data,
  );
  return res.data;
};

export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return {
      success: true,
      status: 200,
      message: "이미 로그아웃된 상태입니다.",
      data: { message: "이미 로그아웃된 상태입니다." },
    };
  }
  const res = await authApiClient.post<ApiResponse<LogoutResponse>>(
    "/auth/logout",
    { refreshToken },
  );
  return res.data;
};

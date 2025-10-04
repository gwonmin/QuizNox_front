import { RawQuestion } from "./quiz";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface QuestionResponse {
  questions: RawQuestion[];
}

export interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
}

// ===== 인증 관련 타입 (API 명세 기반) =====

// 사용자 정보
export interface User {
  user_id: string;
  username: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  username_changed_at?: string;
}

// 토큰 정보
export interface Tokens {
  accessToken: string;   // 15분 유효
  refreshToken: string;  // 7일 유효
}

// API 공통 응답 형식
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

// 회원가입 요청
export interface RegisterRequest {
  username: string;  // 3-20자, 영문/숫자/언더스코어만
  password: string;  // 4자 이상
}

// 회원가입 응답
export interface RegisterResponse {
  user: User;
  tokens: Tokens;
}

// 로그인 요청
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

// 내 정보 조회 응답
export interface MeResponse {
  user_id: string;
  username: string;
  created_at: string;
  last_login_at: string;
}

// 토큰 갱신 요청
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 토큰 갱신 응답
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 사용자명 변경 요청
export interface UpdateUsernameRequest {
  newUsername: string;  // 3-20자, 영문/숫자/언더스코어만
  password: string;     // 현재 비밀번호 확인용
}

// 사용자명 변경 응답
export interface UpdateUsernameResponse {
  user_id: string;
  username: string;  // 새로운 사용자명
  username_changed_at: string;
}

// 비밀번호 변경 요청
export interface UpdatePasswordRequest {
  currentPassword: string;  // 현재 비밀번호
  newPassword: string;      // 4자 이상
}

// 비밀번호 변경 응답
export interface UpdatePasswordResponse {
  message: string;
}

// 로그아웃 요청
export interface LogoutRequest {
  refreshToken: string;
}

// 로그아웃 응답
export interface LogoutResponse {
  message: string;
}

// 인증 상태 (Redux용)
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
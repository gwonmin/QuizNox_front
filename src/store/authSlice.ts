import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

// 초기 상태
const initialState: AuthState = {
  user: null,
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

/**
 * 로그인
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      
      if (response.success && response.data) {
        // 토큰 저장
        setAccessToken(response.data.tokens.accessToken);
        setRefreshToken(response.data.tokens.refreshToken);
        
        return response.data;
      } else {
        return rejectWithValue(response.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '로그인에 실패했습니다.'
      );
    }
  }
);

/**
 * 회원가입
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      
      if (response.success && response.data) {
        // 토큰 저장
        setAccessToken(response.data.tokens.accessToken);
        setRefreshToken(response.data.tokens.refreshToken);
        
        return response.data;
      } else {
        return rejectWithValue(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '회원가입에 실패했습니다.'
      );
    }
  }
);

/**
 * 현재 사용자 정보 가져오기 (토큰으로 자동 로그인)
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '사용자 정보를 가져오는데 실패했습니다.');
      }
    } catch (error: any) {
      clearTokens();
      return rejectWithValue(
        error.response?.data?.message || '사용자 정보를 가져오는데 실패했습니다.'
      );
    }
  }
);

/**
 * 사용자명 변경
 */
export const updateUsername = createAsyncThunk(
  'auth/updateUsername',
  async (data: UpdateUsernameRequest, { rejectWithValue }) => {
    try {
      const response = await updateUsernameApi(data);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || '사용자명 변경에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '사용자명 변경에 실패했습니다.'
      );
    }
  }
);

/**
 * 비밀번호 변경
 */
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (data: UpdatePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await updatePasswordApi(data);
      
      if (response.success) {
        return response.message || '비밀번호가 성공적으로 변경되었습니다.';
      } else {
        return rejectWithValue(response.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
      );
    }
  }
);

/**
 * 로그아웃
 */
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    clearTokens();
  } catch (error: any) {
    // 로그아웃은 실패해도 로컬 토큰은 삭제
    clearTokens();
    return rejectWithValue(
      error.response?.data?.message || '로그아웃에 실패했습니다.'
    );
  }
});

// ===== Auth Slice =====

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 토큰 업데이트 (토큰 갱신 시 사용)
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setAccessToken(action.payload.accessToken);
      setRefreshToken(action.payload.refreshToken);
    },
    
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    },
    
    // 인증 상태 초기화
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    // 로그인
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 회원가입
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 현재 사용자 정보 가져오기
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          user_id: action.payload.user_id,
          username: action.payload.username,
          is_active: true,
          created_at: action.payload.created_at,
          last_login_at: action.payload.last_login_at,
        };
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      });

    // 사용자명 변경
    builder
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.username = action.payload.username;
        }
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 비밀번호 변경
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 로그아웃
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { updateTokens, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;

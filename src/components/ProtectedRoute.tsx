import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../hooks/queries/useAuthQueries';
import { getAccessToken, clearTokens } from '../utils/tokenUtils';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, setUser, resetAuth } = useAuthStore();
  const accessToken = getAccessToken();
  
  // TanStack Query로 사용자 정보 가져오기 (토큰이 있을 때만)
  const { data: currentUser, isLoading, error } = useCurrentUser();

  // 사용자 정보가 로드되면 스토어에 저장
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser]);

  // 401 에러인 경우 (토큰 만료) 로그아웃 처리
  useEffect(() => {
    if (error?.response?.status === 401) {
      // 토큰이 만료된 경우 로그아웃 처리
      clearTokens();
      resetAuth();
    }
  }, [error, resetAuth]);

  // 토큰이 없으면 즉시 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 토큰은 있지만 인증 상태가 false인 경우
  if (!isAuthenticated) {
    // 사용자 정보를 가져오는 중이면 로딩 표시
    if (isLoading) {
      return <LoadingSpinner />;
    }
    // 로딩이 끝났는데 인증되지 않았으면 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증은 되었지만 사용자 정보가 없는 경우
  if (!user) {
    // 사용자 정보를 가져오는 중이면 로딩 표시
    if (isLoading) {
      return <LoadingSpinner />;
    }
    // 로딩이 끝났는데 사용자 정보가 없으면 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

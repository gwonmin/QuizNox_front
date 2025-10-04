import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCurrentUser } from '../store/authSlice';
import { getAccessToken } from '../utils/tokenUtils';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  const accessToken = getAccessToken();

  // 토큰은 있지만 사용자 정보가 없는 경우 (페이지 새로고침 등)
  useEffect(() => {
    if (accessToken && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, loading, dispatch]);

  // 로딩 중
  if (loading || (accessToken && !user)) {
    return <LoadingSpinner />;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

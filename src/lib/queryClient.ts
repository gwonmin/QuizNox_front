import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      // 10분간 캐시 유지
      gcTime: 10 * 60 * 1000,
      // 자동 재시도 (3회)
      retry: 3,
      // 재시도 간격 (1초)
      retryDelay: 1000,
      // 윈도우 포커스 시 자동 리페치
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 자동 리페치
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 재시도 (1회)
      retry: 1,
    },
  },
});

/**
 * 에러 처리 유틸리티
 */

/**
 * Axios 에러 응답 타입
 */
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
    status?: number;
  };
}

/**
 * 백엔드에서 반환한 에러 메시지를 추출합니다.
 * @param error - 에러 객체
 * @param defaultMessage - 기본 에러 메시지
 * @returns 에러 메시지
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string
): string => {
  // Axios 에러인 경우 백엔드 응답의 message 추출
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosErrorResponse;
    const backendMessage = axiosError.response?.data?.message;

    if (backendMessage) {
      return backendMessage;
    }
  }

  // 기존 에러 메시지가 있으면 사용
  if (error instanceof Error) {
    return error.message;
  }

  // 기본 메시지 반환
  return defaultMessage;
};

/**
 * Axios 에러인지 확인합니다.
 * @param error - 에러 객체
 * @returns Axios 에러 여부
 */
export const isAxiosError = (error: unknown): error is AxiosErrorResponse => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    error.response !== undefined
  );
};

/**
 * 백엔드 응답에서 메시지를 추출합니다.
 * @param response - API 응답
 * @param defaultMessage - 기본 메시지
 * @returns 메시지
 */
export const extractResponseMessage = <T>(
  response: { success: boolean; message?: string; data?: T },
  defaultMessage: string
): string => {
  return response.message || defaultMessage;
};

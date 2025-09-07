/**
 * 시간 관련 유틸리티 함수들
 */

/**
 * 초를 시간:분:초 형식으로 포맷팅 (타이머용)
 * @param seconds 초
 * @returns "HH:MM:SS" 형식의 문자열
 */
export const formatTimer = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 초를 자연스러운 시간 단위로 포맷팅 (결과 표시용)
 * @param seconds 초
 * @returns "X시간 Y분 Z초" 또는 "Y분 Z초" 또는 "Z초" 형식의 문자열
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  } else {
    return `${remainingSeconds}초`;
  }
};

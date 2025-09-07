import { getExamTypeInfo } from '../constants/examTypes';

/**
 * 시험 관련 유틸리티 함수들
 */

/**
 * 시험 타입 ID를 시험 이름으로 변환
 * @param examType 시험 타입 ID
 * @returns 시험 이름
 */
export const getExamDisplayName = (examType: string): string => {
  const examInfo = getExamTypeInfo(examType);
  return examInfo?.name || "모의고사";
};

/**
 * 시험 타입 ID를 시험 레벨로 변환
 * @param examType 시험 타입 ID
 * @returns 시험 레벨 (Associate, Professional 등)
 */
export const getExamLevel = (examType: string): string => {
  const examInfo = getExamTypeInfo(examType);
  return examInfo?.level || "Associate";
};

/**
 * 시험 기본 정보 객체 생성
 * @param examType 시험 타입 ID
 * @returns 시험 기본 정보 객체
 */
export const getExamBasicInfo = (examType: string) => {
  const examInfo = getExamTypeInfo(examType);
  return {
    name: examInfo?.name || "모의고사",
    level: examInfo?.level || "Associate",
    timeLimit: examInfo?.timeLimit || 180,
    passThreshold: examInfo?.passThreshold || 45,
    questionCount: examType === 'AWS_DOP' ? 75 : 65
  };
};

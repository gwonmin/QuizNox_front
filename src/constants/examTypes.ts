import { ExamType } from "../types/quiz";

export interface ExamTypeInfo {
  id: string;
  name: string;
  shortName: string;
  examType: ExamType;
  timeLimit: number;
  passThreshold: number;
  level: string;
}

export const EXAM_TYPES: Record<string, ExamTypeInfo> = {
  AWS_DVA: {
    id: "AWS_DVA",
    name: "AWS Certified Developer",
    shortName: "Developer Associate",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    level: "Associate",
  },
  AWS_SAA: {
    id: "AWS_SAA",
    name: "AWS Certified Solutions Architect",
    shortName: "Solutions Architect Associate",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    level: "Associate",
  },
  AWS_SOA: {
    id: "AWS_SOA",
    name: "AWS Certified SysOps Administrator",
    shortName: "SysOps Administrator Associate",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    level: "Associate",
  },
  AWS_DOP: {
    id: "AWS_DOP",
    name: "AWS Certified DevOps Engineer",
    shortName: "DevOps Engineer Professional",
    examType: "professional",
    timeLimit: 180,
    passThreshold: 45,
    level: "Professional",
  },
};

// 시험 유형 ID 배열
export const EXAM_TYPE_IDS = Object.keys(EXAM_TYPES);

// 시험 유형 정보 가져오기
export const getExamTypeInfo = (examTypeId: string): ExamTypeInfo | null => {
  return EXAM_TYPES[examTypeId] || null;
};

// 시험 유형 ID로 Redux store용 데이터 생성
export const createExamTypeData = (examTypeId: string) => {
  const examInfo = getExamTypeInfo(examTypeId);
  if (!examInfo) return null;
  
  return {
    examType: examInfo.examType,
    examTypeId: examInfo.id,
    examName: examInfo.name,
    examShortName: examInfo.shortName,
  };
};

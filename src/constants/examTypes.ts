import { ExamType } from "../types/quiz";

export interface ExamTypeInfo {
  id: string;
  name: string;
  shortName: string;
  examCode: string; // 시험 코드 (예: AIF-C01, SAA-C03)
  examType: ExamType;
  timeLimit: number;
  passThreshold: number;
  questionCount: number;
  level: string;
}

// 각 시험 유형별 기본 설정 (시간/합격 기준/문항 수)
export const EXAM_TYPES: Record<string, ExamTypeInfo> = {
  AWS_AIF: {
    id: "AWS_AIF",
    name: "AWS Certified AI Practitioner",
    shortName: "AI Practitioner Foundational",
    examCode: "AIF-C01",
    examType: "foundational",
    timeLimit: 90,
    passThreshold: 45,
    questionCount: 65,
    level: "Foundational",
  },
  AWS_DVA: {
    id: "AWS_DVA",
    name: "AWS Certified Developer",
    shortName: "Developer Associate",
    examCode: "DVA-C02",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    questionCount: 65,
    level: "Associate",
  },
  AWS_SAA: {
    id: "AWS_SAA",
    name: "AWS Certified Solutions Architect",
    shortName: "Solutions Architect Associate",
    examCode: "SAA-C03",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    questionCount: 65,
    level: "Associate",
  },
  AWS_SOA: {
    id: "AWS_SOA",
    name: "AWS Certified SysOps Administrator",
    shortName: "SysOps Administrator Associate",
    examCode: "SOA-C02",
    examType: "associate",
    timeLimit: 130,
    passThreshold: 45,
    questionCount: 65,
    level: "Associate",
  },
  AWS_DOP: {
    id: "AWS_DOP",
    name: "AWS Certified DevOps Engineer",
    shortName: "DevOps Engineer Professional",
    examCode: "DOP-C02",
    examType: "professional",
    timeLimit: 180,
    passThreshold: 45,
    questionCount: 75,
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

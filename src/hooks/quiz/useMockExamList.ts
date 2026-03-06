import { useEffect, useMemo } from "react";
import { useQuizStore } from "../../store/quizStore";
import { EXAM_TYPES } from "../../constants/examTypes";

export interface MockExamListItem {
  id: string;
  name: string;
  shortName: string;
  timeLimit: number;
  description: string;
  passThreshold: number;
  level: string;
}

export function useMockExamList() {
  const setScrollIndex = useQuizStore((state) => state.setScrollIndex);

  useEffect(() => {
    setScrollIndex(0);
  }, [setScrollIndex]);

  const mockExamTypes: MockExamListItem[] = useMemo(
    () =>
      Object.values(EXAM_TYPES).map((exam) => ({
        id: exam.id,
        name: `${exam.level}(${exam.id.replace("AWS_", "")}-C02) 모의고사`,
        shortName: exam.name,
        timeLimit: exam.timeLimit,
        description: `${exam.timeLimit}분, ${exam.questionCount}문제`,
        passThreshold: exam.passThreshold,
        level: exam.level,
      })),
    [],
  );

  return {
    mockExamTypes,
  };
}


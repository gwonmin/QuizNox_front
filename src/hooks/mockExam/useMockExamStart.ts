import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { getExamTypeInfo, createExamTypeData } from "../../constants/examTypes";
import { getExamBasicInfo } from "../../utils/examUtils";

export function useMockExamStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);
  const setExamType = useMockExamStore((state) => state.setExamType);
  const examType = (searchParams.get("type") as string) || "";

  useEffect(() => {
    resetMockExam();
  }, [resetMockExam]);

  const examInfo = getExamTypeInfo(examType);
  const examBasicInfo = getExamBasicInfo(examType);
  const invalid = !examType || !examInfo;

  const goBack = () => navigate("/mock-exam");

  const handleStartExam = () => {
    const examData = createExamTypeData(examType);
    if (examData) {
      setExamType(examData);
    }
    navigate(`/mock-exam/play?type=${examType}`);
  };

  return {
    examType,
    examInfo,
    examBasicInfo,
    invalid,
    goBack,
    handleStartExam,
  };
}

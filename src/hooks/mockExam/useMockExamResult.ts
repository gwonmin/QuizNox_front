import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { useModalScrollLock } from "../useModalScrollLock";
import { getExamDisplayName, getAnswerResultStatus, computeExamResult } from "../../utils/examUtils";
import type { ExamResultState } from "../../types/quiz";

export function useMockExamResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examTypeFromUrl = searchParams.get("type") ?? "";

  const examName = useMockExamStore((state) => state.examName);
  const questions = useMockExamStore((state) => state.questions);
  const answers = useMockExamStore((state) => state.answers);
  const startTime = useMockExamStore((state) => state.startTime);
  const endTime = useMockExamStore((state) => state.endTime);
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);

  const [result, setResult] = useState<ExamResultState | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  useModalScrollLock(selectedQuestion !== null);

  useEffect(() => {
    const handleBeforeUnload = () => resetMockExam();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [resetMockExam]);

  useEffect(() => {
    if (questions && questions.length > 0 && answers && answers.length > 0) {
      const next = computeExamResult(
        questions,
        answers,
        examTypeFromUrl,
        startTime,
        endTime
      );
      setResult(next);
    }
  }, [questions, answers, examTypeFromUrl, startTime, endTime]);

  const handleQuestionClick = useCallback((questionIndex: number) => {
    setSelectedQuestion(questionIndex);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedQuestion(null);
  }, []);

  const goToMockExam = useCallback(() => navigate("/mock-exam"), [navigate]);
  const goToHome = useCallback(() => navigate("/"), [navigate]);

  const hasNoQuestions = !questions || questions.length === 0;
  const hasNoResult = !result;
  const examDisplayName = examName || getExamDisplayName(examTypeFromUrl);

  return {
    result,
    questions: questions ?? [],
    selectedQuestion,
    hasNoQuestions,
    hasNoResult,
    examDisplayName,
    getAnswerResultStatus,
    handleQuestionClick,
    handleCloseModal,
    goToMockExam,
    goToHome,
  };
}

import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { useMockExamQuestions } from "../queries/useQuizQueries";
import { useExamTimer } from "../useExamTimer";
import { useModalScrollLock } from "../useModalScrollLock";
import {
  getExamDisplayName,
  getAnswerStatus,
  getAnsweredQuestionsCount,
  validateExamData,
} from "../../utils/examUtils";

export function useMockExamReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = (searchParams.get("type") as string) || "";

  const questions = useMockExamStore((state) => state.questions);
  const answers = useMockExamStore((state) => state.answers);
  const remainingTime = useMockExamStore((state) => state.remainingTime);
  const isStarted = useMockExamStore((state) => state.isStarted);
  const setAnswer = useMockExamStore((state) => state.setAnswer);
  const setQuestions = useMockExamStore((state) => state.setQuestions);
  const submitExam = useMockExamStore((state) => state.submitExam);

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const { data: mockExamQuestions, isPending: isLoadingQuestions } =
    useMockExamQuestions(examType);

  useEffect(() => {
    if (
      (!questions || questions.length === 0) &&
      mockExamQuestions &&
      mockExamQuestions.length > 0
    ) {
      setQuestions(mockExamQuestions);
    }
  }, [questions, mockExamQuestions, setQuestions]);

  useExamTimer({
    isStarted,
    remainingTime,
    onTimeExpired: () => navigate(`/mock-exam/result?type=${examType}`),
  });

  const answeredQuestions = getAnsweredQuestionsCount(answers);
  useModalScrollLock(selectedQuestion !== null);

  const handleQuestionClick = useCallback((questionIndex: number) => {
    setSelectedQuestion(questionIndex);
    const currentAnswer = answers[questionIndex];
    setSelectedAnswers(currentAnswer ? currentAnswer.split("") : []);
  }, [answers]);

  const handleCloseModal = useCallback(() => {
    setSelectedQuestion(null);
    setSelectedAnswers([]);
  }, []);

  const handleAnswerToggle = useCallback((answer: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(answer)
        ? prev.filter((ans) => ans !== answer)
        : [...prev, answer]
    );
  }, []);

  const handleSaveAnswer = useCallback(() => {
    if (selectedQuestion !== null) {
      const answerString =
        selectedAnswers.length > 0 ? selectedAnswers.join("") : null;
      setAnswer(selectedQuestion, answerString);
      handleCloseModal();
    }
  }, [selectedQuestion, selectedAnswers, setAnswer, handleCloseModal]);

  const handleSubmitExam = useCallback(() => {
    submitExam();
    navigate(`/mock-exam/result?type=${examType}`);
  }, [submitExam, navigate, examType]);

  const { isValid } = validateExamData(questions ?? [], answers);

  const showLoading =
    isLoadingQuestions || !isValid;
  const showError =
    !isLoadingQuestions &&
    !isValid &&
    (!mockExamQuestions || mockExamQuestions.length === 0);

  const goBack = useCallback(() => navigate("/mock-exam"), [navigate]);

  return {
    examType,
    questions: questions ?? [],
    answers,
    remainingTime,
    answeredQuestions,
    selectedQuestion,
    selectedAnswers,
    showLoading,
    showError,
    goBack,
    handleQuestionClick,
    handleCloseModal,
    handleAnswerToggle,
    handleSaveAnswer,
    handleSubmitExam,
    getAnswerStatus,
    getExamDisplayName,
  };
}

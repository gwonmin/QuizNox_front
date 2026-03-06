import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { useMockExamQuestions } from "../queries/useQuizQueries";
import { useExamTimer } from "../useExamTimer";
import { EXAM_TYPE_IDS } from "../../constants/examTypes";
import {
  getExamBasicInfo,
  getAnsweredQuestionsCount,
} from "../../utils/examUtils";

export function useMockExamPlay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("type") as string;

  const remainingTime = useMockExamStore((state) => state.remainingTime);
  const currentQuestionIndex = useMockExamStore(
    (state) => state.currentQuestionIndex,
  );
  const answers = useMockExamStore((state) => state.answers);
  const questions = useMockExamStore((state) => state.questions);
  const isStarted = useMockExamStore((state) => state.isStarted);
  const isSubmitted = useMockExamStore((state) => state.isSubmitted);
  const startExam = useMockExamStore((state) => state.startExam);
  const setAnswer = useMockExamStore((state) => state.setAnswer);
  const setCurrentQuestionIndex = useMockExamStore(
    (state) => state.setCurrentQuestionIndex,
  );
  const setQuestions = useMockExamStore((state) => state.setQuestions);
  const resetMockExam = useMockExamStore((state) => state.resetMockExam);

  const {
    data: mockExamQuestions,
    isPending: isLoading,
    error,
  } = useMockExamQuestions(examType || "");

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const loadedExamType = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);
  const isReviewingRef = useRef(false);

  // 시험 타입 검증 및 문제 로드
  useEffect(() => {
    const validExamTypes = EXAM_TYPE_IDS;
    if (!examType || !validExamTypes.includes(examType)) {
      navigate("/mock-exam");
      return;
    }

    if (
      mockExamQuestions &&
      mockExamQuestions.length > 0 &&
      loadedExamType.current !== examType
    ) {
      setQuestions(mockExamQuestions);
      loadedExamType.current = examType;
    }
  }, [examType, navigate, mockExamQuestions, setQuestions]);

  // 언마운트 시 시험 데이터 초기화 (조건부)
  useEffect(() => {
    return () => {
      const store = useMockExamStore.getState();

      if (
        isSubmittingRef.current ||
        store.isSubmitted ||
        isReviewingRef.current
      ) {
        return;
      }

      if (store.isStarted && !store.isSubmitted) {
        resetMockExam();
      }
    };
  }, [resetMockExam]);

  // 다른 페이지로 이동할 때, 검토 완료 후 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSubmitted && !isReviewingRef.current) {
        resetMockExam();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted, resetMockExam]);

  // 문제 로드 완료 시 현재 문제 답안 복원
  useEffect(() => {
    if (questions && questions.length > 0) {
      const currentAnswer = answers[currentQuestionIndex];
      if (currentAnswer) {
        setSelectedAnswers(currentAnswer.split(""));
      } else {
        setSelectedAnswers([]);
      }
    }
    // answers는 store에서 관리되므로, 무한 루프 방지를 위해 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, currentQuestionIndex]);

  // 타이머 관리
  useExamTimer({
    isStarted,
    remainingTime,
    onTimeExpired: () => navigate(`/mock-exam/review?type=${examType}`),
  });

  // 브라우저 새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !isSubmitted) {
        e.preventDefault();
        e.returnValue =
          "시험이 진행 중입니다. 정말로 페이지를 떠나시겠습니까?";
        return "시험이 진행 중입니다. 정말로 페이지를 떠나시겠습니까?";
      }
    };

    if (isStarted && !isSubmitted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isStarted, isSubmitted]);

  const handleStartExam = useCallback(() => {
    startExam();
  }, [startExam]);

  const handleAnswerToggle = useCallback((choice: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = prev.includes(choice)
        ? prev.filter((ans) => ans !== choice)
        : [...prev, choice];

      return newAnswers;
    });
  }, []);

  // selectedAnswers 변경 시 store에 동기화
  useEffect(() => {
    const answerString =
      selectedAnswers.length > 0 ? selectedAnswers.join("") : null;
    setAnswer(currentQuestionIndex, answerString);
  }, [selectedAnswers, currentQuestionIndex, setAnswer]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswers(prevAnswer ? prevAnswer.split("") : []);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex, answers]);

  const handleNextQuestion = useCallback(() => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextAnswer = answers[currentQuestionIndex + 1];
      setSelectedAnswers(nextAnswer ? nextAnswer.split("") : []);
    }
  }, [currentQuestionIndex, questions, setCurrentQuestionIndex, answers]);

  useEffect(() => {
    if (isSubmitted) {
      navigate(`/mock-exam/result?type=${examType}`);
    }
  }, [isSubmitted, navigate, examType]);

  const examInfo = getExamBasicInfo(examType);
  const answeredQuestions = getAnsweredQuestionsCount(answers);
  const currentQuestion =
    questions && questions.length > 0
      ? questions[currentQuestionIndex]
      : undefined;

  return {
    examType,
    isLoading,
    error,
    isStarted,
    isSubmitted,
    remainingTime,
    currentQuestionIndex,
    questions,
    currentQuestion,
    selectedAnswers,
    examInfo,
    answeredQuestions,
    isReviewingRef,
    handleStartExam,
    handleAnswerToggle,
    handlePreviousQuestion,
    handleNextQuestion,
  };
}


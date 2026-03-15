import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";
import { useAuthStore } from "../../store/authStore";
import { useQuestions, useSaveProgress } from "../queries/useQuizQueries";
import { QUIZ_TOPICS } from "./useQuizTopic";

export function useQuizPlay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = Number(searchParams.get("q"));
  const topicId = searchParams.get("topicId");

  const setScrollIndex = useQuizStore((state) => state.setScrollIndex);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: saveProgressMutate } = useSaveProgress();

  const {
    data: questions = [],
    isLoading: loading,
    error,
  } = useQuestions(topicId || "");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerToast, setAnswerToast] = useState(false);
  const [answerToastVisible, setAnswerToastVisible] = useState(false);
  const [answerMessage, setAnswerMessage] = useState("");
  const [answerType, setAnswerType] = useState<"correct" | "incorrect">(
    "correct",
  );

  useEffect(() => {
    if (!q || !questions.length) return;
    const index = questions.findIndex((qz) => qz.questionNumber === q);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [q, questions]);

  const currentQuestion = questions[currentIndex];

  const saveCurrentProgress = useCallback(() => {
    if (!isAuthenticated || !topicId || !currentQuestion) return;
    const topicName =
      QUIZ_TOPICS.find((t) => t.id === topicId)?.shortName ?? topicId;
    saveProgressMutate({
      topicId,
      questionNumber: currentQuestion.questionNumber,
      topicName,
    });
  }, [isAuthenticated, topicId, currentQuestion, saveProgressMutate]);

  const handleAnswerToggle = useCallback((choice: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(choice)
        ? prev.filter((ans) => ans !== choice)
        : [...prev, choice],
    );
  }, []);

  const checkAnswer = useCallback(() => {
    if (!currentQuestion) return;

    let correctAnswers: string[];
    if (Array.isArray(currentQuestion.mostVotedAnswer)) {
      correctAnswers = currentQuestion.mostVotedAnswer;
    } else if (typeof currentQuestion.mostVotedAnswer === "string") {
      correctAnswers = currentQuestion.mostVotedAnswer.split("");
    } else {
      correctAnswers = [];
    }

    const isAnswerCorrect =
      selectedAnswers.length > 0 &&
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((answer) => correctAnswers.includes(answer)) &&
      correctAnswers.every((answer) => selectedAnswers.includes(answer));

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setAnswerMessage("🎉 정답입니다!");
      setAnswerType("correct");
    } else {
      const answerCount = correctAnswers.length;
      const message =
        answerCount === 1
          ? `❌ 틀렸습니다. 정답: ${correctAnswers[0]}`
          : `❌ 틀렸습니다. 정답: ${correctAnswers.join(", ")} (${answerCount}개 선택 필요)`;

      setAnswerMessage(message);
      setAnswerType("incorrect");
    }

    setAnswerToast(true);
    setAnswerToastVisible(true);
    saveCurrentProgress();

    setTimeout(() => {
      setAnswerToastVisible(false);
      setTimeout(() => setAnswerToast(false), 300);
    }, 3000);
  }, [selectedAnswers, currentQuestion, saveCurrentProgress]);

  const resetState = useCallback(() => {
    setIsCorrect(null);
    setSelectedAnswers([]);
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    const newQuestionNumber = questions[newIndex]?.questionNumber;

    if (newQuestionNumber) {
      navigate(`/quiz/play?topicId=${topicId}&q=${newQuestionNumber}`, {
        replace: true,
      });
      setCurrentIndex(newIndex);
      setScrollIndex(newIndex);
      resetState();
    }
  }, [currentIndex, questions, topicId, navigate, setScrollIndex, resetState]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      const newQuestionNumber = questions[newIndex]?.questionNumber;

      if (newQuestionNumber) {
        navigate(`/quiz/play?topicId=${topicId}&q=${newQuestionNumber}`, {
          replace: true,
        });
        setCurrentIndex(newIndex);
        setScrollIndex(newIndex);
        resetState();
        document.documentElement.scrollTo({ top: 0 });
      }
    }
  }, [currentIndex, questions, topicId, navigate, setScrollIndex, resetState]);

  const goToList = useCallback(() => {
    if (!topicId) return;
    navigate(`/quiz/list?topicId=${topicId}`);
  }, [navigate, topicId]);

  return {
    questions,
    loading,
    error,
    currentQuestion,
    currentIndex,
    selectedAnswers,
    isCorrect,
    answerToast,
    answerToastVisible,
    answerMessage,
    answerType,
    handleAnswerToggle,
    checkAnswer,
    handlePreviousQuestion,
    handleNextQuestion,
    setAnswerToastVisible,
    setAnswerToast,
    goToList,
  };
}


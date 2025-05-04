import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setScrollIndex } from "../../store/quizSlice";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorBoundary } from "../../components/ErrorBoundary";

/**
 * 퀴즈 플레이 페이지 컴포넌트
 * @returns {JSX.Element} 퀴즈 플레이 페이지 컴포넌트
 */
export default function QuizPlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = Number(searchParams.get("q"));
  const topicId = searchParams.get("topicId");

  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.quiz.questions);
  const loading = useSelector((state: RootState) => state.quiz.loading);
  const error = useSelector((state: RootState) => state.quiz.error);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!q || !questions.length) return;
    const index = questions.findIndex((qz) => qz.questionNumber === q);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [q, questions]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerToggle = useCallback((choice: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(choice)
        ? prev.filter((ans) => ans !== choice)
        : [...prev, choice]
    );
  }, []);

  const checkAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const isCorrect =
      selectedAnswers.length > 0 &&
      selectedAnswers.every((answer) =>
        currentQuestion.mostVotedAnswer.includes(answer)
      ) &&
      currentQuestion.mostVotedAnswer.length === selectedAnswers.length;

    setIsCorrect(isCorrect);
    setShowAnswer(true);
  }, [selectedAnswers, currentQuestion]);

  const resetState = useCallback(() => {
    setShowAnswer(false);
    setIsCorrect(null);
    setSelectedAnswers([]);
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    dispatch(setScrollIndex(currentIndex - 1));
    resetState();
  }, [currentIndex, dispatch, resetState]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      dispatch(setScrollIndex(currentIndex + 1));
      resetState();
      document.documentElement.scrollTo({ top: 0 });
    }
  }, [currentIndex, questions.length, dispatch, resetState]);

  if (loading === "loading") {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }

  if (!questions.length) {
    return <p className="text-center p-4">문제 데이터가 없습니다.</p>;
  }

  if (!currentQuestion) {
    return <p className="text-center p-4">문제 데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <ErrorBoundary>
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
            className="text-xl disabled:opacity-30 border rounded-md p-1 bg-gray-300"
            aria-label="이전 문제"
          >
            ←
          </button>

          <button
            onClick={() => navigate(`/quiz/list?topicId=${topicId}`)}
            className="text-blue-600 underline"
            aria-label="문제 목록으로 돌아가기"
          >
            문제 목록으로 돌아가기
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="text-xl disabled:opacity-30 border rounded-md p-1 bg-gray-300"
            aria-label="다음 문제"
          >
            →
          </button>
        </div>

        <h1 className="text-base md:text-lg font-semibold leading-relaxed mb-4">
          {currentQuestion.questionNumber}. {currentQuestion.questionText}
        </h1>

        <div className="flex flex-col gap-2">
          {currentQuestion.choices.map((choice, index) => {
            const answer = choice.substring(0, 1);
            const text = choice.substring(2);
            return (
              <button
                key={index}
                onClick={() => handleAnswerToggle(answer)}
                className={`flex items-center p-2 border rounded-md text-left ${
                  selectedAnswers.includes(answer)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                aria-label={`${answer}번 선택지: ${text}`}
              >
                <span className="font-semibold mr-2">{answer}</span>
                <span className="flex-1">{text}</span>
              </button>
            );
          })}
        </div>

        {showAnswer && (
          <div
            className={`mt-4 p-3 rounded-md text-center font-semibold shadow ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isCorrect
              ? "정답입니다! 🎉"
              : `틀렸습니다. 정답: ${currentQuestion.mostVotedAnswer}`}
          </div>
        )}

        <div className="mt-3 flex justify-center">
          {isCorrect ? (
            <button
              onClick={handleNextQuestion}
              disabled={currentIndex === questions.length - 1}
              className="p-3 bg-green-500 text-white rounded-md disabled:opacity-40"
              aria-label="다음 문제로 이동"
            >
              다음 문제
            </button>
          ) : (
            <button
              onClick={checkAnswer}
              className="p-3 bg-yellow-500 text-white rounded-md disabled:opacity-40"
              disabled={selectedAnswers.length === 0}
              aria-label="정답 확인"
            >
              정답 확인
            </button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

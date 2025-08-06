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
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

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

  const copyGPTExplanationPrompt = useCallback(async () => {
    if (!currentQuestion) return;

    const prompt = `다음 문제에 대해 한국어로 자세한 해설을 부탁드립니다:

문제: ${currentQuestion.questionNumber}. ${currentQuestion.questionText}

보기:
${currentQuestion.choices.map((choice) => {
  const answer = choice.substring(0, 1);
  const text = choice.substring(2);
  return `${answer}. ${text}`;
}).join('\n')}

위 문제에 대해 다음을 포함한 상세한 해설을 한국어로 제공해주세요:
1. 문제의 핵심 개념 설명
2. 각 보기별 분석
3. 정답이 되는 이유
4. 오답이 되는 이유
5. 관련 개념이나 추가 설명이 필요한 경우`;

    try {
      await navigator.clipboard.writeText(prompt);
      setShowToast(true);
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => setShowToast(false), 300);
      }, 3000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      // 폴백: textarea를 사용한 복사
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowToast(true);
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => setShowToast(false), 300);
      }, 3000);
    }
  }, [currentQuestion]);

  const dismissToast = useCallback(() => {
    setToastVisible(false);
    setTimeout(() => setShowToast(false), 300);
  }, []);

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

        <div className="mt-3 relative">
          <div className="flex justify-center">
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

          {/* GPT 해설 요청 버튼 - 오른쪽 구석 */}
          <button
            onClick={copyGPTExplanationPrompt}
            className="absolute top-0 right-0 p-2 rounded-md text-white transition-colors bg-purple-600 hover:bg-purple-700"
            aria-label="GPT 해설 요청 프롬프트 복사"
            title="GPT 해설 요청 프롬프트 복사"
          >
            <span className="text-lg">📋</span>
          </button>
        </div>
      </div>

      {/* 토스트 알림 */}
      {showToast && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={dismissToast}
        >
          <div className={`bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ease-out ${
            toastVisible 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  해설용 프롬프트 클립보드 복사 완료.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ChatGPT에 붙여넣기 하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

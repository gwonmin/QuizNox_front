import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";
import { useQuestions } from "../../hooks/queries/useQuizQueries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";
import { GPTExplanationButton } from "../../components/GPTExplanationButton";
import { QuestionDisplay } from "../../components/QuestionDisplay";

/**
 * 퀴즈 플레이 페이지 컴포넌트
 * @returns {JSX.Element} 퀴즈 플레이 페이지 컴포넌트
 */
export default function QuizPlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = Number(searchParams.get("q"));
  const topicId = searchParams.get("topicId");

  const { setScrollIndex } = useQuizStore();
  
  // TanStack Query로 문제 데이터 가져오기
  const {
    data: questions = [],
    isLoading: loading,
    error,
  } = useQuestions(topicId || '');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerToast, setAnswerToast] = useState(false);
  const [answerToastVisible, setAnswerToastVisible] = useState(false);
  const [answerMessage, setAnswerMessage] = useState("");
  const [answerType, setAnswerType] = useState<"correct" | "incorrect">("correct");

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

    // 정답이 배열인지 문자열인지 확인하고 안전하게 처리
    let correctAnswers: string[];
    if (Array.isArray(currentQuestion.mostVotedAnswer)) {
      correctAnswers = currentQuestion.mostVotedAnswer;
    } else if (typeof currentQuestion.mostVotedAnswer === 'string') {
      // 'BD' 같은 문자열을 ['B', 'D']로 분리
      correctAnswers = currentQuestion.mostVotedAnswer.split('');
    } else {
      // 예상치 못한 타입인 경우 빈 배열로 처리
      correctAnswers = [];
    }
    

    
    // 선택한 답안과 정답 비교
    const isCorrect =
      selectedAnswers.length > 0 &&
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((answer) => correctAnswers.includes(answer)) &&
      correctAnswers.every((answer) => selectedAnswers.includes(answer));

    setIsCorrect(isCorrect);
    
    // 정답 여부에 따른 메시지와 토스트 설정
    if (isCorrect) {
      setAnswerMessage("🎉 정답입니다!");
      setAnswerType("correct");
    } else {
      // 정답 개수에 따른 메시지 조정
      const answerCount = correctAnswers.length;
      let message = "";
      
      if (answerCount === 1) {
        message = `❌ 틀렸습니다. 정답: ${correctAnswers[0]}`;
      } else {
        message = `❌ 틀렸습니다. 정답: ${correctAnswers.join(', ')} (${answerCount}개 선택 필요)`;
      }
      
      setAnswerMessage(message);
      setAnswerType("incorrect");
    }
    
    // 정답 토스트 표시
    setAnswerToast(true);
    setAnswerToastVisible(true);
    
    // 3초 후 토스트 숨김
    setTimeout(() => {
      setAnswerToastVisible(false);
      setTimeout(() => setAnswerToast(false), 300);
    }, 3000);
  }, [selectedAnswers, currentQuestion]);

  const resetState = useCallback(() => {
    setIsCorrect(null);
    setSelectedAnswers([]);
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    const newQuestionNumber = questions[newIndex]?.questionNumber;
    
    if (newQuestionNumber) {
      // URL 업데이트 (화면 깜박임 없음)
      navigate(`/quiz/play?topicId=${topicId}&q=${newQuestionNumber}`, { replace: true });
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
        // URL 업데이트 (화면 깜박임 없음)
        navigate(`/quiz/play?topicId=${topicId}&q=${newQuestionNumber}`, { replace: true });
        setCurrentIndex(newIndex);
        setScrollIndex(newIndex);
        resetState();
        document.documentElement.scrollTo({ top: 0 });
      }
    }
  }, [currentIndex, questions, topicId, navigate, setScrollIndex, resetState]);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="p-4 text-center text-destructive">{error.message}</p>;
  }

  if (!questions.length) {
    return <p className="text-center p-4 text-muted-foreground">문제 데이터가 없습니다.</p>;
  }

  if (!currentQuestion) {
    return <p className="text-center p-4 text-muted-foreground">문제 데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* 헤더 영역 */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-2">
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              variant="outline"
              size="sm"
              className="text-sm disabled:opacity-30"
              aria-label="이전 문제"
            >
              ← 이전
            </Button>

            <Button
              onClick={() => navigate(`/quiz/list?topicId=${topicId}`)}
              variant="ghost"
              size="sm"
              className="text-primary text-sm"
              aria-label="문제 목록으로 돌아가기"
            >
              목록
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={currentIndex === questions.length - 1}
              variant="outline"
              size="sm"
              className="text-sm disabled:opacity-30"
              aria-label="다음 문제"
            >
              다음 →
            </Button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-4 py-4">
          <QuestionDisplay
            question={currentQuestion}
            correctAnswer={currentQuestion.mostVotedAnswer}
            selectedAnswers={selectedAnswers}
            isCorrect={isCorrect}
            onAnswerToggle={handleAnswerToggle}
          />

          {/* 정답 결과 섹션 제거 - 토스트로 대체 */}

          {/* 액션 버튼들 */}
          <div className="mt-3 relative">
            {/* 메인 액션 버튼 */}
            <div className="flex justify-center">
              {isCorrect !== null ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questions.length - 1}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-40"
                  aria-label="다음 문제로 이동"
                >
                  다음 문제
                </Button>
              ) : (
                <Button
                  onClick={checkAnswer}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-40"
                  disabled={selectedAnswers.length === 0}
                  aria-label="정답 확인"
                >
                  정답 확인
                </Button>
              )}
            </div>

            {/* GPT 해설 요청 버튼 - 오른쪽 구석 */}
            <div className="absolute top-0 right-0">
              <GPTExplanationButton
                question={{
                  questionNumber: currentQuestion.questionNumber,
                  questionText: currentQuestion.questionText,
                  choices: currentQuestion.choices
                }}
                correctAnswer={currentQuestion.mostVotedAnswer}
                userAnswer={selectedAnswers.join("") || null}
              />
            </div>
          </div>
        </div>


        {/* 정답 확인 결과 토스트 */}
        {answerToast && (
          <div 
            className="fixed top-20 left-4 right-4 z-50"
            onClick={() => {
              setAnswerToastVisible(false);
              setTimeout(() => setAnswerToast(false), 300);
            }}
          >
            <div className={`transform transition-all duration-300 ease-out ${
              answerToastVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2'
            }`}>
              <div className={`mx-auto max-w-sm px-4 py-3 rounded-lg shadow-lg text-center font-medium ${
                answerType === "correct"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {answerMessage}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

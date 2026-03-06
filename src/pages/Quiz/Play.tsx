import { useQuizPlay } from "../../hooks/quiz/useQuizPlay";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";
import { GPTExplanationButton } from "../../components/GPTExplanationButton";
import { QuestionDisplay } from "../../components/QuestionDisplay";

/**
 * 퀴즈 플레이 페이지 컴포넌트
 * @returns {JSX.Element} 퀴즈 플레이 페이지 컴포넌트
 */
export default function QuizPlayPage() {
  const {
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
  } = useQuizPlay();


  if (loading) {
    return (
      <>
        <LoadingOverlay show={true} />
      </>
    );
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
          <div className="flex justify-between items-center gap-2">
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

            <div className="flex items-center gap-2">
              <Button
                onClick={goToList}
                variant="ghost"
                size="sm"
                className="text-primary text-sm"
                aria-label="문제 목록으로 돌아가기"
              >
                목록
              </Button>
            </div>

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
                  choices: currentQuestion.choices,
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

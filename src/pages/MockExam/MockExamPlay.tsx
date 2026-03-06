import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamProgress } from "../../components/ExamProgress";
import { useMockExamPlay } from "../../hooks/mockExam/useMockExamPlay";
import { getExamDisplayName } from "../../utils/examUtils";

export default function MockExamPlay() {
  const navigate = useNavigate();
  const {
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
  } = useMockExamPlay();

  if (isLoading) {
    return (
      <>
        <LoadingOverlay show={true} />
      </>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-4">
          {error.message || "문제를 불러오는데 실패했습니다."}
        </p>
        <Button onClick={() => navigate("/mock-exam")}>
          모의고사 선택으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="text-center p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">모의고사 준비 완료</h1>
        <p className="text-muted-foreground mb-6">
          {getExamDisplayName(examType)} 모의고사를 시작하시겠습니까?
        </p>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2">시험 정보</h3>
            <ul className="text-sm space-y-1">
              <li>• 총 문제 수: {examInfo.questionCount}문제</li>
              <li>• 시험 시간: {examInfo.timeLimit}분</li>
              <li>• 합격 기준: {examInfo.passThreshold}문제 이상 정답</li>
            </ul>
          </div>
          <Button
            onClick={handleStartExam}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            시험 시작
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">시험 제출 완료</h1>
        <p className="text-muted-foreground mb-6">
          시험이 제출되었습니다. 결과를 확인하시겠습니까?
        </p>
        <Button
          onClick={() => navigate(`/mock-exam/result?type=${examType}`)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          결과 확인
        </Button>
      </div>
    );
  }

  // 문제가 로드되지 않았거나 현재 문제가 없는 경우
  if (
    !questions ||
    questions.length === 0 ||
    !questions[currentQuestionIndex]
  ) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">문제를 불러오는 중입니다...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* 시험 진행도 */}
        <ExamProgress
          examType={examType}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions ? questions.length : 0}
          remainingTime={remainingTime}
          answeredQuestions={answeredQuestions}
        />

        {/* 네비게이션 버튼들 */}
        <div className="flex gap-3">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1"
          >
            ← 이전
          </Button>

          {questions && currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={() => {
                isReviewingRef.current = true;
                navigate(`/mock-exam/review?type=${examType}`);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              검토하기
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1">
              다음 →
            </Button>
          )}
        </div>
        {/* 메인 콘텐츠 */}
        <div className="px-4 py-4">
          <QuestionDisplay
            question={currentQuestion!}
            correctAnswer={currentQuestion!.mostVotedAnswer}
            selectedAnswers={selectedAnswers}
            onAnswerToggle={handleAnswerToggle}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

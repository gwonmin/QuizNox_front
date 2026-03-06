import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { GPTExplanationButton } from "../../components/GPTExplanationButton";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamDataError } from "../../components/ExamDataError";
import { formatDuration } from "../../utils/timeUtils";
import { useMockExamResult } from "../../hooks/mockExam/useMockExamResult";

export default function MockExamResultPage() {
  const {
    result,
    questions,
    selectedQuestion,
    hasNoQuestions,
    hasNoResult,
    examDisplayName,
    getAnswerResultStatus,
    handleQuestionClick,
    handleCloseModal,
    goToMockExam,
    goToHome,
  } = useMockExamResult();

  if (hasNoQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            시험 데이터 없음
          </h1>
          <p className="text-muted-foreground mb-6">
            시험 문제를 찾을 수 없습니다. 다시 시험을 시작해주세요.
          </p>
          <Button onClick={goToMockExam}>모의고사 선택으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  if (hasNoResult) {
    return (
      <ExamDataError
        onGoBack={goToMockExam}
        goBackText="모의고사 선택으로 돌아가기"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">시험 결과</h1>
          <p className="text-muted-foreground">{examDisplayName}</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">시험 결과 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-primary">
                  {result!.score} / {result!.totalQuestions}
                </div>
                <p className="text-muted-foreground">정답 수</p>
                <Badge
                  variant={result!.isPassed ? "default" : "destructive"}
                  className="mt-2"
                >
                  {result!.isPassed ? "합격" : "불합격"}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>정답:</span>
                  <span className="font-semibold text-green-600">
                    {result!.correctAnswers}문제
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>오답:</span>
                  <span className="font-semibold text-red-600">
                    {result!.incorrectAnswers}문제
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>미답:</span>
                  <span className="font-semibold text-gray-600">
                    {result!.unansweredQuestions}문제
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>소요 시간:</span>
                  <span className="font-semibold">
                    {formatDuration(result!.timeSpent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>합격 기준:</span>
                  <span className="font-semibold">
                    {result!.passThreshold}문제 이상
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>문제별 상세 결과 (클릭하여 상세 내용 확인)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {result!.answerDetails.map((detail, index) => {
                const answerStatus = getAnswerResultStatus(
                  detail.userAnswer,
                  detail.correctAnswer
                );
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      answerStatus.status === "unanswered"
                        ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        : answerStatus.status === "correct"
                          ? "border-green-200 bg-green-50 hover:bg-green-100"
                          : "border-red-200 bg-red-50 hover:bg-red-100"
                    }`}
                    onClick={() => handleQuestionClick(detail.questionIndex)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm font-medium">
                        {detail.questionIndex + 1}
                      </span>
                      <Badge
                        variant={answerStatus.variant}
                        className="text-xs px-2 py-1"
                      >
                        {answerStatus.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={goToMockExam}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            다른 모의고사 보기
          </Button>
          <Button onClick={goToHome} className="flex-1 sm:flex-none">
            홈으로 돌아가기
          </Button>
        </div>
      </div>

      {selectedQuestion !== null && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  문제 {selectedQuestion + 1}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  닫기
                </Button>
              </div>

              {(() => {
                const detail = result.answerDetails[selectedQuestion];
                return (
                  <div className="space-y-4">
                    <QuestionDisplay
                      question={{
                        questionNumber: selectedQuestion + 1,
                        questionText: detail.question,
                        choices: detail.choices,
                        mostVotedAnswer: detail.correctAnswer,
                      }}
                      correctAnswer={detail.correctAnswer}
                      userAnswer={detail.userAnswer}
                      showAnswer={true}
                      disabled={true}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">정답:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {detail.correctAnswer}
                          </span>
                        </div>
                        {detail.userAnswer ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">내 답:</span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {detail.userAnswer}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">미답</span>
                        )}
                      </div>
                      <GPTExplanationButton
                        question={{
                          questionNumber: selectedQuestion + 1,
                          questionText: questions[selectedQuestion].questionText,
                          choices: questions[selectedQuestion].choices,
                        }}
                        correctAnswer={detail.correctAnswer}
                        userAnswer={detail.userAnswer}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

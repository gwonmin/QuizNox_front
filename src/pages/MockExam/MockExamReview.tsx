import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamProgress } from "../../components/ExamProgress";
import { ExamDataError } from "../../components/ExamDataError";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { useMockExamReview } from "../../hooks/mockExam/useMockExamReview";

export default function MockExamReview() {
  const {
    examType,
    questions,
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
  } = useMockExamReview();

  if (showLoading && !showError) {
    return <LoadingOverlay show={true} />;
  }

  if (showError) {
    return (
      <ExamDataError
        onGoBack={goBack}
        goBackText="모의고사 선택으로 돌아가기"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ExamProgress
        examType={examType}
        currentQuestionIndex={questions.length - 1}
        totalQuestions={questions.length}
        remainingTime={remainingTime}
        answeredQuestions={answeredQuestions}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">시험 검토</h1>
          <p className="text-muted-foreground">
            {getExamDisplayName(examType)}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>문제별 답안 검토 (클릭하여 해당 문제 답안 수정)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {questions.map((_, index) => {
                const answerStatus = getAnswerStatus(answers[index]);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      answerStatus.status === "unanswered"
                        ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm font-medium">{index + 1}</span>
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

        <div className="flex justify-center">
          <Button
            onClick={handleSubmitExam}
            className="bg-red-600 hover:bg-red-700 px-8"
          >
            시험 제출하기
          </Button>
        </div>
      </div>

      {selectedQuestion !== null && questions[selectedQuestion] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  문제 {selectedQuestion + 1} 수정
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  닫기
                </Button>
              </div>

              <QuestionDisplay
                question={questions[selectedQuestion]}
                correctAnswer={questions[selectedQuestion].mostVotedAnswer}
                selectedAnswers={selectedAnswers}
                onAnswerToggle={handleAnswerToggle}
              />

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  현재 답안:{" "}
                  {selectedAnswers.length > 0
                    ? selectedAnswers.join(", ")
                    : "미답"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseModal}>
                    취소
                  </Button>
                  <Button
                    onClick={handleSaveAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { useMockExamQuestions } from "../../hooks/queries/useQuizQueries";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamProgress } from "../../components/ExamProgress";
import { ExamDataError } from "../../components/ExamDataError";
import { useExamTimer } from "../../hooks/useExamTimer";
import { useModalScrollLock } from "../../hooks/useModalScrollLock";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { getExamDisplayName, getAnswerStatus, getAnsweredQuestionsCount, validateExamData } from "../../utils/examUtils";

export default function MockExamReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("type") as string;
  
  const {
    questions,
    answers,
    remainingTime,
    isStarted,
    setAnswer,
    setQuestions,
    submitExam,
  } = useMockExamStore();

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // TanStack Query로 모의고사 문제 가져오기 (데이터가 없는 경우에만)
  const { data: mockExamQuestions, isPending: isLoadingQuestions } = useMockExamQuestions(examType || '');

  // 데이터가 없으면 다시 로드
  useEffect(() => {
    if ((!questions || questions.length === 0) && mockExamQuestions && mockExamQuestions.length > 0) {
      setQuestions(mockExamQuestions);
    }
  }, [questions, mockExamQuestions, setQuestions]);

  // 타이머 관리
  useExamTimer({
    isStarted,
    remainingTime,
    onTimeExpired: () => navigate(`/mock-exam/result?type=${examType}`)
  });

  // 답변한 문제 수 계산
  const answeredQuestions = getAnsweredQuestionsCount(answers);

  // 모달 스크롤 방지
  useModalScrollLock(selectedQuestion !== null);

  // 문제 클릭 핸들러 (모달 열기)
  const handleQuestionClick = (questionIndex: number) => {
    setSelectedQuestion(questionIndex);
    // 현재 답안 복원
    const currentAnswer = answers[questionIndex];
    setSelectedAnswers(currentAnswer ? currentAnswer.split("") : []);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setSelectedAnswers([]);
  };

  // 답안 선택 토글
  const handleAnswerToggle = useCallback((answer: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = prev.includes(answer)
        ? prev.filter((ans) => ans !== answer)
        : [...prev, answer];
      
      return newAnswers;
    });
  }, []);

  // 답안 저장
  const handleSaveAnswer = useCallback(() => {
    if (selectedQuestion !== null) {
      const answerString = selectedAnswers.length > 0 ? selectedAnswers.join("") : null;
      setAnswer(selectedQuestion, answerString);
      handleCloseModal();
    }
  }, [selectedQuestion, selectedAnswers, setAnswer]);

  // 시험 제출
  const handleSubmitExam = () => {
    submitExam();
    navigate(`/mock-exam/result?type=${examType}`);
  };

  // 시험 데이터 유효성 검사
  const { isValid } = validateExamData(questions, answers);
  
  // 로딩 중이거나 데이터가 유효하지 않은 경우
  if (isLoadingQuestions || !isValid) {
    if (isLoadingQuestions) {
      return <LoadingOverlay show={true} />;
    }
    
    // 데이터를 다시 로드할 수 없으면 에러 표시
    if (!mockExamQuestions || mockExamQuestions.length === 0) {
      return (
        <ExamDataError
          onGoBack={() => navigate("/mock-exam")}
          goBackText="모의고사 선택으로 돌아가기"
        />
      );
    }
    
    return <LoadingOverlay show={true} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 시험 진행도 */}
      <ExamProgress
        examType={examType || ''}
        currentQuestionIndex={questions.length - 1} // 마지막 문제 인덱스
        totalQuestions={questions.length}
        remainingTime={remainingTime}
        answeredQuestions={answeredQuestions}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">시험 검토</h1>
          <p className="text-muted-foreground">
            {getExamDisplayName(examType || '')}
          </p>
        </div>

        {/* 문제별 검토 */}
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
                      answerStatus.status === 'unanswered'
                        ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm font-medium">
                        {index + 1}
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

                {/* 액션 버튼들 */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmitExam}
                    className="bg-red-600 hover:bg-red-700 px-8"
                  >
                    시험 제출하기
                  </Button>
                </div>
      </div>

      {/* 문제 수정 모달 */}
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
                  현재 답안: {selectedAnswers.length > 0 ? selectedAnswers.join(", ") : "미답"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                  >
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

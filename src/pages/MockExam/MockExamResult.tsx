import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { GPTExplanationButton } from "../../components/GPTExplanationButton";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamDataError } from "../../components/ExamDataError";
import { useModalScrollLock } from "../../hooks/useModalScrollLock";
import { getExamTypeInfo } from "../../constants/examTypes";
import { formatDuration } from "../../utils/timeUtils";
import { getExamDisplayName, getAnswerResultStatus } from "../../utils/examUtils";
import { ExamResultState } from "../../types/quiz";

export default function MockExamResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examTypeFromUrl = searchParams.get("type");
  
  const {
    examName,
    answers,
    startTime,
    endTime,
    resetMockExam,
  } = useMockExamStore();
  
  // Zustand에서 직접 문제 데이터 가져오기 (결과 페이지에서는 이미 로드된 데이터 사용)
  const { questions } = useMockExamStore();
  
  const [result, setResult] = useState<ExamResultState | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // 모달 스크롤 방지
  useModalScrollLock(selectedQuestion !== null);

  // 다른 페이지로 이동할 때 시험 데이터 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetMockExam();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [resetMockExam]);

  // 시험 결과 계산
  useEffect(() => {
    if (questions && questions.length > 0 && answers) {

      const examInfo = getExamTypeInfo(examTypeFromUrl || '');
      const passThreshold = examInfo?.passThreshold || 45;
      
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let unansweredQuestions = 0;
      
      const answerDetails = questions.map((question, index) => {
        const userAnswer = answers[index];
        const correctAnswer = question.mostVotedAnswer;
        const isCorrect = userAnswer === correctAnswer;
        
        
        if (!userAnswer) {
          unansweredQuestions++;
        } else if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
        
        return {
          questionIndex: index,
          question: question.questionText,
          userAnswer,
          correctAnswer,
          isCorrect,
          choices: question.choices
        };
      });

      const totalQuestions = questions.length;
      const score = correctAnswers;
      const isPassed = score >= passThreshold;
      
      // 시험 시간 계산 (초단위)
      const timeSpent = startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0;

      const newResult = {
        score,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions,
        passThreshold,
        isPassed,
        timeSpent,
        answerDetails
      };

      setResult(newResult);
    }
  }, [questions, answers, examTypeFromUrl, startTime, endTime]);


  // 문제 클릭 핸들러
  const handleQuestionClick = (questionIndex: number) => {
    setSelectedQuestion(questionIndex);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedQuestion(null);
  };

  // 문제 데이터가 없는 경우
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-destructive mb-4">시험 데이터 없음</h1>
          <p className="text-muted-foreground mb-6">시험 문제를 찾을 수 없습니다. 다시 시험을 시작해주세요.</p>
          <Button onClick={() => navigate("/mock-exam")}>
            모의고사 선택으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 결과 데이터가 없는 경우
  if (!result) {
    return (
      <ExamDataError
        onGoBack={() => navigate("/mock-exam")}
        goBackText="모의고사 선택으로 돌아가기"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">시험 결과</h1>
          <p className="text-muted-foreground">
            {examName || getExamDisplayName(examTypeFromUrl || '')}
          </p>
        </div>

        {/* 결과 요약 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">시험 결과 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 점수 */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-primary">
                  {result.score} / {result.totalQuestions}
                </div>
                <p className="text-muted-foreground">정답 수</p>
                <Badge 
                  variant={result.isPassed ? "default" : "destructive"}
                  className="mt-2"
                >
                  {result.isPassed ? "합격" : "불합격"}
                </Badge>
              </div>

              {/* 통계 */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>정답:</span>
                  <span className="font-semibold text-green-600">{result.correctAnswers}문제</span>
                </div>
                <div className="flex justify-between">
                  <span>오답:</span>
                  <span className="font-semibold text-red-600">{result.incorrectAnswers}문제</span>
                </div>
                <div className="flex justify-between">
                  <span>미답:</span>
                  <span className="font-semibold text-gray-600">{result.unansweredQuestions}문제</span>
              </div>
                <div className="flex justify-between">
                  <span>소요 시간:</span>
                  <span className="font-semibold">{formatDuration(result.timeSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>합격 기준:</span>
                  <span className="font-semibold">{result.passThreshold}문제 이상</span>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* 문제별 상세 결과 - 블록 구조 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>문제별 상세 결과 (클릭하여 상세 내용 확인)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {result.answerDetails.map((detail, index) => {
                const answerStatus = getAnswerResultStatus(detail.userAnswer, detail.correctAnswer);
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      answerStatus.status === 'unanswered'
                        ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        : answerStatus.status === 'correct'
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

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/mock-exam")}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            다른 모의고사 보기
          </Button>
                  <Button
            onClick={() => navigate("/")}
            className="flex-1 sm:flex-none"
          >
            홈으로 돌아가기
                  </Button>
                </div>
      </div>

      {/* 모달 */}
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
                        mostVotedAnswer: detail.correctAnswer
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
                        {detail.userAnswer && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">내 답:</span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {detail.userAnswer}
                            </span>
                          </div>
                        )}
                        {!detail.userAnswer && (
                          <span className="text-gray-500">미답</span>
                        )}
                      </div>
                      
                      {/* GPT 해설 버튼 */}
                      <GPTExplanationButton
                        question={{
                          questionNumber: selectedQuestion + 1,
                          questionText: questions[selectedQuestion].questionText,
                          choices: questions[selectedQuestion].choices
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
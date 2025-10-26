import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMockExamStore } from "../../store/mockExamStore";
import { useMockExamQuestions } from "../../hooks/queries/useQuizQueries";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";
import { QuestionDisplay } from "../../components/QuestionDisplay";
import { ExamProgress } from "../../components/ExamProgress";
import { useExamTimer } from "../../hooks/useExamTimer";
import { EXAM_TYPE_IDS } from "../../constants/examTypes";
import { getExamBasicInfo, getExamDisplayName, getAnsweredQuestionsCount } from "../../utils/examUtils";

export default function MockExamPlay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("type") as string;

  const {
    remainingTime,
    currentQuestionIndex,
    answers,
    questions,
    isStarted,
    isSubmitted,
    startExam,
    setAnswer,
    setCurrentQuestionIndex,
    setQuestions,
    resetMockExam,
  } = useMockExamStore();

  // TanStack Query로 모의고사 문제 가져오기
  const { data: mockExamQuestions, isPending: isLoading, error } = useMockExamQuestions(examType || '');

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const loadedExamType = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);
  const isReviewingRef = useRef(false);

  // 시험 타입 설정 및 문제 로드
  useEffect(() => {
    const validExamTypes = EXAM_TYPE_IDS;
    if (!examType || !validExamTypes.includes(examType)) {
      navigate("/mock-exam");
      return;
    }

    // TanStack Query에서 가져온 문제를 Zustand에 저장
    if (mockExamQuestions && mockExamQuestions.length > 0 && loadedExamType.current !== examType) {
      setQuestions(mockExamQuestions);
      loadedExamType.current = examType;
    }
  }, [examType, navigate, mockExamQuestions, setQuestions]);

  // 컴포넌트 언마운트 시 시험 데이터 초기화 (제출되지 않은 경우만)
  useEffect(() => {
    return () => {
      // store의 현재 상태를 확인하여 안전하게 처리
      const store = useMockExamStore.getState();
      
      // 제출 중이거나 제출된 경우, 또는 검토 중인 경우에는 데이터를 유지
      if (isSubmittingRef.current || store.isSubmitted || isReviewingRef.current) {
        return;
      }
      
      // 시험이 시작되었지만 제출되지 않은 경우에만 초기화
      if (store.isStarted && !store.isSubmitted) {
        resetMockExam();
      }
    };
  }, [resetMockExam]);

  // 다른 페이지로 이동할 때 시험 데이터 초기화 (검토 완료 후)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 검토 완료 후 다른 페이지로 이동하는 경우에만 초기화
      if (isSubmitted && !isReviewingRef.current) {
        resetMockExam();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitted, resetMockExam]);


  // 문제 로드 완료 시 현재 문제의 답안 복원
  useEffect(() => {
    if (questions && questions.length > 0) {
      const currentAnswer = answers[currentQuestionIndex];
      if (currentAnswer) {
        setSelectedAnswers(currentAnswer.split(""));
      } else {
        setSelectedAnswers([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, currentQuestionIndex]); // answers 제거하여 무한 루프 방지

  // 타이머 관리
  useExamTimer({
    isStarted,
    remainingTime,
    onTimeExpired: () => navigate(`/mock-exam/review?type=${examType}`)
  });

  // 브라우저 새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !isSubmitted) {
        e.preventDefault();
        e.returnValue = "시험이 진행 중입니다. 정말로 페이지를 떠나시겠습니까?";
        return "시험이 진행 중입니다. 정말로 페이지를 떠나시겠습니까?";
      }
    };

    if (isStarted && !isSubmitted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isStarted, isSubmitted]);

  // 시험 시작
  const handleStartExam = useCallback(() => {
    startExam();
  }, [startExam]);

  // 답안 선택
  const handleAnswerToggle = useCallback((choice: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = prev.includes(choice)
        ? prev.filter((ans) => ans !== choice)
        : [...prev, choice];
      
      return newAnswers;
    });
  }, []);

  // selectedAnswers가 변경될 때마다 store에 저장
  useEffect(() => {
    const answerString = selectedAnswers.length > 0 ? selectedAnswers.join("") : null;
    setAnswer(currentQuestionIndex, answerString);
  }, [selectedAnswers, currentQuestionIndex, setAnswer]);

  // 이전 문제
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 이전 문제의 답안이 있으면 복원, 없으면 빈 배열
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswers(prevAnswer ? prevAnswer.split("") : []);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex, answers]);

  // 다음 문제
  const handleNextQuestion = useCallback(() => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // 다음 문제의 답안이 있으면 복원, 없으면 빈 배열
      const nextAnswer = answers[currentQuestionIndex + 1];
      setSelectedAnswers(nextAnswer ? nextAnswer.split("") : []);
    }
  }, [currentQuestionIndex, questions, setCurrentQuestionIndex, answers]);


  // 시험 제출 후 결과 페이지로 이동
  useEffect(() => {
    if (isSubmitted) {
      navigate(`/mock-exam/result?type=${examType}`);
    }
  }, [isSubmitted, navigate, examType]);



  // 시험 기본 정보
  const examInfo = getExamBasicInfo(examType);

  // 답변한 문제 수 계산
  const answeredQuestions = getAnsweredQuestionsCount(answers);

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
        <p className="text-destructive mb-4">{error.message || '문제를 불러오는데 실패했습니다.'}</p>
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
  if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">문제를 불러오는 중입니다...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  // 현재 문제
  const currentQuestion = questions[currentQuestionIndex];

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
            <Button
              onClick={handleNextQuestion}
              className="flex-1"
            >
              다음 →
            </Button>
          )}
        </div>
        {/* 메인 콘텐츠 */}
        <div className="px-4 py-4">
          <QuestionDisplay
            question={currentQuestion}
            correctAnswer={currentQuestion.mostVotedAnswer}
            selectedAnswers={selectedAnswers}
            onAnswerToggle={handleAnswerToggle}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

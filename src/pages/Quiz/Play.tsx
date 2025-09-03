import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setScrollIndex } from "../../store/quizSlice";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";

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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
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
      dispatch(setScrollIndex(newIndex));
      resetState();
    }
  }, [currentIndex, questions, topicId, navigate, dispatch, resetState]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      const newQuestionNumber = questions[newIndex]?.questionNumber;
      
      if (newQuestionNumber) {
        // URL 업데이트 (화면 깜박임 없음)
        navigate(`/quiz/play?topicId=${topicId}&q=${newQuestionNumber}`, { replace: true });
        setCurrentIndex(newIndex);
        dispatch(setScrollIndex(newIndex));
        resetState();
        document.documentElement.scrollTo({ top: 0 });
      }
    }
  }, [currentIndex, questions.length, questions, topicId, navigate, dispatch, resetState]);

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
    return <p className="p-4 text-center text-destructive">{error}</p>;
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
        <div className="px-4 py-4 space-y-6">
          {/* 문제 제목 */}
          <div className="space-y-2">
            <h1 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed break-words">
              {currentQuestion.questionNumber}. {currentQuestion.questionText}
            </h1>
          </div>

          {/* 선택지 */}
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => {
              const answer = choice.substring(0, 1);
              const text = choice.substring(2);
              const isSelected = selectedAnswers.includes(answer);
              
              // 정답이 배열인지 문자열인지 확인하고 안전하게 처리
              let correctAnswers: string[];
              if (Array.isArray(currentQuestion.mostVotedAnswer)) {
                correctAnswers = currentQuestion.mostVotedAnswer;
              } else if (typeof currentQuestion.mostVotedAnswer === 'string') {
                // 'BD' 같은 문자열을 ['B', 'D']로 분리
                correctAnswers = currentQuestion.mostVotedAnswer.split('');
              } else {
                correctAnswers = [];
              }
              const isCorrectAnswer = correctAnswers.includes(answer);
              
                             // 정답 확인 후 시각적 피드백
               let buttonStyle = "";
               if (isCorrect !== null) {
                 if (isCorrectAnswer) {
                   buttonStyle = "border-green-500 bg-green-50 text-green-800";
                 } else if (isSelected && !isCorrectAnswer) {
                   buttonStyle = "border-red-500 bg-red-50 text-red-800";
                 } else {
                   buttonStyle = "border-gray-300 bg-gray-50 text-gray-600";
                 }
               } else if (isSelected) {
                 buttonStyle = "border-primary bg-primary/5 text-primary";
               } else {
                 buttonStyle = "border-border bg-background";
               }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerToggle(answer)}
                  disabled={isCorrect !== null} // 정답 확인 후 선택 불가
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${buttonStyle} ${
                    isCorrect !== null ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  aria-label={`${answer}번 선택지: ${text}`}
                >
                  <div className="flex items-start">
                    <span className="font-bold mr-3 mt-0.5 flex-shrink-0 text-lg">
                      {answer}.
                    </span>
                    <span className="flex-1 text-left leading-relaxed break-words">
                      {text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

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
            <Button
              onClick={copyGPTExplanationPrompt}
              className="absolute top-0 right-0 p-2 rounded-md text-white transition-colors bg-purple-600 hover:bg-purple-700"
              aria-label="GPT 해설 요청 프롬프트 복사"
              title="GPT 해설 요청 프롬프트 복사"
            >
              <span className="text-lg">📋</span>
            </Button>
          </div>
        </div>

        {/* 토스트 알림 */}
        {showToast && (
          <div 
            className="fixed bottom-4 left-4 right-4 z-50"
            onClick={dismissToast}
          >
            <div className={`bg-background border border-border text-foreground px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${
              toastVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    해설용 프롬프트 복사 완료
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ChatGPT에 붙여넣기 하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

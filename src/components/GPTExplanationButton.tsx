import { useState, useCallback } from "react";
import { Button } from "./ui/button";

interface GPTExplanationButtonProps {
  question: {
    questionNumber: number;
    questionText: string;
    choices: string[];
  };
  correctAnswer: string;
  userAnswer?: string | null;
  onCopy?: () => void;
}

export function GPTExplanationButton({ 
  question, 
  correctAnswer, 
  userAnswer, 
  onCopy 
}: GPTExplanationButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const copyGPTExplanationPrompt = useCallback(async () => {
    if (!question) return;

    const prompt = `다음 문제에 대해 한국어로 자세한 해설을 부탁드립니다:

문제: ${question.questionNumber}. ${question.questionText}

보기:
${question.choices.map((choice) => {
  const answer = choice.substring(0, 1);
  const text = choice.substring(2);
  return `${answer}. ${text}`;
}).join('\n')}

정답: ${correctAnswer}
${userAnswer ? `내 답: ${userAnswer}` : '내 답: 미답'}

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
      
      if (onCopy) {
        onCopy();
      }
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
      
      if (onCopy) {
        onCopy();
      }
    }
  }, [question, correctAnswer, userAnswer, onCopy]);

  const dismissToast = useCallback(() => {
    setToastVisible(false);
    setTimeout(() => setShowToast(false), 300);
  }, []);

  return (
    <>
      <Button
        onClick={copyGPTExplanationPrompt}
        className="p-2 rounded-md text-white transition-colors bg-purple-600 hover:bg-purple-700"
        aria-label="GPT 해설 요청 프롬프트 복사"
        title="GPT 해설 요청 프롬프트 복사"
      >
        <span className="text-lg">📋</span>
      </Button>

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
    </>
  );
}

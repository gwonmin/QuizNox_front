import { formatTimer } from '../utils/timeUtils';
import { getExamDisplayName } from '../utils/examUtils';

interface ExamProgressProps {
  examType: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  remainingTime: number;
  answeredQuestions: number; // 답변한 문제 수
}

export function ExamProgress({
  examType,
  currentQuestionIndex,
  totalQuestions,
  remainingTime,
  answeredQuestions
}: ExamProgressProps) {
  // 진행률 계산 (답변한 문제 기준)
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          {getExamDisplayName(examType)}
        </div>
        <div className="text-sm font-mono">
          {formatTimer(remainingTime)}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          문제 {currentQuestionIndex + 1} / {totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground">
          {Math.round(progress)}% 완료 ({answeredQuestions}/{totalQuestions} 답변)
        </span>
      </div>
    </div>
  );
}

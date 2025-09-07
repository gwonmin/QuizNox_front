import React from 'react';
import { Button } from './ui/button';

interface ExamDataErrorProps {
  onRetry?: () => void;
  onGoBack?: () => void;
  retryText?: string;
  goBackText?: string;
}

export function ExamDataError({ 
  onRetry, 
  onGoBack, 
  retryText = "다시 시도",
  goBackText = "모의고사 선택으로 돌아가기"
}: ExamDataErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">시험 데이터를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          시험 데이터가 로드되지 않았습니다. 다시 시험을 시작해주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              {retryText}
            </Button>
          )}
          {onGoBack && (
            <Button onClick={onGoBack}>
              {goBackText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useMockExamStore } from '../store/mockExamStore';

interface UseExamTimerProps {
  isStarted: boolean;
  remainingTime: number;
  onTimeExpired?: () => void;
}

export function useExamTimer({ isStarted, remainingTime, onTimeExpired }: UseExamTimerProps) {
  const { tickTimer } = useMockExamStore();

  // 타이머 실행
  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        tickTimer();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, tickTimer]);

  // 시간 만료 처리
  useEffect(() => {
    if (remainingTime === 0 && isStarted && onTimeExpired) {
      onTimeExpired();
    }
  }, [remainingTime, isStarted, onTimeExpired]);
}

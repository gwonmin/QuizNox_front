import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { tickTimer } from '../store/mockExamSlice';

interface UseExamTimerProps {
  isStarted: boolean;
  remainingTime: number;
  onTimeExpired?: () => void;
}

export function useExamTimer({ isStarted, remainingTime, onTimeExpired }: UseExamTimerProps) {
  const dispatch = useDispatch<AppDispatch>();

  // 타이머 실행
  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, dispatch]);

  // 시간 만료 처리
  useEffect(() => {
    if (remainingTime === 0 && isStarted && onTimeExpired) {
      onTimeExpired();
    }
  }, [remainingTime, isStarted, onTimeExpired]);
}

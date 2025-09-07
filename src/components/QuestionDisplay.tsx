import React from 'react';
import { Badge } from './ui/badge';
import { Question } from '../types/quiz';

interface QuestionDisplayProps {
  question: Question;
  correctAnswer: string | string[];
  selectedAnswers?: string[]; // Play.tsx에서 사용하는 선택된 답안 배열
  userAnswer?: string | null; // Result 모달에서 사용하는 사용자 답안
  isCorrect?: boolean | null; // Play.tsx에서 정답 확인 후 상태
  showAnswer?: boolean; // Result 모달에서 정답 표시 여부
  onAnswerToggle?: (answer: string) => void; // Play.tsx에서 사용하는 답안 토글 핸들러
  disabled?: boolean; // 선택 비활성화 여부
}

export function QuestionDisplay({
  question,
  correctAnswer,
  selectedAnswers = [],
  userAnswer = null,
  isCorrect = null,
  showAnswer = false,
  onAnswerToggle,
  disabled = false
}: QuestionDisplayProps) {
  // 정답을 배열로 변환
  const getCorrectAnswers = (): string[] => {
    if (Array.isArray(correctAnswer)) {
      return correctAnswer;
    } else if (typeof correctAnswer === 'string') {
      return correctAnswer.split('');
    }
    return [];
  };

  const correctAnswers = getCorrectAnswers();

  const handleChoiceClick = (answer: string) => {
    if (!disabled && onAnswerToggle) {
      onAnswerToggle(answer);
    }
  };

  return (
    <div className="space-y-6">
      {/* 문제 제목 */}
      <div className="space-y-2">
        <h1 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed break-words">
          {question.questionNumber}. {question.questionText}
        </h1>
      </div>

      {/* 선택지 */}
      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const answer = choice.substring(0, 1);
          const text = choice.substring(2);
          const isSelected = selectedAnswers.includes(answer);
          const isCorrectAnswer = correctAnswers.includes(answer);
          
          // Play.tsx 스타일 로직
          let buttonStyle = "";
          if (showAnswer) {
            // Result 모달에서의 스타일
            const isUserAnswer = userAnswer ? userAnswer.includes(answer) : false;
            if (isCorrectAnswer) {
              buttonStyle = "border-green-200 bg-green-50";
            } else if (isUserAnswer) {
              buttonStyle = "border-red-200 bg-red-50";
            } else {
              buttonStyle = "border-gray-200 bg-gray-50";
            }
          } else {
            // Play.tsx에서의 스타일
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
          }

          return (
            <button
              key={index}
              onClick={() => handleChoiceClick(answer)}
              disabled={disabled || (isCorrect !== null)} // Play.tsx 로직: 정답 확인 후 선택 불가
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${buttonStyle} ${
                (isCorrect !== null) || disabled ? 'cursor-default' : 'cursor-pointer'
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
                {showAnswer && (
                  <>
                    {isCorrectAnswer && (
                      <Badge variant="default" className="text-xs ml-2">
                        정답
                      </Badge>
                    )}
                    {userAnswer && userAnswer.includes(answer) && (
                      <Badge variant="destructive" className="text-xs ml-2">
                        선택
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

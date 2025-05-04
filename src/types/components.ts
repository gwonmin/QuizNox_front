import { Question } from "./quiz";

export interface QuestionCardProps {
  question: Question;
  onClick: (questionNumber: number) => void;
  isSelected?: boolean;
}

export interface QuestionListProps {
  questions: Question[];
  onQuestionClick: (questionNumber: number) => void;
  scrollIndex: number;
}

export interface QuizPlayProps {
  questions: Question[];
  currentIndex: number;
  onAnswerSelect: (answer: string) => void;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  selectedAnswers: string[];
  showAnswer: boolean;
  isCorrect: boolean | null;
}

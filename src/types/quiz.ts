interface Question {
  questionNumber: number;
  questionText: string;
  choices: string[];
  mostVotedAnswer: string;
}

interface QuizState {
  tableName: string;
  questions: Question[];
  scrollIndex: number;
}

export type { Question, QuizState };

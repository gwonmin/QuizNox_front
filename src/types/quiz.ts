interface Question {
  questionNumber: number;
  questionText: string;
  choices: string[];
  mostVotedAnswer: string;
}

interface QuizState {
  topicId: string;
  questions: Question[];
  scrollIndex: number;
}

export type { Question, QuizState };

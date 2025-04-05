interface RawQuestion {
  topic_id: string;
  question_number: string;
  question_text: string;
  choices: string[];
  most_voted_answer: string;
}

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

export type { RawQuestion, Question, QuizState };

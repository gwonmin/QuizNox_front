export const queryKeys = {
  currentUser: ["currentUser"] as const,
  questions: (topicId: string) => ["questions", topicId] as const,
  mockExamQuestions: (examType: string) =>
    ["mockExamQuestions", examType] as const,
  progress: ["progress"] as const,
};


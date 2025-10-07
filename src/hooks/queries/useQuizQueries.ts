import { useQuery } from '@tanstack/react-query';
import { quizApi } from '../../services/api';
import { Question, RawQuestion } from '../../types/quiz';

const mapQuestion = (rawQuestion: RawQuestion): Question => ({
  questionNumber: Number(rawQuestion.question_number),
  questionText: rawQuestion.question_text,
  choices: rawQuestion.choices,
  mostVotedAnswer: rawQuestion.most_voted_answer,
});

/**
 * 퀴즈 문제 목록 조회
 */
export const useQuestions = (topicId: string) => {
  return useQuery({
    queryKey: ['questions', topicId],
    queryFn: async () => {
      const response = await quizApi.get(`/questions?topicId=${topicId}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('잘못된 응답 형식입니다.');
      }
      
      return response.data.map(mapQuestion);
    },
    enabled: !!topicId,
    staleTime: 10 * 60 * 1000, // 10분간 캐시
  });
};

/**
 * 모의고사 문제 목록 조회 (랜덤 65문제)
 */
export const useMockExamQuestions = (topicId: string) => {
  return useQuery({
    queryKey: ['mockExamQuestions', topicId], // 타임스탬프 제거
    queryFn: async () => {
      const response = await quizApi.get(`/questions?topicId=${topicId}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('잘못된 응답 형식입니다.');
      }

      // 전체 문제에서 랜덤하게 65문제 선택
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 65);

      return selectedQuestions.map((rawQuestion: RawQuestion, index: number) => ({
        questionNumber: index + 1, // 모의고사에서는 1부터 65까지
        questionText: rawQuestion.question_text,
        choices: rawQuestion.choices,
        mostVotedAnswer: rawQuestion.most_voted_answer,
        originalQuestionNumber: Number(rawQuestion.question_number), // 원본 문제 번호 보존
        topicId: rawQuestion.topic_id, // 원본 토픽 ID 보존
      }));
    },
    enabled: !!topicId,
    staleTime: 0, // 캐시 비활성화 - 매번 새로운 문제
    gcTime: 0, // 가비지 컬렉션 즉시 실행
    refetchOnMount: true, // 마운트 시 항상 새로 가져오기
    refetchOnWindowFocus: false, // 윈도우 포커스 시에는 새로 가져오지 않음
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '../../services/api';
import { getProgress, saveProgress, deleteProgress } from '../../services/api/progressApi';
import type { ProgressItem, SaveProgressPayload } from '../../services/api/progressApi';
import { Question, RawQuestion } from '../../types/quiz';
import { queryKeys } from '../../constants/queryKeys';
import { getExamBasicInfo } from '../../utils/examUtils';
import { useAuthStore } from '../../store/authStore';

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
    queryKey: queryKeys.questions(topicId),
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
 * 모의고사 문제 목록 조회 (시험 유형별 문항 수만큼 랜덤 선택)
 */
export const useMockExamQuestions = (topicId: string) => {
  return useQuery({
    queryKey: queryKeys.mockExamQuestions(topicId),
    queryFn: async () => {
      const response = await quizApi.get(`/questions?topicId=${topicId}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('잘못된 응답 형식입니다.');
      }

      // 시험 설정에서 문항 수 조회
      const { questionCount } = getExamBasicInfo(topicId);

      // 전체 문제에서 랜덤하게 필요한 개수만 선택
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, questionCount);

      return selectedQuestions.map((rawQuestion: RawQuestion, index: number) => ({
        questionNumber: index + 1,
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

/**
 * 사용자의 토픽별 풀이 진행 상태 조회
 */
export const useProgress = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<ProgressItem[]>({
    queryKey: queryKeys.progress,
    queryFn: getProgress,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * 풀이 진행 상태 저장 mutation
 */
export const useSaveProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveProgressPayload) => saveProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
};

/**
 * 풀이 진행 상태 삭제 mutation
 */
export const useDeleteProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => deleteProgress(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
};

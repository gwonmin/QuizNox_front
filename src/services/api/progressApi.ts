import { quizApiClient } from "./clients";

export interface ProgressItem {
  user_id: string;
  topic_id: string;
  question_number: number;
  topic_name: string | null;
  updated_at: string;
}

export interface SaveProgressPayload {
  topicId: string;
  questionNumber: number;
  topicName?: string;
}

export const getProgress = async (): Promise<ProgressItem[]> => {
  const res = await quizApiClient.get<ProgressItem[]>("/progress");
  return res.data;
};

export const saveProgress = async (
  data: SaveProgressPayload,
): Promise<ProgressItem> => {
  const res = await quizApiClient.put<ProgressItem>("/progress", data);
  return res.data;
};

export const deleteProgress = async (topicId: string): Promise<void> => {
  await quizApiClient.delete(`/progress/${topicId}`);
};

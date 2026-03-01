import { quizApiClient } from "./clients";
import type { Review } from "../../types/api";

export const getReviews = async (limit = 50): Promise<Review[]> => {
  const res = await quizApiClient.get<Review[]>("/reviews", {
    params: { limit },
  });
  return res.data;
};

export const postReview = async (content: string): Promise<Review> => {
  const res = await quizApiClient.post<Review>("/reviews", { content });
  return res.data;
};

export const updateReview = async (
  reviewId: string,
  content: string,
): Promise<Review> => {
  const res = await quizApiClient.put<Review>(`/reviews/${reviewId}`, {
    content,
  });
  return res.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await quizApiClient.delete(`/reviews/${reviewId}`);
};

import { RawQuestion } from "./quiz";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface QuestionResponse {
  questions: RawQuestion[];
}

export interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
}

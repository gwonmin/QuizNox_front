export {
  authApiClient,
  quizApiClient,
  AUTH_API_BASE_URL,
  QUIZ_API_BASE_URL,
} from "./clients";
export { authApiClient as authApi, quizApiClient as quizApi } from "./clients";
export {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  updateUsername,
  updatePassword,
  logout,
} from "./authApi";
export { getReviews, postReview, updateReview, deleteReview } from "./reviewApi";

import { quizApiClient } from "./clients";
export default quizApiClient;

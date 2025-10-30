import api from "./index";

/**
 * 연습 세션 피드백 조회 API
 * @param {number} sessionId - 연습 세션 ID
 * @returns {Promise} 피드백 데이터
 */
export const getFeedback = async (sessionId) => {
  try {
    const res = await api.get(`/practice/${sessionId}/feedback`);
    return res.data;
  } catch (err) {
    console.error("피드백 조회 실패:", err);
    throw err;
  }
};


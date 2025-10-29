// src/api/practiceApi.js
import api from "./index";

// 1세션 시작 (session 생성)
export const startPractice = async (projectId) => {
  try {
    const res = await api.post(`/practice/start?projectId=${projectId}`);
    return res.data; // { sessionId, projectId, slides: [...] }
  } catch (err) {
    console.error("연습 세션 시작 실패:", err);
    throw err;
  }
};

// 세션 종료 (녹음 + 슬라이드 이동 로그 전송)
export const endPractice = async (sessionId, audioBlob, slideTransitions) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded.webm");

    const res = await api.post(`/practice/${sessionId}/end`, formData, {
      params: { slideTransitions: JSON.stringify(slideTransitions) },
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data; // 예: 0 (성공)
  } catch (err) {
    console.error("연습 세션 종료 실패:", err);
    throw err;
  }
};

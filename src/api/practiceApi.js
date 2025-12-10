// src/api/practiceApi.js
import { formatMonth } from "react-calendar/dist/shared/dateFormatter.js";
import { api } from "./api";

// 세션 시작 (session 생성)
export const startPractice = async (projectId) => {
  const res = await api.post(`/practice/start?projectId=${projectId}`);
  return res.data; // { sessionId, projectId, slides: [...] }
};

// 세션 종료 (녹음 + 슬라이드 이동 로그 전송)
export const endPractice = async (sessionId, audioBlob, slideTransitions) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recorded.webm");

  const res = await api.post(`/practice/${sessionId}/end`, formData, {
    // params: { slideTransitions: JSON.stringify(slideTransitions) },
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // 예: 0 (성공)
};

//qna 질문 조회
export const getQuestion = async (sessionId) => {
  const res = await api.get(`/practice/${sessionId}/qna-question`);
  return res.data;
};

//qna 답변 업로드(stt 결과 반환)
export const uploadAnswer = async (sessionId, questionId, audioBlob) => {
  const formData = new FormData();
  formData.append("audioFile", audioBlob, "recorded.webm");

  const res = await api.post(
    `/practice/${sessionId}/qna/${questionId}/answer`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

//qna 질문 비교 실행
export const compareQnaAnswer = async (sessionId, questionId) => {
  const res = await api.post(
    `/practice/${sessionId}/qna/${questionId}/compare`
  );
  return res.data;
};

//qna 피드백 조회
export const getQnaFeedback = async (sessionId) => {
  const res = await api.get(`/practice/${sessionId}/qna/feedback`);
  return res.data;
};

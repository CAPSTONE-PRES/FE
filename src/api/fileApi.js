import api from "./index";

const BASE_URL = "http://54.180.107.216:8080/api";

export const getSlides = async (fileId) => {
  try {
    const res = await api.get(`/files/images/${fileId}`);

    // 백엔드가 '/files/...' 경로를 주는 경우, 절대경로로 변환
    // 한글 경로를 안전하게 처리하기 위해 encodeURI() 사용
    return res.data.map((path) => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      return encodeURI(`${BASE_URL}${normalized}`);
    });
  } catch (err) {
    console.error("슬라이드 이미지 조회 실패:", err);
    return [];
  }
};

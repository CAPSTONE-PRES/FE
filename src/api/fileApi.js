import api from "./index";

const BASE_URL = "http://54.180.107.216:8080/api";

export const getSlides = async (fileId) => {
  try {
    const res = await api.get(`/files/images/${fileId}`);
    return res.data;
  } catch (err) {
    console.error("슬라이드 이미지 조회 실패:", err);
    return [];
  }
};

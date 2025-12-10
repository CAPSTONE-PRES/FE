import { api } from "./api";

//슬라이드 이미지
export const getSlides = async (fileId) => {
  try {
    const res = await api.get(`/files/images/${fileId}`);
    return res.data;
  } catch (err) {
    console.error("슬라이드 이미지 조회 실패:", err);
    return [];
  }
};

//텍스트 추출
export const extractText = async (fileId) => {
  try {
    const res = await api.post(`/files/extract-text/${fileId}`);
    console.log("텍스트 추출 완료: ", res.data);
    return res.data;
  } catch (err) {
    console.error("텍스트 추출 실패:", err);
  }
};

//큐카드 생성
export const generateCue = async (fileId) => {
  try {
    const res = await api.post(`/files/generate-cue/${fileId}`);
    console.log("큐카드 생성 완료:", res.data);
    return res.data;
  } catch (err) {
    console.error("큐카드 생성 실패:", err);
  }
};

//큐카드 불러오기
export const getCueCards = async (fileId) => {
  try {
    const res = await api.get(`/files/cue-cards/${fileId}`);
    console.log("큐카드 불러오기 완료:", res.data);
    return res.data;
  } catch (err) {
    console.error("큐카드 불러오기 실패:", err);
  }
};

//qr slug로 큐카드 조회
export const getMobileCuecard = async (slug) => {
  const res = await api.get(`/files/qr/${slug}`);
  return res.data;
};

//파일의 qr 정보 조회
export const getQrInfo = async (fileId) => {
  const res = await api.get(`/files/qr-info/${fileId}`);
  return res.data;
};

//qna 생성
export const generateQnA = async (fileId) => {
  try {
    const res = await api.post(`/files/generate-and-save-qna/${fileId}`);
    console.log("qna 생성 완료:", res.data);
    return res.data;
  } catch (err) {
    console.error("qna 생성 실패: ", err);
  }
};

//qna 불러오기
export const getSavedQnA = async (fileId) => {
  try {
    const res = await api.get(`/files/qna/${fileId}`);
    console.log("예상질문 불러오기 완료:", res.data);
    return res.data;
  } catch (err) {
    console.error("예상질문 불러오기 실패:", err);
  }
};

//파일 업로드
export const uploadFile = async (uploaderId, projectId, file) => {
  try {
    const res = await api.post(
      `/files/upload?uploaderId=${uploaderId}&projectId=${projectId}`,
      file,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    console.error("파일 업로드 실패: ", err);
    throw err;
  }
};

//추가 자료 업로드
export const uploadResource = async (uploaderId, projectId, file) => {
  try {
    const res = await api.post(
      `/files/upload-resource?uploaderId=${uploaderId}&projectId=${projectId}`,
      file,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (err) {
    console.error("추가 자료 업로드 실패: ", err);
    throw err;
  }
};

//발표자료 pdf 다운로드
export const downloadPresentationPdf = async (fileId, fileName) => {
  try {
    const res = await api.get(`/files/download-pdf/${fileId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("발표자료 다운로드 실패:", err);
  }
};

import api from "./index";

/**
 * 음성 분석 요청 API
 * @param {number} projectId - 프로젝트 ID
 * @param {Array} slideTransitions - [{ slideNumber, startSec, endSec }, ...]
 * @param {File} audioFile - 업로드할 오디오 파일 (Blob 또는 File)
 */

export const analyseAudio = async (projectId, slideTransitions, audioFile) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const res = await api.post("/analyse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: {
      projectId,
      slideTransitions: JSON.stringify(slideTransitions),
    },
  });

  return res.data;
};

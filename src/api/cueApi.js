import api from "./index";

/**
 * 큐카드 내용 업데이트(fileId, slideNumber, sectionNumber 기준)
 * @param {number} cueId
 * @param {"BASIC" | "ADVANCED"} mode
 * @param {string} content
 */

export const updateCueCard = async (
  fileId,
  slideNumber,
  sectionNumber,
  mode,
  content
) => {
  const res = await api.patch(
    `/projects/${fileId}/${slideNumber}/${sectionNumber}/cuecard/update`,
    {
      mode,
      content,
    }
  );
  return res.data;
};

/**
 * 큐카드 내용 업데이트 (cueId 기준)
 * @param {number} cueId - 큐카드 ID
 * @param {"BASIC"|"ADVANCED"} mode - 모드
 * @param {string} content - 수정할 내용
 */
export const updateCueCardById = async (cueId, mode, content) => {
  const res = await api.patch(`/projects/cuecard/${cueId}/update`, {
    mode,
    content,
  });
  return res.data;
};

/**
 * 큐카드 체크/해제 API
 * @param {number} cueId - 큐카드 ID
 * @param {"CHECKED" | "UNCHECKED"} status - 상태
 */
export const toggleCueCheck = async (cueId, status) => {
  try {
    const res = await api.patch(`/projects/cuecard/${cueId}/check`, null, {
      params: { status },
    });
    return res.data;
  } catch (err) {
    console.error("큐카드 체크 토글 실패: ", err);
    throw err;
  }
};

/**
 * 체크된 큐카드 cueId 조회
 * @param {number} fileId
 * @returns {Promise<{fileId: number, checkedCueIds:number[]}>}
 */
export const getCheckStatus = async (fileId) => {
  const res = await api.get(`/projects/${fileId}/cuecard/check/status`);
  return res.data;
};

/**
 * 미체크 멤버 목록 조회
 * @param {number} cueId
 * @returns {Promise<{cueId: number, cueCards: Array<{cueId: number, uncheckedMembers: Array}>}>}
 */
export const getUncheckedMembers = async (cueId) => {
  const res = await api.get(`/projects/cuecard/${cueId}/check/list`);
  return res.data;
};

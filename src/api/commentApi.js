import api from "./index";

//큐카드 단위 코멘트 조회
export const getComments = async (cueId) => {
  const res = await api.get(`/projects/${cueId}/comments`);
  console.log(`${cueId}번 큐카드 코멘트:`, res.data);
  return res.data;
};

//코멘트 생성
export const createComment = async (cueId, content, location) => {
  const res = await api.post(`/projects/${cueId}/comments`, {
    content,
    location,
  });
  return res.data;
};

//답글 생성
export const createReply = async (parentCommentId, content, location) => {
  const res = await api.post(`/projects/comments/${parentCommentId}/replies`, {
    content,
    location,
  });
  return res.data;
};

//코멘트 수정
export const updateComment = async (commentId, content, location) => {
  const res = await api.patch(`/projects/comments/${commentId}`, {
    content,
    location,
  });
  return res.data;
};

//코멘트 삭제
export const deleteComment = async (commentId) => {
  const res = await api.delete(`/projects/comments/${commentId}`);
  return res.data;
};

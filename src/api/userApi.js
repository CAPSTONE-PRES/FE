import { api } from "./api";

// 내 정보 조회
export const getMyInfo = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

// 내 정보 수정 (username, email, password, profileUrl 가능)
export const updateMyInfo = async (body) => {
  const res = await api.patch("/user/me", body);
  console.log("내 정보 수정 완료:", res.data);
  return res.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/user/me/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 프로필 이미지 삭제
export const deleteProfileImage = async () => {
  const res = await api.delete("/user/me/profile-image");
  return res.data;
};

export const deleteMyInfo = async () => {
  const res = await api.delete("/user/me");
  return res.data;
};

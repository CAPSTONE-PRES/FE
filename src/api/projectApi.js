import api from "./index";

export const getProjectInfo = async (projectId) => {
  const res = await api.get(`/${projectId}/info`);
  return res.data;
};

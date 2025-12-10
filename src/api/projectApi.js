import { api } from "./api";

export const getProjectList = async (type = 1) => {
  const res = await api.get("/projects/list", {
    params: { type },
  });
  return res.data;
};

export const getProjectInfo = async (projectId) => {
  const res = await api.get(`/${projectId}/info`);
  return res.data;
};

export const getAllProjects = async () => {
  const res = await api.get("/projects/list/all");
  return res.data;
};

export const getNextProject = async () => {
  const res = await api.get("/projects/next");
  return res.data;
};

export const getProjectsByDate = async (date) => {
  const res = await api.get("/projects/list/date", {
    params: { date },
  });
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}/delete`);
  return res.data;
};

export const searchProjects = async (title) => {
  const res = await api.get("/projects/search", {
    params: { title },
  });
  return res.data;
};

export const createProject = async (workspaceId, createBody) => {
  const res = await api.post(
    `/workspace/${workspaceId}/projects/create`,
    createBody
  );
  return res.data;
};

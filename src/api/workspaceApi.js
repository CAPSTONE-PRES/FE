import api from "./index";

export const getWorkspaceList = async (type = 1) => {
  const res = await api.get("/workspace/list", { params: { type } });
  return res.data;
};

export const getWorkspaceInfo = async (workspaceId) => {
  const res = await api.get(`/workspace/${workspaceId}/info`);
  return res.data;
};

export const getWorkspaceProjectList = async (workspaceId, type = 1) => {
  const res = await api.get(`/workspace/${workspaceId}/projects/list`, {
    params: { type },
  });
  return res.data;
};

export const deleteWorkspace = async (workspaceId) => {
  const res = await api.delete(`/workspace/${workspaceId}/delete`);
  return res.data;
};

export const getFavWorkspaces = async () => {
  const res = await api.get("/workspace/heart/list");
  return res.data;
};

export const toggleWorkspaceFavorite = async (workspaceId, status) => {
  const res = await api.patch(`/workspace/${workspaceId}/heart`, null, {
    params: { status },
  });
  return res.data;
};

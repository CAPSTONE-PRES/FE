import { api } from "./api";

export const getMyEmailNotifications = async () => {
  const res = await api.get("/users/me/email-notifications");
  return res.data;
};

export const updateMyEmailNotifications = async (payload) => {
  const res = await api.patch("/users/me/email-notifications", payload);
  return res.data;
};

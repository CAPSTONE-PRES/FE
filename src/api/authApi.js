import axios from "axios";

const BASE_URL = "http://54.180.167.52:8080/api";
// const BASE_URL = "/api";

export const loginApi = async (email, password) => {
  const res = await axios.post(
    `${BASE_URL}/auth/login`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return res.data; // { accessToken: "...", refreshToken: "..." }
};

export const logoutApi = async () => {
  const res = await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export const sendSignupEmail = async (email) => {
  const res = await axios.post(`${BASE_URL}/auth/email/sendcode`, { email });
  return res.data;
};

export const signupConfirm = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/email/signup`, data);
  return res.data;
};

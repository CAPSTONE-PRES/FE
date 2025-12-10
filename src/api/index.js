/**
import axios from "axios";
import { useEffect } from "react";

const BASE_URL = "http://54.180.167.52:8080/api";
// const BASE_URL = "/api";

// const ACCESS_TOKEN =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwcmVzc2VydmVyIiwic3ViIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc2MTQ2Njc1NSwiZXhwIjoxNzcxODM0NzU1LCJpZCI6MX0.VFgcUkV-Npo58I85H9A1iDIbzkBndTma-D7TZZfS5FU";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
 */

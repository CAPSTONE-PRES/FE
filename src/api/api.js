import axios from "axios";
import { refreshAccessToken } from "./authApi";

const BASE_URL = "http://54.180.167.52:8080/api";
// const BASE_URL = "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * 앱 시작 시 딱 1번 호출해서 인터셉터 등록
 * @param {Function} updateAccessToken - AuthContext에서 넘어온 토큰 업데이트 함수
 * @param {Function} logout - AuthContext에서 넘어온 로그아웃 함수
 */
export const setupInterceptors = (updateAccessToken, logout) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // 응답 객체가 없거나, 이미 재시도한 요청이면 그대로 실패
      if (!error.response) {
        return Promise.reject(error);
      }

      // Access Token 만료 → Refresh Token으로 재발급 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // refreshToken 이용해서 accessToken 재발급
          const data = await refreshAccessToken();
          console.log("accessToken 재발급: ", data);

          // 새 accessToken 저장 & Context 갱신
          if (data.accessToken) {
            updateAccessToken(data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }

          // 실패했던 요청 다시 보내기
          return api(originalRequest);
        } catch (refreshErr) {
          console.error("토큰 재발급 실패, 로그아웃합니다:", refreshErr);
          logout(); // refresh도 실패하면 자동 로그아웃
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );
};

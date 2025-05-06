import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_SERVER_IP,
  withCredentials: true, // 요청/응답에 쿠키 포함 여부
});

api.interceptors.request.use((config) => {
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err);
    alert(err.response.data.message);
    return Promise.reject(err);
  }
);

export default api;

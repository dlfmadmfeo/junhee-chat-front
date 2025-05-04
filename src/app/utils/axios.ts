import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_SERVER_IP,
  //   withCredentials: true, // 필요한 경우
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  // 예: 토큰 붙이기
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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

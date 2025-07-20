import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_SERVER_IP,
  withCredentials: true, // 서로 다른 도메인에 대한 보안 허용 여부 (쿠키 전달 가능 여부)
  headers: {
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache";
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

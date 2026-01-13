import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Refresh token missing");

        const refreshRes = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh-token",
          { refreshToken }
        );

        const newAccessToken = refreshRes.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalReq);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/auth";
      }
    }

    return Promise.reject(err);
  }
);

export default API;

import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      apiClient.defaults.headers.common["Authorization"] = null;
      Cookies.remove("token");
      localStorage.removeItem("persist:root");
      window.location.href = "/auth/login";
    } else {
      return Promise.reject(
        customError(error.response?.status || 500, error.response.data.message)
      );
    }
  }
);

export const customError = (code: number, message: string) => {
  return { responseCode: code, message };
};


export default apiClient;

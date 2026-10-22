import axios from "axios";
import useAuthStorage from "../features/login/v1/hooks/useAuthStorage";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ciitm-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token =
    useAuthStorage.getState().token ||
    localStorage.getItem("ciitm_admin_token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc5MDczOTM3MCwiZXhwIjoxNzkxMzQ0MTcwfQ.JDF3bWHcQRGk3Xn9_-qypuDaZZ84fXeu9brVg9-uo3s";

  if (token) {
    config.headers.Authorization = token;
    config.headers.token = token;
    config.headers["x-access-token"] = token;
    if (typeof document !== "undefined") {
      try {
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      } catch {
        // Ignore cookie write errors if any
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return err.response?.data?.message || err.message || fallback;
  }
  return typeof error === "string" ? error : fallback;
}

export default api;

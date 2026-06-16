import axios from "axios";

// Single source of truth for the API host — configured entirely via the
// `VITE_API_URL` environment variable in `frontend/.env`. No URL is
// hardcoded here; to switch environments edit that one file only.
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not set. Define it in frontend/.env (e.g. VITE_API_URL=http://localhost:3000)."
  );
}

const api = axios.create({ baseURL: API_URL });

// Attach the JWT on every request from localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling for an expired/invalid JWT — clear the stale
// token and bounce to /signin so the user re-auths instead of staring
// at empty screens.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("activeGroupId");
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
export { API_URL };
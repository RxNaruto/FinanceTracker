import axios from "axios";

// Single source of truth for the API host. Production URL stays as the
// default so existing deploys keep working out of the box; override via
// `VITE_API_URL` in `.env.local` to point at localhost during dev.
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://financetracker.rithkchaudharytechnologies.xyz";

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
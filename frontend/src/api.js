import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const API = axios.create({
  baseURL: API_URL,
});

// Utility: Check if token is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // Convert `exp` (seconds) to milliseconds
  } catch (e) {
    return true; // Invalid token format
  }
}

// Token refresh function
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login"; // Redirect to login
    return null;
  }
};

// Axios request interceptor: Attach token before requests
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("access_token");

  if (isTokenExpired(token)) {
    console.warn("Access token expired, refreshing...");
    token = await refreshToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// Axios response interceptor: Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - Attempting token refresh...");
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return API(error.config); // Retry the failed request
      }
    }
    return Promise.reject(error);
  }
);

// API Functions
export const register = async (username, password) => {
  return API.post("/register/", { username, password });
};

export const login = async (username, password) => {
  const response = await API.post("/login/", { username, password });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data;
};

export const getWallet = async () => {
    try {
        const response = await API.get("/wallet/");
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance", error);
        return null;
    }
  };

export default API;
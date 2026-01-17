import axios from "axios";
import API_BASE_URL from "./ApiConfig";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false, // ❗ You're using Bearer token, not cookies
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;

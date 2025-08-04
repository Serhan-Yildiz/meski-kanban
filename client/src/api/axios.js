import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://meski-kanban.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

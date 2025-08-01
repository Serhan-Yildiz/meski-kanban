import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "https://meski-kanban.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

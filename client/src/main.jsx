import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import axios from "axios";

// 🔽 API ana URL'si
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// 🔽 localStorage'daki token'ı çekip Authorization header'ına ekle
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

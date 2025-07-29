import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Giriş hatası", err);
      alert("Giriş başarısız");
    }
  };

  return (
    <div className="auth-form">
      <h2>Giriş Yap</h2>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Giriş</button>
      <a
        href="https://meski-kanban.onrender.com/auth/google"
        className="google-login"
      >
        Google ile Giriş Yap
      </a>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios.js";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post("/login", { email, password });

      const token = res.data.token;
      const name = res.data.name;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", name);
      }

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Kullanıcı bulunamadı");
      } else if (err.response?.status === 401) {
        setError("Şifre yanlış");
      } else {
        setError("Giriş sırasında bir hata oluştu");
      }
    }
  };

  return (
    <div className="centered-page">
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Giriş Yap</h2>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Şifreyi Göster
        </label>

        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Beni Hatırla
        </label>

        <button onClick={handleLogin}>Giriş Yap</button>

        <a
          href="https://meski-kanban.onrender.com/auth/google"
          className="google-login"
        >
          Google ile Giriş Yap
        </a>

        <div className="auth-links">
          <p>Hesabınız yok mu?</p>
          <Link to="/register">Kayıt Ol</Link>
        </div>

        <div className="auth-links">
          <Link to="/forgot">Şifremi Unuttum</Link>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        type={showPassword ? "text" : "password"}
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

      <button onClick={login}>Giriş</button>

      <a
        href="https://meski-kanban.onrender.com/auth/google"
        className="google-login"
      >
        Google ile Giriş Yap
      </a>

      <div className="auth-links">
        Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        <a href="/apk/meski-kanban.apk" download>
          📱 Android Uygulamayı İndir
        </a>
        <Link to="/forgot-password">Şifremi Unuttum</Link>
      </div>
    </div>
  );
}

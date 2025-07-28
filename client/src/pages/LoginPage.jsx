import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("E-posta ve şifre boş bırakılamaz");
      return;
    }

    if (!validateEmail(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Giriş hatası: " + (err.response?.data?.message || "Sunucu hatası"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">MESKİ Kanban - Giriş</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <div className="google-login-container">
          <p style={{ margin: "10px 0" }}>veya Google ile giriş yap</p>
          <button
            className="button google"
            type="button"
            onClick={() =>
              (window.location.href =
                "https://meski-kanban.onrender.com/auth/google")
            }
          >
            Google ile Giriş Yap
          </button>
        </div>

        <p style={{ marginTop: "15px" }}>
          Hesabınız yok mu? <a href="/register">Kayıt Ol</a>
        </p>

        {/* Opsiyonel */}
        <p style={{ marginTop: "5px" }}>
          <a href="/forgot-password">Şifremi unuttum</a>
        </p>

        {error && <p className="error">{error}</p>}
      </form>

      <div className="apk-download">
        <p>📱 Android için uygulamayı indir:</p>
        <a href="/MESKI_Kanban_App.apk" download>
          <img
            src="/apk-download-icon.png"
            alt="APK İndir"
            style={{ height: "40px", marginTop: "5px" }}
          />
        </a>
      </div>
    </div>
  );
}

export default LoginPage;

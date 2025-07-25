import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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

    if (!name || !email || !password || !confirm) {
      setError("Tüm alanlar zorunludur");
      return;
    }

    if (!validateEmail(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        "Kayıt hatası: " + (err.response?.data?.message || "Sunucu hatası")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">MESKİ Kanban - Kayıt</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
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
        <input
          type="password"
          placeholder="Şifre (Tekrar)"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </button>

        <div className="google-login-container">
          <p style={{ margin: "10px 0" }}>veya Google ile kayıt ol</p>
          <button
            type="button"
            className="button google"
            onClick={() =>
              (window.location.href =
                "https://meski-kanban.onrender.com/auth/google")
            }
          >
            Google ile Kayıt Ol
          </button>
        </div>

        <p style={{ marginTop: "15px" }}>
          Zaten hesabınız var mı? <a href="/login">Giriş Yap</a>
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

export default RegisterPage;

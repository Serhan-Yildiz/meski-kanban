import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    showPassword: false,
    remember: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      if (form.remember) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Giriş başarısız.";
      setError(msg);
    }
  };

  return (
    <div className="centered-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>

        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type={form.showPassword ? "text" : "password"}
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="showPassword"
            checked={form.showPassword}
            onChange={handleChange}
          />
          Şifreyi göster
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          Beni hatırla
        </label>

        <button type="submit">Giriş Yap</button>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="google-login"
        >
          Google ile giriş yap
        </a>

        <div className="auth-links">
          <p>Hesabınız yok mu?</p>
          <a href="/register">Kayıt Ol</a>
          <a href="/forgot-password">Şifremi Unuttum</a>
        </div>

        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}

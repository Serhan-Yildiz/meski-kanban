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
        <h2 className="text-center mb-4">Giriş Yap</h2>

        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="E-posta"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type={form.showPassword ? "text" : "password"}
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Şifre"
          />
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="showPassword"
            checked={form.showPassword}
            onChange={handleChange}
            id="showPassword"
          />
          <label className="form-check-label" htmlFor="showPassword">
            Şifreyi göster
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
            id="remember"
          />
          <label className="form-check-label" htmlFor="remember">
            Beni hatırla
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Giriş Yap
        </button>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="btn btn-outline-danger w-100 mt-2"
        >
          Google ile Giriş Yap
        </a>

        <div className="text-center mt-3 auth-links">
          <p className="mb-1">
            Hesabınız yok mu?{" "}
            <a href="/register" className="text-decoration-none">
              Kayıt Ol
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="text-decoration-none">
              Şifremi Unuttum
            </a>
          </p>
        </div>

        {error && <div className="form-error mt-3 text-center">{error}</div>}
      </form>
    </div>
  );
}

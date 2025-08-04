import { useState } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    securityQuestion: "",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState([]);
  const [serverMessage, setServerMessage] = useState("");

  const securityQuestions = [
    "İlk evcil hayvanınızın adı nedir?",
    "En sevdiğiniz öğretmenin adı nedir?",
    "Annenizin kızlık soyadı nedir?",
    "İlkokulunuzun adı nedir?",
    "Doğduğunuz şehir nedir?",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = [];

    if (!form.name.trim()) newErrors.push("Ad soyad alanı zorunludur.");
    if (!form.email.includes("@")) newErrors.push("Geçerli bir e-posta girin.");
    if (/\s/.test(form.email)) newErrors.push("E-posta boşluk içeremez.");

    if (form.password.length < 8)
      newErrors.push("Şifre en az 8 karakter olmalı.");
    if (!/[a-z]/.test(form.password))
      newErrors.push("Şifre küçük harf içermeli.");
    if (!/[A-Z]/.test(form.password))
      newErrors.push("Şifre büyük harf içermeli.");
    if (!/[0-9]/.test(form.password)) newErrors.push("Şifre rakam içermeli.");
    if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(form.password))
      newErrors.push("Şifre sembol içermeli.");

    if (form.password !== form.confirmPassword)
      newErrors.push("Şifreler aynı olmalı.");

    if (!form.securityQuestion) newErrors.push("Güvenlik sorusu seçmelisiniz.");
    if (!form.securityAnswer.trim())
      newErrors.push("Güvenlik sorusu cevabı zorunludur.");

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        security_question: form.securityQuestion,
        security_answer: form.securityAnswer,
      });

      setServerMessage(
        "✅ Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Kayıt başarısız.";
      setErrors([msg]);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        className="p-4 border rounded shadow-sm bg-light dark:bg-dark text-dark dark:text-light w-100"
        style={{ maxWidth: "450px" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">Kayıt Ol</h2>

        <div className="form-group">
          <label>Ad Soyad</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>E-posta</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <input
            type={form.showPassword ? "text" : "password"}
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre Tekrar</label>
          <input
            type={form.showPassword ? "text" : "password"}
            className="form-control"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            name="showPassword"
            checked={form.showPassword}
            onChange={handleChange}
            id="showPassword"
          />
          <label className="form-check-label" htmlFor="showPassword">
            Şifreyi göster
          </label>
        </div>

        <small className="text-muted d-block mb-3">
          Şifre en az 1 küçük harf, 1 büyük harf, 1 sembol, 1 rakam içermeli ve
          en az 8 karakter olmalı.
        </small>

        <div className="form-group">
          <label>Güvenlik Sorusu</label>
          <select
            className="form-control"
            name="securityQuestion"
            value={form.securityQuestion}
            onChange={handleChange}
            required
          >
            <option value="">Güvenlik sorusu seçin</option>
            {securityQuestions.map((q, i) => (
              <option key={i} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cevap</label>
          <input
            type="text"
            className="form-control"
            name="securityAnswer"
            value={form.securityAnswer}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mt-2">
          Kayıt Ol
        </button>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="btn btn-outline-danger w-100 mt-2"
        >
          Google ile kayıt ol
        </a>

        <div className="text-center mt-3">
          <p className="mb-1">Zaten hesabınız var mı?</p>
          <a href="/login" className="text-decoration-none">
            Giriş Yap
          </a>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-danger mt-3">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}

        {serverMessage && (
          <div className="alert alert-success mt-3">{serverMessage}</div>
        )}
      </form>
    </div>
  );
}

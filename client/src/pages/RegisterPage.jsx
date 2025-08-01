import { useState } from "react";
import axios from "../api/axios.js";
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
    if (!/[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(form.password))
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
    const validationErrors = validate();
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      try {
        await axios.post("/auth/register", {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          security_question: form.securityQuestion,
          security_answer: form.securityAnswer,
        });

        setServerMessage(
          "Kayıt başarılı. Giriş sayfasına yönlendiriliyorsunuz."
        );
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        const msg = err.response?.data?.message || "Kayıt başarısız.";
        setErrors([msg]);
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Kayıt Ol</h2>

      <input
        type="text"
        name="name"
        placeholder="Ad Soyad"
        value={form.name}
        onChange={handleChange}
        required
      />

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

      <input
        type={form.showPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Şifre Tekrar"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="showPassword"
          checked={form.showPassword}
          onChange={handleChange}
        />
        Şifreyi göster
      </label>

      <p className="password-rules">
        Şifre en az 1 küçük harf, 1 büyük harf, 1 sembol, 1 rakam içermeli ve en
        az 8 karakter uzunluğunda olmalıdır.
      </p>

      <select
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

      <input
        type="text"
        name="securityAnswer"
        placeholder="Güvenlik sorusu cevabı"
        value={form.securityAnswer}
        onChange={handleChange}
        required
      />

      <button type="submit">Kayıt Ol</button>

      <a href="/auth/google" className="google-login">
        Google ile kayıt ol
      </a>

      <div className="auth-links">
        <p>Zaten hesabınız var mı?</p>
        <a href="/login">Giriş Yap</a>
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
        {errors.map((err, i) => (
          <div key={i} style={{ color: "red" }}>
            {err}
          </div>
        ))}
        {serverMessage && <div style={{ color: "green" }}>{serverMessage}</div>}
      </div>
    </form>
  );
}

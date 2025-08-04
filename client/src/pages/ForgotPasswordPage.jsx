import { useState } from "react";
import api from "../api/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState([]);

  const validatePassword = () => {
    const validationErrors = [];

    if (newPassword.length < 8)
      validationErrors.push("Şifre en az 8 karakter olmalı.");
    if (!/[a-z]/.test(newPassword))
      validationErrors.push("Şifre küçük harf içermeli.");
    if (!/[A-Z]/.test(newPassword))
      validationErrors.push("Şifre büyük harf içermeli.");
    if (!/[0-9]/.test(newPassword))
      validationErrors.push("Şifre rakam içermeli.");
    if (!/[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(newPassword))
      validationErrors.push("Şifre sembol içermeli.");
    if (newPassword !== confirmPassword)
      validationErrors.push("Şifreler aynı olmalı.");

    return validationErrors;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors([]);

    try {
      const res = await api.post("/auth/reset-step1", { email });
      setQuestion(res.data.question);
      setStep(2);
    } catch (err) {
      console.error(err);
      setStatus("Kullanıcı bulunamadı");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const validationErrors = validatePassword();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        answer,
        newPassword,
      });

      setStatus("✅ Şifre başarıyla sıfırlandı");
      setStep(1);
      setEmail("");
      setAnswer("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setErrors([]);
    } catch (err) {
      const serverErr = err.response?.data?.message;
      setErrors([serverErr || "Sunucu hatası: Şifre sıfırlanamadı."]);
    }
  };

  return (
    <div className="centered-page">
      <form
        className="auth-form"
        onSubmit={step === 1 ? handleEmailSubmit : handleResetSubmit}
      >
        <h2 className="text-center mb-4">Şifremi Unuttum</h2>

        {step === 1 && (
          <>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Devam Et
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-3">
              <strong>Güvenlik Sorusu:</strong>
              <p>{question}</p>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Cevabınız"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Yeni şifre"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Yeni şifre tekrar"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showPassword" className="form-check-label">
                Şifreyi göster
              </label>
            </div>

            <p className="password-rules">
              Şifre en az 1 küçük harf, 1 büyük harf, 1 sembol, 1 rakam içermeli
              ve en az 8 karakter uzunluğunda olmalıdır.
            </p>

            <button type="submit" className="btn btn-success w-100">
              Şifreyi Sıfırla
            </button>
          </>
        )}

        {errors.length > 0 && (
          <div className="form-error alert alert-danger mt-3">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}

        {status && !errors.length && (
          <div
            className={`mt-3 ${
              status.includes("✅") ? "success-text" : "error-text"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}

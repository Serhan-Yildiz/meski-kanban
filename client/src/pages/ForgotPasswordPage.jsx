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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Şifremi Unuttum</h2>

            <form onSubmit={step === 1 ? handleEmailSubmit : handleResetSubmit}>
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
                  <button type="submit" className="btn btn-primary btn-block">
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

                  <div className="form-group form-check">
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

                  <div className="alert alert-secondary small">
                    Şifre en az 1 küçük harf, 1 büyük harf, 1 sembol, 1 rakam
                    içermeli ve en az 8 karakter olmalıdır.
                  </div>

                  <button type="submit" className="btn btn-success btn-block">
                    Şifreyi Sıfırla
                  </button>
                </>
              )}

              {errors.length > 0 && (
                <div className="mt-3 alert alert-danger">
                  {errors.map((err, i) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
              )}

              {status && !errors.length && (
                <div
                  className={`mt-3 alert ${
                    status.includes("✅") ? "alert-success" : "alert-danger"
                  }`}
                >
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "../api/axios.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [status, setStatus] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/reset-step1", { email });
      setQuestion(res.data.question);
      setStep(2);
      setStatus("");
    } catch (err) {
      console.error("Kullanıcı bulunamadı", err);
      setStatus("Kullanıcı bulunamadı");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/reset-password", {
        email,
        answer,
        newPassword,
      });
      setStatus("✅ Şifre başarıyla sıfırlandı");
      setStep(1);
      setEmail("");
      setAnswer("");
      setNewPassword("");
    } catch (err) {
      if (err.response?.status === 403) {
        setStatus("❌ Güvenlik cevabı yanlış");
      } else {
        setStatus("Bir hata oluştu");
      }
    }
  };

  return (
    <div className="centered-page">
      <form
        className="auth-form"
        onSubmit={step === 1 ? handleEmailSubmit : handleResetSubmit}
      >
        <h2>Şifremi Unuttum</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Devam Et</button>
          </>
        )}

        {step === 2 && (
          <>
            <p>
              <strong>Güvenlik Sorusu:</strong>
              <br />
              {question}
            </p>
            <input
              type="text"
              placeholder="Cevabınız"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Şifreyi Sıfırla</button>
          </>
        )}

        {status && <p style={{ marginTop: "10px" }}>{status}</p>}
      </form>
    </div>
  );
}

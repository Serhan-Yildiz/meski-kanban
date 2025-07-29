import { useState } from "react";
import axios from "../api/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      await axios.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      console.error("Şifre sıfırlama isteği başarısız:", err);
      alert("İşlem başarısız. E-posta sistemimiz çalışmıyor olabilir.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Şifremi Unuttum</h2>

      {success ? (
        <p>E-posta adresinize bir şifre sıfırlama bağlantısı gönderildi.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubmit}>Gönder</button>
        </>
      )}
    </div>
  );
}

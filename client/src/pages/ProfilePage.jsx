import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Hata oluştu:", error.response?.data);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validatePassword = () => {
    if (newPassword.length < 8) return "Şifre en az 8 karakter olmalı.";
    if (!/[a-z]/.test(newPassword)) return "Şifre küçük harf içermeli.";
    if (!/[A-Z]/.test(newPassword)) return "Şifre büyük harf içermeli.";
    if (!/[0-9]/.test(newPassword)) return "Şifre rakam içermeli.";
    if (!/[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/.test(newPassword))
      return "Şifre sembol içermeli.";
    if (newPassword !== confirmPassword) return "Şifreler aynı değil.";
    return null;
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    const validationError = validatePassword();
    if (validationError) {
      setPasswordMessage(validationError);
      return;
    }

    try {
      await axios.put(
        "/auth/change-password",
        { currentPassword: "", newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage("✅ Şifre başarıyla güncellendi");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Şifre güncellenemedi";
      setPasswordMessage(`❌ ${msg}`);
    }
  };

  const updateSecurityInfo = async (e) => {
    e.preventDefault();
    setSecurityMessage("");

    if (!securityQuestion || !securityAnswer.trim()) {
      setSecurityMessage("Güvenlik sorusu ve cevabı zorunludur.");
      return;
    }

    try {
      await axios.put(
        "/auth/update-security",
        { question: securityQuestion, answer: securityAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSecurityMessage("✅ Güvenlik sorusu güncellendi");
      setSecurityQuestion("");
      setSecurityAnswer("");
    } catch (err) {
      const msg = err.response?.data?.message || "Güncelleme başarısız";
      setSecurityMessage(`❌ ${msg}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <h2>Profil</h2>
      <p>
        <strong>Ad:</strong> {user?.name}
      </p>
      <p>
        <strong>E-posta:</strong> {user?.email}
      </p>

      <form onSubmit={changePassword}>
        <h3>Şifre Güncelle</h3>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Şifre tekrar"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Şifreyi göster
        </label>
        <p className="password-rules">
          Şifre en az 1 küçük harf, 1 büyük harf, 1 sembol, 1 rakam içermeli ve
          en az 8 karakter uzunluğunda olmalıdır.
        </p>
        <button type="submit">Şifreyi Güncelle</button>
        {passwordMessage && (
          <p
            style={{
              color: passwordMessage.startsWith("✅") ? "green" : "red",
            }}
          >
            {passwordMessage}
          </p>
        )}
      </form>

      <form onSubmit={updateSecurityInfo} style={{ marginTop: "2rem" }}>
        <h3>Güvenlik Sorusu Güncelle</h3>
        <input
          type="text"
          placeholder="Yeni güvenlik sorusu"
          value={securityQuestion}
          onChange={(e) => setSecurityQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Yeni cevap"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          required
        />
        <button type="submit">Güncelle</button>
        {securityMessage && (
          <p
            style={{
              color: securityMessage.startsWith("✅") ? "green" : "red",
            }}
          >
            {securityMessage}
          </p>
        )}
      </form>

      <button onClick={handleLogout} style={{ marginTop: "2rem" }}>
        Çıkış Yap
      </button>
    </div>
  );
}

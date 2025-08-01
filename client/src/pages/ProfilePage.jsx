import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("/auth/profile", {
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

  const changePassword = async (e) => {
    e.preventDefault();
    setStatus("");

    if (newPassword !== confirmPassword) {
      setStatus("❌ Şifreler uyuşmuyor");
      return;
    }

    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!rules.test(newPassword)) {
      setStatus(
        "❌ Şifre en az 8 karakter olmalı ve büyük, küçük harf, rakam ve sembol içermelidir."
      );
      return;
    }

    try {
      await axios.put(
        "/profile/change-password",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus("✅ Şifre başarıyla güncellendi");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Güncelleme başarısız");
    }
  };

  const updateSecurity = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/profile/update-security",
        {
          question: securityQuestion,
          answer: securityAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus("✅ Güvenlik sorusu güncellendi");
    } catch (err) {
      console.error(err);
      setStatus("❌ Güvenlik sorusu güncellenemedi");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const isGoogleUser = user?.password === null || user?.password === undefined;

  const securityQuestions = [
    "İlk evcil hayvanınızın adı nedir?",
    "En sevdiğiniz öğretmenin adı nedir?",
    "Annenizin kızlık soyadı nedir?",
    "İlkokulunuzun adı nedir?",
    "Doğduğunuz şehir nedir?",
  ];

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

      {!isGoogleUser && (
        <>
          <form onSubmit={changePassword} style={{ marginTop: "20px" }}>
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
              placeholder="Yeni şifre (tekrar)"
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
            <button type="submit">Şifreyi Güncelle</button>
          </form>

          <form onSubmit={updateSecurity} style={{ marginTop: "20px" }}>
            <h3>Güvenlik Sorusu Güncelle</h3>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="">Soru seçin</option>
              {securityQuestions.map((q, i) => (
                <option key={i} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Cevap"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <button type="submit">Güncelle</button>
          </form>
        </>
      )}

      {status && (
        <p style={{ color: status.startsWith("✅") ? "green" : "red" }}>
          {status}
        </p>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Çıkış Yap
      </button>

      <button
        onClick={async () => {
          if (window.confirm("Hesabınızı silmek istediğinize emin misiniz?")) {
            try {
              await axios.delete("/profile/delete", {
                headers: { Authorization: `Bearer ${token}` },
              });
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");
              navigate("/");
            } catch (err) {
              console.error(err);
              alert("❌ Hesap silinemedi");
            }
          }
        }}
        style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
      >
        Hesabımı Sil
      </button>
    </div>
  );
}

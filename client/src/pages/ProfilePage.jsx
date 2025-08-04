import { useEffect, useState, useCallback } from "react";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Hata oluştu:", error.response?.data);
      navigate("/login");
    }
  }, [navigate]);

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
      await api.put("/profile/change-password", {
        currentPassword,
        newPassword,
      });
      setStatus("✅ Şifre başarıyla güncellendi");
      setCurrentPassword("");
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
      await api.put("/profile/update-security", {
        question: securityQuestion,
        answer: securityAnswer,
      });
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Hesabınızı silmek istediğinize emin misiniz?")) {
      try {
        await api.delete("/profile/delete");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("❌ Hesap silinemedi");
      }
    }
  };

  const isGoogleUser = user?.isGoogleUser;

  const securityQuestions = [
    "İlk evcil hayvanınızın adı nedir?",
    "En sevdiğiniz öğretmenin adı nedir?",
    "Annenizin kızlık soyadı nedir?",
    "İlkokulunuzun adı nedir?",
    "Doğduğunuz şehir nedir?",
  ];

  return (
    <div className="container py-4">
      <Navbar />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">Profil</h2>
          <p>
            <strong>Ad:</strong> {user?.name}
          </p>
          <p>
            <strong>E-posta:</strong> {user?.email}
          </p>

          {!isGoogleUser && (
            <>
              <form className="card p-3 mb-4" onSubmit={changePassword}>
                <h5>Şifre Güncelle</h5>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-2"
                  placeholder="Mevcut şifre"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-2"
                  placeholder="Yeni şifre"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mb-2"
                  placeholder="Yeni şifre (tekrar)"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    id="showPasswordCheck"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="showPasswordCheck"
                  >
                    Şifreyi göster
                  </label>
                </div>
                <button className="btn btn-primary" type="submit">
                  Şifreyi Güncelle
                </button>
              </form>

              <form className="card p-3 mb-4" onSubmit={updateSecurity}>
                <h5>Güvenlik Sorusu Güncelle</h5>
                <select
                  className="form-select mb-2"
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
                  className="form-control mb-2"
                  placeholder="Cevap"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
                <button className="btn btn-secondary" type="submit">
                  Güncelle
                </button>
              </form>
            </>
          )}

          {status && (
            <div
              className={`alert ${
                status.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {status}
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-dark" onClick={handleLogout}>
              Çıkış Yap
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              Hesabımı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

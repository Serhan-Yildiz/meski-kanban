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

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const isGoogleUser = user?.provider === "google";

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

import { useEffect, useState, useCallback } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
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
    await axios.post(
      "/auth/change-password",
      { password: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Şifre güncellendi");
    setNewPassword("");
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
        <input
          type="password"
          placeholder="Yeni şifre"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Şifreyi Güncelle</button>
      </form>

      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

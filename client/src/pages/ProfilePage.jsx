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
      const res = await axios.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Hata oluştu:", error.response.data);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const changePassword = async () => {
    await axios.post(
      "/auth/change-password",
      { password: newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Şifre güncellendi");
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
      <input
        type="password"
        placeholder="Yeni şifre"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={changePassword}>Şifreyi Güncelle</button>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/");
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

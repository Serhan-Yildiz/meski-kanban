import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/profile", {
        headers: { Authorization: `Bearer token ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profil alınamadı", err);
    }
  };

  const changePassword = async () => {
    try {
      await axios.post(
        "/auth/change-password",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Şifre değiştirildi");
    } catch {
      alert("Şifre değiştirilemedi");
    }
  };

  useEffect(() => {
    fetchProfile();
  });

  return (
    <div className="profile-page">
      <h2>Profil</h2>
      {user && (
        <>
          <p>
            <strong>Ad:</strong> {user.name}
          </p>
          <p>
            <strong>E-posta:</strong> {user.email}
          </p>
        </>
      )}
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
          navigate("/");
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

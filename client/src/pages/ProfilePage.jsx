import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchProfile = async () => {
    if (!token) {
      console.error("Token bulunamadı!");
      navigate("/login");
      return;
    }

    console.log("Gönderilen token:", token);

    try {
      const res = await axios.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      console.log("Başarılı:", res.data);
    } catch (error) {
      console.error("Hata oluştu:", error.response.data);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  });

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

  return (
    <div className="profile-page">
      <h2>Profil</h2>
      {user ? (
        <>
          <p>
            <strong>Ad:</strong> {user.name}
          </p>
          <p>
            <strong>E-posta:</strong> {user.email}
          </p>
        </>
      ) : (
        <p>Profil yükleniyor...</p>
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
          sessionStorage.removeItem("token");
          navigate("/");
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

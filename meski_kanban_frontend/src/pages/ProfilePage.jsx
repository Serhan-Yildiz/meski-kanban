import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "https://meski-kanban.onrender.com/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Bir hata oluştu");
    }
  };

  if (!profile) return <p className="auth-container">Profil yükleniyor...</p>;

  return (
    <div className="auth-container">
      <h2 className="auth-title">Profil Bilgileri</h2>
      <p>
        <strong>Ad:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>

      <form
        onSubmit={handleChangePassword}
        className="auth-form"
        style={{ marginTop: "20px" }}
      >
        <h3 style={{ color: "#004d66" }}>Parola Değiştir</h3>
        <input
          type="password"
          className="input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Mevcut Parola"
          required
        />
        <input
          type="password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Yeni Parola"
          required
        />
        <button type="submit" className="button">
          Güncelle
        </button>
        {message && <p className="error">{message}</p>}
      </form>

      <button
        onClick={handleLogout}
        className="button"
        style={{ backgroundColor: "#c62828", marginTop: "20px" }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}

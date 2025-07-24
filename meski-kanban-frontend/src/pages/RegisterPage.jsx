import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Kayıt sırasında hata: " + (err.response?.data?.message || "Sunucu hatası"));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const res = await api.post("/auth/google-login", {
        email: decoded.email,
        name: decoded.name,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Google ile kayıt başarısız");
    }
  };

  return (
    <div className="container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button">Kayıt Ol</button>
      </form>

      <div className="google-login-container">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google hatası")} />
      </div>

      <p style={{ marginTop: "10px" }}>
        Zaten hesabınız var mı?{" "}
        <a href="/login">Giriş Yap</a>
      </p>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default RegisterPage;

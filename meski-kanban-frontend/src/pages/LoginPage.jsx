import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Giriş başarısız: " + (err.response?.data?.message || "Sunucu hatası"));
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
    } catch (err) {
      setError("Google ile giriş başarısız: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>

      <div className="google-login-wrapper">
        <p>veya</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google ile giriş başarısız")}
        />
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default LoginPage;

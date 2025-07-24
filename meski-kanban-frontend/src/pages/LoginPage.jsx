import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

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
      setError("Giriş hatası: " + (err.response?.data?.message || "Sunucu hatası"));
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
      setError("Google ile giriş başarısız");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-800">Giriş Yap</h2>
        <p className="text-center text-gray-500 mb-6">Hesabınıza erişin</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md"
          >
            Giriş Yap
          </button>
        </form>
        <div className="my-4 text-center text-sm text-gray-500">veya</div>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google hatası")} />
        <p className="mt-4 text-sm text-center text-gray-500">
          Hesabınız yok mu?{" "}
          <a href="/register" className="text-blue-700 hover:underline font-semibold">Kayıt Ol</a>
        </p>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;

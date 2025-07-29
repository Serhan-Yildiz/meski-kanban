import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await axios.post("/auth/register", { email, password, name });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Kayıt hatası", err);
      alert("Kayıt başarısız");
    }
  };

  return (
    <div className="auth-form">
      <h2>Kayıt Ol</h2>
      <input
        type="text"
        placeholder="Ad Soyad"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Kayıt</button>
    </div>
  );
}

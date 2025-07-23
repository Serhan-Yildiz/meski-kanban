import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
      console.log("Form gönderildi"); // bu satırı ekle
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Kayıt başarılı, şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      alert("Kayıt başarısız: " + (err.response?.data?.message || "Sunucu hatası"));
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "100px" }}>
      <h2 style={{ color: "#006eae", marginBottom: "20px" }}>MESKİ Kanban Kayıt</h2>
      <form onSubmit={handleRegister}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="İsim"
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
        />
        <Button type="submit">Kayıt Ol</Button>
      </form>
      <p style={{ marginTop: "16px", fontSize: "14px" }}>
        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}

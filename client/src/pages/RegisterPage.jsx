import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios.js";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    if (!securityQuestion || !securityAnswer) {
      alert("Lütfen güvenlik sorusu ve cevabını doldurun.");
      return;
    }

    try {
      await axios.post("/auth/register", {
        email,
        password,
        name,
        security_question: securityQuestion,
        security_answer: securityAnswer,
      });
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
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
        type={showPassword ? "text" : "password"}
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Şifreyi tekrar girin"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <label>
        Şifreyi Göster
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
      </label>

      <p className="password-rules">
        Şifreniz en az 6 karakter uzunluğunda olmalıdır.
      </p>

      <label>Güvenlik Sorusu</label>
      <select
        value={securityQuestion}
        onChange={(e) => setSecurityQuestion(e.target.value)}
      >
        <option value="">Bir soru seçin</option>
        <option value="İlk evcil hayvanının adı?">
          İlk evcil hayvanının adı?
        </option>
        <option value="Doğduğun şehir?">Doğduğun şehir?</option>
        <option value="En sevdiğin öğretmen kimdi?">
          En sevdiğin öğretmen kimdi?
        </option>
      </select>

      <input
        type="text"
        placeholder="Cevabınız"
        value={securityAnswer}
        onChange={(e) => setSecurityAnswer(e.target.value)}
      />

      <button onClick={register}>Kayıt Ol</button>

      <a
        href="https://meski-kanban.onrender.com/auth/google"
        className="google-login"
      >
        Google ile Kayıt Ol
      </a>

      <div className="auth-links">
        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
      </div>
    </div>
  );
}

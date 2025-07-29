import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <img src="../public/logo.png" alt="MESKİ Kanban Logo" className="logo" />
      <h1>MESKİ Kanban'a Hoşgeldiniz</h1>
      <p>Görevlerinizi düzenleyin, panolar oluşturun, kartlarla yönetin.</p>
      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Giriş Yap</button>
        <button onClick={() => navigate("/register")}>Kayıt Ol</button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <img src="/logo.png" alt="MESKİ Kanban Logo" className="home-logo" />
      <h1 className="home-title">MESKİ Kanban'a Hoşgeldiniz</h1>
      <p className="home-subtitle">
        Görevlerinizi düzenleyin, panolar oluşturun, kartlarla yönetin.
      </p>
      <div className="home-buttons">
        <button className="btn login-btn" onClick={() => navigate("/login")}>
          Giriş Yap
        </button>
        <button
          className="btn register-btn"
          onClick={() => navigate("/register")}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

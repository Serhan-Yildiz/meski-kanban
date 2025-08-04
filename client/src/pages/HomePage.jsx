import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <img src="/logo.png" alt="MESKİ Kanban Logo" className="home-logo mb-4" />

      <h1 className="home-title mb-3">MESKİ Kanban'a Hoşgeldiniz</h1>
      <p className="home-subtitle lead mb-4">
        Görevlerinizi düzenleyin, panolar oluşturun, kartlarla yönetin.
      </p>

      <div className="home-buttons d-flex gap-3 flex-column flex-sm-row">
        <button
          className="btn login-btn px-4"
          onClick={() => navigate("/login")}
        >
          Giriş Yap
        </button>
        <button
          className="btn register-btn px-4"
          onClick={() => navigate("/register")}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

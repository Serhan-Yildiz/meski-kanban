import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <img
        src="/logo.png"
        alt="MESKİ Kanban Logo"
        className="mb-4"
        style={{ width: "120px", height: "auto" }}
      />

      <h1 className="mb-3">MESKİ Kanban'a Hoşgeldiniz</h1>
      <p className="lead mb-4">
        Görevlerinizi düzenleyin, panolar oluşturun, kartlarla yönetin.
      </p>

      <div className="d-flex gap-3 flex-column flex-sm-row">
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate("/login")}
        >
          Giriş Yap
        </button>
        <button
          className="btn btn-outline-primary px-4"
          onClick={() => navigate("/register")}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

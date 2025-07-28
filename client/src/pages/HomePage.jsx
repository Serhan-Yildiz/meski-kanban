import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>MESKİ Kanban'a Hoşgeldiniz</h1>
      <p>
        Bu uygulama, görevlerinizi düzenlemenize ve projelerinizi kolayca takip
        etmenize yardımcı olur.
      </p>

      <div>
        <button onClick={() => navigate("/login")}>Giriş Yap</button>
        <button onClick={() => navigate("/register")}>Kayıt Ol</button>
      </div>
    </div>
  );
}

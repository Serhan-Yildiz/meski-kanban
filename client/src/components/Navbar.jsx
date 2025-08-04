import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onAdd, inputValue, setInputValue }) {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const isDashboard = path === "/dashboard";
  const isBoardPage = path.startsWith("/boards/");
  const isProfilePage = path === "/profile";
  const shouldShowInput = isDashboard || isBoardPage;

  return (
    <nav className="navbar">
      <div className="nav-left">
        {!isDashboard && (
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Geri
          </button>
        )}
      </div>

      <div className="nav-title">MESKİ Kanban</div>

      <div className="nav-center">
        {shouldShowInput && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isDashboard ? "Yeni pano adı..." : "Yeni liste adı..."
              }
            />
            <button type="submit">
              {isDashboard ? "Pano Ekle" : "Liste Ekle"}
            </button>
          </form>
        )}
      </div>

      <div className="nav-right">
        {!isProfilePage && (
          <button onClick={() => navigate("/profile")}>Profilim</button>
        )}
      </div>
    </nav>
  );
}

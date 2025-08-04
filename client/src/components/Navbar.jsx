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
    <nav className="navbar fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center">
          {!isDashboard && (
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => navigate(-1)}
            >
              ← Geri
            </button>
          )}
          <span className="nav-title">MESKİ Kanban</span>
        </div>

        {shouldShowInput && (
          <form
            className="d-flex align-items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <input
              type="text"
              className="form-control form-control-sm me-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isDashboard ? "Yeni pano adı..." : "Yeni liste adı..."
              }
            />
            <button type="submit" className="btn btn-light btn-sm">
              {isDashboard ? "Pano Ekle" : "Liste Ekle"}
            </button>
          </form>
        )}

        {!isProfilePage && (
          <button
            className="btn btn-outline-light btn-sm mt-2 mt-sm-0"
            onClick={() => navigate("/profile")}
          >
            Profilim
          </button>
        )}
      </div>
    </nav>
  );
}

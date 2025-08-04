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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {!isDashboard && (
            <button
              className="btn btn-sm btn-light mr-2"
              onClick={() => navigate(-1)}
            >
              ← Geri
            </button>
          )}
          <span className="navbar-brand mb-0 h1">MESKİ Kanban</span>
        </div>

        {shouldShowInput && (
          <form
            className="form-inline d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <input
              type="text"
              className="form-control form-control-sm mr-2"
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
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/profile")}
          >
            Profilim
          </button>
        )}
      </div>
    </nav>
  );
}

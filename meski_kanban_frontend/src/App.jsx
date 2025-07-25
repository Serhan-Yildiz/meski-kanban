import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import AuthSuccess from "./pages/AuthSuccess"; // ✅ bunu ekle
import ProfilePage from "./pages/ProfilePage";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="*" element={<h2>404 - Sayfa bulunamadı</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import BoardView from "./BoardView";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/board/:id" element={<BoardView />} />
            <Route path="*" element={<h2>404 - Sayfa bulunamadı</h2>} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AuthSuccess from "./pages/AuthSuccess";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import BoardPage from "./pages/BoardPage";
import CardView from "./pages/CardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/boards/:id" element={<BoardPage />} />
        <Route path="/cards/:id" element={<CardView />} />
        <Route path="*" element={<NotFoundPage />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

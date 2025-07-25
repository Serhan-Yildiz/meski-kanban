import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import DashboardScreen from "./pages/DashboardScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

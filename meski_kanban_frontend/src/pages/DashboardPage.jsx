import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">MESKİ Kanban - Dashboard</h1>
      <p>Giriş başarılı! Bu ekranı özelleştirmeye başlayabilirsin.</p>
    </div>
  );
}

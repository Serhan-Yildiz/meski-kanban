import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  }, [navigate]);

  return (
    <div className="centered-page">
      <h2>Giriş başarılı! Yönlendiriliyorsunuz...</h2>
    </div>
  );
}

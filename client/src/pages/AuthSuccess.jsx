import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, search]);

  return (
    <div className="centered-page text-center">
      <h2 className="text-success">Giriş başarılı! Yönlendiriliyorsunuz...</h2>
    </div>
  );
}

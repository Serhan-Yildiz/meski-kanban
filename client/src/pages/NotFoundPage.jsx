import { Link } from "react-router-dom";
import "./App.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>
        Aradığınız sayfa bulunamadı. Link yanlış olabilir veya sayfa kaldırılmış
        olabilir.
      </p>
      <Link to="/">
        <button className="back-home-button">Ana Sayfaya Dön</button>
      </Link>
    </div>
  );
}

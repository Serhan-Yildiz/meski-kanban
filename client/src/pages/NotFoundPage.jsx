import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>
        Aradığınız sayfa mevcut değil. Bağlantı hatalı olabilir ya da sayfa
        silinmiş olabilir.
      </p>
      <Link to="/" className="notfound-button">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

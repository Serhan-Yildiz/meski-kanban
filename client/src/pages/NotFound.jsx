import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <h1 className="display-4 text-danger mb-3">404 - Sayfa Bulunamadı</h1>
      <p className="lead mb-4">
        Aradığınız sayfa mevcut değil. Bağlantı hatalı olabilir ya da sayfa
        silinmiş olabilir.
      </p>
      <Link to="/" className="btn btn-primary">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import Navbar from "../components/Navbar";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/cards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCard(res.data);
      } catch (err) {
        console.error("Kart detay alınamadı", err);
      }
    })();
  }, [id, token]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "yüksek":
        return "priority-high";
      case "orta":
        return "priority-medium";
      case "düşük":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <div className="card-view">
      <Navbar />
      {card ? (
        <>
          <h2>{card.title}</h2>

          <p>
            <strong>Açıklama:</strong>{" "}
            {card.description ? card.description : "Açıklama yok"}
          </p>

          <p>
            <strong>Öncelik:</strong>{" "}
            <span
              className={`priority-badge ${getPriorityClass(card.priority)}`}
            >
              {card.priority || "Belirtilmemiş"}
            </span>
          </p>

          <p>
            <strong>Durum:</strong>{" "}
            {card.is_done ? "✅ Tamamlandı" : "⏳ Devam ediyor"}
          </p>

          <p>
            <strong>Oluşturulma:</strong>{" "}
            {new Date(card.created_at).toLocaleString()}
          </p>

          <p>
            <strong>Güncellenme:</strong>{" "}
            {new Date(card.updated_at).toLocaleString()}
          </p>
        </>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

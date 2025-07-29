import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`/cards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCard(res.data);
      } catch (err) {
        console.error("Kart alınamadı", err);
      }
    };

    fetchCard();
  }, [id, token]);

  if (!card) return <div className="centered-page">Yükleniyor...</div>;

  return (
    <div className="card-view">
      <h2>{card.title}</h2>
      <p>{card.description}</p>
      <p>
        <strong>Öncelik:</strong> {card.priority || "Belirtilmemiş"}
      </p>
      <p>
        <strong>Etiketler:</strong> {(card.tags || []).join(", ")}
      </p>
      <p>
        <strong>Oluşturulma:</strong>{" "}
        {new Date(card.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Güncellenme:</strong>{" "}
        {new Date(card.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

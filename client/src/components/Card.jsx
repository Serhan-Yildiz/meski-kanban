import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

const API = import.meta.env.VITE_API_URL;

export default function Card({ card, refreshCards, isFirst, isLast }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const moveCard = async (direction) => {
    try {
      await axios.put(
        `/cards/${card.id}/move-${direction}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (refreshCards) refreshCards();
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Kart zaten sınırda.");
      } else {
        console.error("Kart taşınamadı:", err);
      }
    }
  };

  return (
    <div className="card-item">
      <div className="card-header">
        <span
          onClick={() => navigate(`/cards/${card.id}`)}
          className="card-title"
        >
          {card.title}
        </span>
        <div className="card-controls">
          {!isFirst && <button onClick={() => moveCard("up")}>⬆️</button>}
          {!isLast && <button onClick={() => moveCard("down")}>⬇️</button>}
        </div>
      </div>
    </div>
  );
}

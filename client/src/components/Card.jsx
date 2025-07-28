import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Card({ card, refreshCards }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const moveCard = async (direction) => {
    try {
      await axios.put(
        `${API}/cards/${card.id}/move-${direction}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (refreshCards) refreshCards();
    } catch (err) {
      console.error("Kart taşınamadı:", err);
    }
  };

  return (
    <div>
      <div>
        <span
          onClick={() => navigate(`/cards/${card.id}`)}
          style={{ cursor: "pointer" }}
        >
          {card.title}
        </span>
        <div>
          <button onClick={() => moveCard("up")}>⬆️</button>
          <button onClick={() => moveCard("down")}>⬇️</button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api.js";

export default function Card({ card, refreshCards, isFirst, isLast }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(card.is_done);

  const moveCard = async (direction) => {
    try {
      await api.put(`/cards/${card.id}/move-${direction}`);
      refreshCards();
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Kart zaten sınırda.");
      } else {
        console.error("Kart taşınamadı:", err);
      }
    }
  };

  const toggleDone = async () => {
    try {
      await api.put(`/cards/${card.id}`, { is_done: !checked });
      setChecked(!checked);
      refreshCards();
    } catch (err) {
      console.error("Kart durumu güncellenemedi", err);
    }
  };

  const deleteCard = async () => {
    if (!window.confirm("Bu kartı silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/cards/${card.id}`);
      refreshCards();
    } catch (err) {
      console.error("Kart silinemedi", err);
    }
  };

  return (
    <div className="card-item">
      <div className="card-header">
        <div className="card-label">
          <input
            type="checkbox"
            checked={checked}
            onChange={toggleDone}
            className="card-checkbox"
            aria-label="Tamamlandı olarak işaretle"
          />

          <span
            onClick={() => navigate(`/cards/${card.id}`)}
            className={`card-title ${checked ? "card-done" : ""}`}
          >
            <span className={`priority-dot ${card.priority}`}>
              {card.priority}
            </span>{" "}
            {card.title}
          </span>
        </div>

        <div className="card-controls">
          {!isFirst && (
            <button onClick={() => moveCard("up")} aria-label="Yukarı taşı">
              ⬆️
            </button>
          )}
          {!isLast && (
            <button onClick={() => moveCard("down")} aria-label="Aşağı taşı">
              ⬇️
            </button>
          )}
          <button onClick={deleteCard} aria-label="Kartı sil">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

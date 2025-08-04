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
    <div className="border rounded p-2 mb-2 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-start">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={checked}
            onChange={toggleDone}
            id={`card-${card.id}`}
            aria-label="Tamamlandı olarak işaretle"
          />
          <label
            className={`form-check-label fw-semibold cursor-pointer ${
              checked ? "text-decoration-line-through text-muted" : ""
            }`}
            onClick={() => navigate(`/cards/${card.id}`)}
            htmlFor={`card-${card.id}`}
          >
            <span
              className={`badge rounded-pill me-2 ${
                card.priority === "yüksek"
                  ? "bg-danger"
                  : card.priority === "orta"
                  ? "bg-warning text-dark"
                  : "bg-primary"
              }`}
            >
              {card.priority}
            </span>
            {card.title}
          </label>
        </div>

        <div className="btn-group btn-group-sm" role="group">
          {!isFirst && (
            <button
              onClick={() => moveCard("up")}
              className="btn btn-outline-secondary"
              aria-label="Yukarı taşı"
            >
              ⬆️
            </button>
          )}
          {!isLast && (
            <button
              onClick={() => moveCard("down")}
              className="btn btn-outline-secondary"
              aria-label="Aşağı taşı"
            >
              ⬇️
            </button>
          )}
          <button
            onClick={deleteCard}
            className="btn btn-outline-danger"
            aria-label="Kartı sil"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

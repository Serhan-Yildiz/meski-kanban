import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios.js";

export default function Card({ card, refreshCards, isFirst, isLast }) {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const [checked, setChecked] = useState(card.is_done);

  const moveCard = async (direction) => {
    try {
      await axios.put(
        `/cards/${card.id}/move-${direction}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.put(
        `/cards/${card.id}`,
        { is_done: !checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChecked(!checked);
      refreshCards();
    } catch (err) {
      console.error("Kart durumu güncellenemedi", err);
    }
  };

  const deleteCard = async () => {
    if (!window.confirm("Bu kartı silmek istediğine emin misin?")) return;
    try {
      await axios.delete(`/cards/${card.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshCards();
    } catch (err) {
      console.error("Kart silinemedi", err);
    }
  };

  return (
    <div className="card-item">
      <div className="card-header">
        <label className="card-label">
          <input type="checkbox" checked={checked} onChange={toggleDone} />
          <span
            onClick={() => navigate(`/cards/${card.id}`)}
            className={`card-title ${checked ? "card-done" : ""}`}
          >
            <span className={`priority-dot ${card.priority}`}>
              {card.priority}
            </span>

            {card.title}
          </span>
        </label>
        <div className="card-controls">
          {!isFirst && <button onClick={() => moveCard("up")}>⬆️</button>}
          {!isLast && <button onClick={() => moveCard("down")}>⬇️</button>}
          <button onClick={deleteCard}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

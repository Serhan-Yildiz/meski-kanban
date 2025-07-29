import { useState } from "react";
import axios from "../api/axios.js";
import Card from "./Card";

export default function ListColumn({ list, fetchLists }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const token = localStorage.getItem("token");

  const cards = list.cards || [];

  const createCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      await axios.post(
        "/cards",
        { title: newCardTitle, listId: list.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCardTitle("");
      fetchLists();
    } catch (err) {
      console.error("Kart oluşturulamadı", err);
    }
  };

  return (
    <div className="list-column">
      <h3>{list.title}</h3>
      <div className="list-cardlist">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            refreshCards={fetchLists}
            isFirst={index === 0}
            isLast={index === cards.length - 1}
          />
        ))}
      </div>
      <div className="list-addcard">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Yeni kart adı"
        />
        <button onClick={createCard}>Ekle</button>
      </div>
    </div>
  );
}

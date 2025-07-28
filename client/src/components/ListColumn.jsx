import { useState } from "react";
import axios from "axios";
import Card from "./Card";

const API = import.meta.env.VITE_API_URL;

export default function ListColumn({ list, onDelete, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [cards, setCards] = useState(list.cards || []);

  const token = localStorage.getItem("token");

  const handleTitleChange = () => {
    onUpdate(list.id, newTitle);
    setEditMode(false);
  };

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      const res = await axios.post(
        `${API}/cards`,
        { title: newCardTitle, listId: list.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCards([...cards, res.data]);
      setNewCardTitle("");
    } catch (err) {
      console.error("Kart eklenemedi", err);
    }
  };
  const refreshCardList = async () => {
    try {
      const res = await axios.get(`${API}/lists/board/${list.board_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedList = res.data.find((l) => l.id === list.id);
      if (updatedList) setCards(updatedList.cards);
    } catch (err) {
      console.error("Kartlar güncellenemedi:", err);
    }
  };

  return (
    <div>
      {editMode ? (
        <div>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleTitleChange}>Kaydet</button>
        </div>
      ) : (
        <h3 onClick={() => setEditMode(true)}>{list.title}</h3>
      )}

      <button onClick={() => onDelete(list.id)}>Listeyi Sil</button>

      <div>
        {cards.map((card) => (
          <Card key={card.id} card={card} refreshCards={refreshCardList} />
        ))}
      </div>

      <div >
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Yeni kart başlığı"
        />
        <button onClick={handleAddCard}>Ekle</button>
      </div>
    </div>
  );
}

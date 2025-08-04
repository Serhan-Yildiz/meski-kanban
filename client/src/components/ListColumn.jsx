import { useState } from "react";
import api from "../api/api.js";
import Card from "./Card";

export default function ListColumn({ list, fetchLists, isFirst, isLast }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const cards = list.cards || [];

  const createCard = async () => {
    if (!newCardTitle.trim()) return;
    try {
      await api.post("/cards", {
        title: newCardTitle,
        listId: list.id,
      });
      setNewCardTitle("");
      fetchLists();
    } catch (err) {
      console.error("Kart oluşturulamadı", err);
    }
  };

  const updateListTitle = async () => {
    if (!editedTitle.trim()) return;
    try {
      await api.put(`/lists/${list.id}`, { title: editedTitle });
      setEditing(false);
      fetchLists();
    } catch (err) {
      console.error("Liste güncellenemedi", err);
    }
  };

  const deleteList = async () => {
    if (!window.confirm("Bu listeyi silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/lists/${list.id}`);
      fetchLists();
    } catch (err) {
      console.error("Liste silinemedi", err);
    }
  };

  const moveList = async (direction) => {
    try {
      await api.put(`/lists/${list.id}/move`, { direction });
      fetchLists();
    } catch (err) {
      console.error("Liste taşınamadı", err);
    }
  };

  return (
    <div className="list-column">
      <div className="card-header">
        {editing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <button onClick={updateListTitle}>Kaydet</button>
            <button onClick={() => setEditing(false)}>İptal</button>
          </>
        ) : (
          <>
            <h3>{list.title}</h3>
            <div className="card-controls">
              {!isFirst && <button onClick={() => moveList("left")}>←</button>}
              {!isLast && <button onClick={() => moveList("right")}>→</button>}
              <button onClick={() => setEditing(true)}>Düzenle</button>
              <button onClick={deleteList}>Sil</button>
            </div>
          </>
        )}
      </div>

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCard();
          }}
        >
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Yeni kart adı"
          />
          <button type="submit">Ekle</button>
        </form>
      </div>
    </div>
  );
}

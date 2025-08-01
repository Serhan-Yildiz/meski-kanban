import { useState } from "react";
import axios from "../api/axios.js";
import Card from "./Card";

export default function ListColumn({ list, fetchLists, isFirst, isLast }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
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

  const updateListTitle = async () => {
    if (!editedTitle.trim()) return;
    try {
      await axios.put(
        `/lists/${list.id}`,
        { title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      fetchLists();
    } catch (err) {
      console.error("Liste güncellenemedi", err);
    }
  };

  const deleteList = async () => {
    if (!window.confirm("Bu listeyi silmek istediğine emin misin?")) return;

    try {
      await axios.delete(`/lists/${list.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLists();
    } catch (err) {
      console.error("Liste silinemedi", err);
    }
  };

  const moveList = async (direction) => {
    try {
      await axios.put(
        `/lists/${list.id}/move`,
        { direction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

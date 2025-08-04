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
    <div className="card m-2" style={{ width: "18rem" }}>
      <div className="card-body">
        {editing ? (
          <>
            <input
              type="text"
              className="form-control mb-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <div className="btn-group mb-2" role="group">
              <button
                className="btn btn-primary btn-sm"
                onClick={updateListTitle}
              >
                Kaydet
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(false)}
              >
                İptal
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className="card-title">{list.title}</h5>
            <div className="btn-group btn-group-sm mb-2" role="group">
              {!isFirst && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => moveList("left")}
                >
                  ←
                </button>
              )}
              {!isLast && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => moveList("right")}
                >
                  →
                </button>
              )}
              <button
                className="btn btn-outline-info"
                onClick={() => setEditing(true)}
              >
                Düzenle
              </button>
              <button className="btn btn-outline-danger" onClick={deleteList}>
                Sil
              </button>
            </div>
          </>
        )}

        <div className="mb-3">
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCard();
          }}
        >
          <input
            type="text"
            className="form-control mb-2"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Yeni kart adı"
          />
          <button type="submit" className="btn btn-success btn-sm w-100">
            Ekle
          </button>
        </form>
      </div>
    </div>
  );
}

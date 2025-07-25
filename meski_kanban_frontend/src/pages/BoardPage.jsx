import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import ListColumn from "../components/ListColumn";

export default function BoardPage() {
  const { id } = useParams(); // board ID
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    fetchLists();
  }, [id]);

  const fetchLists = async () => {
    try {
      const res = await api.get(`/lists/${id}`);
      setLists(res.data);
    } catch (err) {
      console.error("Listeler alınamadı:", err);
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await api.post("/lists", { title: newListTitle, board_id: id });
      setNewListTitle("");
      fetchLists();
    } catch (err) {
      console.error("Liste eklenemedi:", err);
    }
  };

  const handleAddCard = async (listId, cardTitle) => {
    try {
      await api.post("/cards", { title: cardTitle, list_id: listId });
      fetchLists();
    } catch (err) {
      console.error("Kart eklenemedi:", err);
    }
  };

  return (
    <div className="boardpage">
      <header className="board-header">
        <h1 className="board-title">📋 Pano</h1>
        <div className="list-adder">
          <Input
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Yeni liste adı"
          />
          <Button onClick={handleAddList}>+ Liste Ekle</Button>
        </div>
      </header>

      <section className="list-wrapper">
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            title={list.title}
            cards={list.cards}
            onAddCard={(title) => handleAddCard(list.id, title)}
          />
        ))}
      </section>
    </div>
  );
}

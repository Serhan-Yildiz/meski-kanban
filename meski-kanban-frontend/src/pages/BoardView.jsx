import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";
import ListColumn from "../components/ListColumn";

export default function BoardView() {
  const { id } = useParams(); // board id
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  const fetchLists = async () => {
    try {
      const res = await api.get(`/lists/${id}`);
      setLists(res.data);
    } catch (err) {
      console.error("Listeler alınamadı:", err);
      alert("Listeler alınamadı");
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await api.post("/lists", {
        title: newListTitle,
        board_id: id,
      });
      setNewListTitle("");
      fetchLists();
    } catch (err) {
      console.error("Liste eklenemedi:", err);
      alert("Liste eklenemedi");
    }
  };

  const handleAddCard = async (listId, cardTitle) => {
    try {
      await api.post("/cards", {
        title: cardTitle,
        list_id: listId,
      });
      fetchLists();
    } catch (err) {
      console.error("Kart eklenemedi:", err);
      alert("Kart eklenemedi");
    }
  };

  useEffect(() => {
    fetchLists();
  }, [id]);

  return (
    <div className="container">
      <h2>Board Sayfası</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Yeni liste başlığı"
        />
        <Button onClick={handleAddList}>Liste Ekle</Button>
      </div>

      <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            title={list.title}
            cards={list.cards}
            onAddCard={(cardTitle) => handleAddCard(list.id, cardTitle)}
          />
        ))}
      </div>
    </div>
  );
}

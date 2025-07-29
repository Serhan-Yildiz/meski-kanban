import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ListColumn from "../components/ListColumn";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBoard();
    fetchLists();
  });

  const fetchBoard = async () => {
    try {
      const res = await axios.get(`/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoard(res.data);
    } catch (err) {
      console.error("Pano alınamadı", err);
    }
  };

  const fetchLists = async () => {
    try {
      const res = await axios.get(`/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setLists(res.data);
      } else if (Array.isArray(res.data.lists)) {
        setLists(res.data.lists);
      } else {
        console.warn("⚠️ List response unexpected:", res.data);
        setLists([]);
      }
    } catch (err) {
      console.error("❌ Listeler alınamadı", err);
    }
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await axios.post(
        "/lists",
        { title: newListTitle, boardId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewListTitle("");
      fetchLists();
    } catch (err) {
      console.error("Liste oluşturulamadı", err);
    }
  };

  return (
    <div className="board-page">
      <h1>{board?.title || "Pano"}</h1>

      <div className="list-input">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Yeni liste adı"
        />
        <button onClick={createList}>Ekle</button>
      </div>

      <div className="list-container">
        {Array.isArray(lists) &&
          lists.map((list) => (
            <ListColumn key={list.id} list={list} fetchLists={fetchLists} />
          ))}
      </div>
    </div>
  );
}

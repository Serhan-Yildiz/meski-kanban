import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ListColumn from "../components/ListColumn";

const API = import.meta.env.VITE_API_URL;

export default function BoardPage() {
  const { id } = useParams(); // board ID
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API}/boards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(res.data);
      } catch {
        navigate("/dashboard");
      }
    };

    const fetchLists = async () => {
      try {
        const res = await axios.get(`${API}/lists/board/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLists(res.data);
      } catch (err) {
        console.error("Listeler alınamadı", err);
      }
    };

    fetchBoard();
    fetchLists();
  }, [id, navigate, token]);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await axios.post(
        `${API}/lists/board/${id}`,
        { title: newListTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists([...lists, res.data]);
      setNewListTitle("");
    } catch (err) {
      console.error("Liste eklenemedi", err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(`${API}/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(lists.filter((l) => l.id !== listId));
    } catch (err) {
      console.error("Liste silinemedi", err);
    }
  };

  const handleUpdateList = async (listId, newTitle) => {
    try {
      const res = await axios.put(
        `${API}/lists/${listId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(lists.map((l) => (l.id === listId ? res.data : l)));
    } catch (err) {
      console.error("Liste güncellenemedi", err);
    }
  };

  if (!board) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h1>{board.title}</h1>

      <div>
        <input
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Yeni liste başlığı"
        />
        <button onClick={handleAddList}>Liste Ekle</button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {lists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            onDelete={handleDeleteList}
            onUpdate={handleUpdateList}
          />
        ))}
      </div>
    </div>
  );
}

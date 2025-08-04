import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api.js";
import ListColumn from "../components/ListColumn";
import Navbar from "../components/Navbar";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
      setEditedTitle(res.data.title);
    } catch (err) {
      console.error("Pano getirilemedi:", err);
      setError("Pano getirilemedi.");
    }
  };

  const fetchLists = async () => {
    try {
      const res = await api.get(`/lists/board/${id}`);
      setLists(res.data);
    } catch (err) {
      console.error("Listeler getirilemedi:", err);
      setError("Listeler getirilemedi.");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchBoard(), fetchLists()]);
      setLoading(false);
    };
    load();
  }, [id]);

  const createList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await api.post(`/lists/board/${id}`, { title: newListTitle });
      setNewListTitle("");
      await fetchLists();
    } catch (err) {
      console.error("Liste oluşturulamadı:", err);
    }
  };

  const updateBoardTitle = async () => {
    try {
      await api.put(`/boards/${id}`, { title: editedTitle });
      setBoard((prev) => ({ ...prev, title: editedTitle }));
      setEditingTitle(false);
    } catch (err) {
      console.error("Pano adı güncellenemedi:", err);
    }
  };

  if (loading) {
    return (
      <div className="board-page">
        <Navbar
          onAdd={createList}
          inputValue={newListTitle}
          setInputValue={setNewListTitle}
        />
        <p className="loading-text">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-page">
        <Navbar />
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="board-page">
      <Navbar
        onAdd={createList}
        inputValue={newListTitle}
        setInputValue={setNewListTitle}
      />

      <div className="board-title">
        {editingTitle ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <button onClick={updateBoardTitle}>Kaydet</button>
            <button onClick={() => setEditingTitle(false)}>İptal</button>
          </>
        ) : (
          <h1 onClick={() => setEditingTitle(true)} className="editable-title">
            {board.title} ✏️
          </h1>
        )}
      </div>

      <div className="list-container">
        {lists.map((list, index) => (
          <ListColumn
            key={list.id}
            list={list}
            fetchLists={fetchLists}
            isFirst={index === 0}
            isLast={index === lists.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

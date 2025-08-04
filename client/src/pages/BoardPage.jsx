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
      <>
        <Navbar
          onAdd={createList}
          inputValue={newListTitle}
          setInputValue={setNewListTitle}
        />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Yükleniyor...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <p className="text-danger">{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className="pt-5">
      <Navbar
        onAdd={createList}
        inputValue={newListTitle}
        setInputValue={setNewListTitle}
      />

      <div className="container text-center mt-4 mb-3">
        {editingTitle ? (
          <div className="d-flex justify-content-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="form-control w-auto"
            />
            <button onClick={updateBoardTitle} className="btn btn-primary mx-1">
              Kaydet
            </button>
            <button
              onClick={() => setEditingTitle(false)}
              className="btn btn-secondary"
            >
              İptal
            </button>
          </div>
        ) : (
          <h2
            onClick={() => setEditingTitle(true)}
            className="editable-title"
            style={{ cursor: "pointer" }}
          >
            {board.title} ✏️
          </h2>
        )}
      </div>

      <div className="d-flex overflow-auto px-3">
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

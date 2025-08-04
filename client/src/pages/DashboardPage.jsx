import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardTitle, setEditBoardTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error("Panolar alınamadı", err);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      await api.post("/boards", { title: newBoardTitle });
      setNewBoardTitle("");
      fetchBoards();
    } catch (err) {
      console.error("Pano oluşturulamadı", err);
    }
  };

  const startEditing = (board) => {
    setEditBoardId(board.id);
    setEditBoardTitle(board.title);
  };

  const cancelEditing = () => {
    setEditBoardId(null);
    setEditBoardTitle("");
  };

  const saveEditedBoard = async () => {
    try {
      await api.put(`/boards/${editBoardId}`, { title: editBoardTitle });
      cancelEditing();
      fetchBoards();
    } catch (err) {
      console.error("Pano güncellenemedi", err);
    }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Bu panoyu silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/boards/${id}`);
      fetchBoards();
    } catch (err) {
      console.error("Pano silinemedi", err);
    }
  };

  return (
    <div className="dashboard">
      <Navbar
        onAdd={createBoard}
        inputValue={newBoardTitle}
        setInputValue={setNewBoardTitle}
      />

      <h2 className="dashboard-heading">Panolarım</h2>

      <div className="dashboard-board-list">
        {boards.map((board) => (
          <div key={board.id} className="dashboard-board">
            {editBoardId === board.id ? (
              <>
                <input
                  type="text"
                  value={editBoardTitle}
                  onChange={(e) => setEditBoardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEditedBoard();
                    }
                  }}
                />
                <button onClick={saveEditedBoard}>Kaydet</button>
                <button onClick={cancelEditing}>İptal</button>
              </>
            ) : (
              <>
                <div
                  className="dashboard-board-title"
                  onClick={() => navigate(`/boards/${board.id}`)}
                >
                  {board.title}
                </div>
                <div className="dashboard-board-controls">
                  <button onClick={() => startEditing(board)}>Düzenle</button>
                  <button onClick={() => deleteBoard(board.id)}>Sil</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

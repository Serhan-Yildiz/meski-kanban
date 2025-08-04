import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardTitle, setEditBoardTitle] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, [token]);

  const fetchBoards = async () => {
    try {
      const res = await axios.get("/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    } catch (err) {
      console.error("Panolar alınamadı", err);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    await axios.post(
      "/boards",
      { title: newBoardTitle },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNewBoardTitle("");
    fetchBoards();
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
    await axios.put(
      `/boards/${editBoardId}`,
      { title: editBoardTitle },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    cancelEditing();
    fetchBoards();
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Bu panoyu silmek istediğine emin misin?")) return;
    await axios.delete(`/boards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBoards();
  };

  return (
    <div className="dashboard">
      <Navbar
        onAdd={createBoard}
        inputValue={newBoardTitle}
        setInputValue={setNewBoardTitle}
      />

      <h2 style={{ marginLeft: "1rem" }}>Panolarım</h2>

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
                <div onClick={() => navigate(`/boards/${board.id}`)}>
                  {board.title}
                </div>
                <div style={{ marginTop: "10px" }}>
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

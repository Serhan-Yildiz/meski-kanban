import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
    try {
      await axios.post(
        "/boards",
        { title: newBoardTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewBoardTitle("");
      fetchBoards();
    } catch (err) {
      console.error("Pano oluşturulamadı", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panolarım</h1>
        <button onClick={() => navigate("/profile")}>Profilim</button>
      </div>

      <div className="dashboard-new-board">
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="Yeni pano adı"
        />
        <button onClick={createBoard}>Ekle</button>
      </div>

      <div className="dashboard-board-list">
        {boards.map((board) => (
          <div
            key={board.id}
            className="dashboard-board"
            onClick={() => navigate(`/boards/${board.id}`)}
          >
            {board.title}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error("Panolar alınamadı:", err);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await api.post("/boards", { name: newBoardName });
      setNewBoardName("");
      fetchBoards();
      navigate(`/board/${res.data.id}`);
    } catch (err) {
      console.error("Pano oluşturulamadı:", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Boards</h1>
          <p className="dashboard-subtitle">Manage your projects and tasks</p>
        </div>
        <div className="user-info">👤 Kullanıcı</div>
      </div>

      <div className="board-grid">
        {/* Yeni pano kutusu */}
        <div className="board-tile new-board">
          <div className="dashed-box">
            <div className="plus-icon">+</div>
            <input
              type="text"
              placeholder="Yeni pano oluştur"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              className="new-board-input"
            />
          </div>
        </div>

        {/* Panolar */}
        {boards.map((board, i) => (
          <div
            key={board.id}
            className="board-tile"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <div
              className="board-color-bar"
              style={{ backgroundColor: getColor(i) }}
            />
            <div className="board-content">
              <h3 className="board-title">{board.name}</h3>
              <p className="board-desc">Proje panosu</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getColor(index) {
  const colors = ["#007ba7", "#00838f", "#00acc1", "#0097a7", "#006064"];
  return colors[index % colors.length];
}

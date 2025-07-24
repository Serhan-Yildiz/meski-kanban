import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";
import BoardTile from "../components/BoardTile";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error("Board'lar alınamadı:", err);
      alert("Board'lar alınamadı");
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await api.post("/boards", { name: newBoardName.trim() });
      setNewBoardName("");
      fetchBoards();
      navigate(`/board/${res.data.id}`);
    } catch (err) {
      console.error("Board oluşturulamadı:", err);
      alert("Board oluşturulamadı");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Panolarım</h2>

      <div className="create-board-bar">
        <Input
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Yeni pano adı"
        />
        <Button onClick={handleCreateBoard}>Ekle</Button>
      </div>

      <div className="board-grid">
        {boards.map((board) => (
          <BoardTile
            key={board.id}
            title={board.name}
            onClick={() => navigate(`/board/${board.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

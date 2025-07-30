import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => { fetchBoards(); });

  const fetchBoards = async () => {
    try {
      const res = await axios.get("/boards", { headers: { Authorization: `Bearer ${token}` } });
      setBoards(res.data);
    } catch (err) {
      console.error("Panolar alınamadı", err);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    await axios.post("/boards", { title: newBoardTitle }, { headers: { Authorization: `Bearer ${token}` } });
    setNewBoardTitle("");
    fetchBoards();
  };

  return (
    <div className="dashboard">
      <Navbar onAdd={createBoard} inputValue={newBoardTitle} setInputValue={setNewBoardTitle} />

      <div className="dashboard-board-list">
        {boards.map((board) => (
          <div key={board.id} className="dashboard-board" onClick={() => navigate(`/boards/${board.id}`)}>
            {board.title}
          </div>
        ))}
      </div>
    </div>
  );
}

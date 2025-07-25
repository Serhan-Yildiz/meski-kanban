import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const DashboardPage = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(
        "https://meski-kanban.onrender.com/boards",
        {
          withCredentials: true,
        }
      );
      setBoards(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const response = await axios.post(
        "https://meski-kanban.onrender.com/boards",
        { title: newBoardTitle },
        { withCredentials: true }
      );
      setBoards([...boards, response.data]);
      setNewBoardTitle("");
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-app-title">Trello Clone</h1>
        <div className="dashboard-user">👤 Kullanıcı</div>
      </header>

      <h2 className="dashboard-title">Your Boards</h2>
      <p className="dashboard-subtitle">Manage your projects and tasks</p>

      <div className="dashboard-grid">
        <div className="board-tile create-board">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="New board title"
            className="create-board-input"
          />
          <button onClick={handleCreateBoard} className="create-board-btn">
            Create
          </button>
        </div>

        {boards.map((board) => (
          <div
            key={board.id}
            className="board-tile"
            onClick={() => handleBoardClick(board.id)}
          >
            <div
              className="board-color-bar"
              style={{ backgroundColor: board.color || "#448aff" }}
            />
            <div className="board-tile-content">
              <h3>{board.title}</h3>
              <p>{board.description || "No description"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

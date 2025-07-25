import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardTile from "../components/BoardTile";
import "../App.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  useEffect(() => {
    // TODO: Replace with API call to fetch boards
    setBoards([
      {
        id: 1,
        title: "Project Alpha",
        description: "Main development board",
        color: "#4285F4",
      },
      {
        id: 2,
        title: "Marketing Campaign",
        description: "Q1 marketing initiatives",
        color: "#34A853",
      },
      {
        id: 3,
        title: "Bug Tracker",
        description: "Track and fix issues",
        color: "#EA4335",
      },
      {
        id: 4,
        title: "Design System",
        description: "UI/UX components",
        color: "#A142F4",
      },
      {
        id: 5,
        title: "User Research",
        description: "Customer feedback",
        color: "#FB8C00",
      },
    ]);
    setLoading(false);
  }, []);

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;

    const newBoard = {
      id: boards.length + 1,
      title: newBoardTitle,
      description: "New board",
      color: "#ccc", // Default color, can enhance later
    };

    setBoards([...boards, newBoard]);
    setNewBoardTitle("");
    setShowInput(false);
  };

  const handleBoardClick = (id) => {
    navigate(`/board/${id}`);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="logo">Trello Clone</h1>
        <div className="user-info">👤 John Doe</div>
      </header>

      <main className="dashboard-main">
        <h2>Your Boards</h2>
        <p className="subtitle">Manage your projects and tasks</p>

        <div className="board-grid">
          <div
            className="board-tile create-board"
            onClick={() => setShowInput(true)}
          >
            {showInput ? (
              <div className="create-board-form">
                <input
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Enter board name"
                  autoFocus
                />
                <button onClick={handleCreateBoard}>Create</button>
              </div>
            ) : (
              <>
                <span className="plus">+</span>
                <p>Create new board</p>
              </>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            boards.map((board) => (
              <BoardTile
                key={board.id}
                title={board.title}
                description={board.description}
                color={board.color}
                onClick={() => handleBoardClick(board.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

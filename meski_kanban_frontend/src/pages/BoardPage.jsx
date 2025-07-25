import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import BoardTile from "../components/BoardTile";
import "../App.css";

function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/boards");
        setBoards(res.data);
      } catch (err) {
        console.error("Panolar alınamadı", err);
        setError("Panolar yüklenemedi");
      }
    };

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data?.name || "Kullanıcı");
      } catch (err) {
        console.error("Kullanıcı bilgisi alınamadı", err);
        console.warn("Kullanıcı bilgisi alınamadı");
      }
    };

    fetchBoards();
    fetchUser();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/boards", { name: newBoardName });
      setBoards([...boards, res.data]);
      setNewBoardName("");
    } catch (err) {
      console.error("Pano oluşturulamadı", err);
      setError("Pano oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>📋 MESKİ Kanban Panoları</h1>
        <div className="user-info">👤 {user || "Kullanıcı"}</div>
      </header>

      <section className="new-board-section">
        <input
          type="text"
          className="input"
          placeholder="Yeni pano adı"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
        <button
          className="button"
          onClick={handleCreateBoard}
          disabled={loading}
        >
          {loading ? "Oluşturuluyor..." : "Pano Oluştur"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="board-grid">
        {boards.length === 0 ? (
          <p className="info-text">Henüz bir pano oluşturmadınız.</p>
        ) : (
          boards.map((board) => (
            <BoardTile
              key={board.id}
              title={board.name}
              onClick={() => navigate(`/board/${board.id}`)}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default DashboardPage;

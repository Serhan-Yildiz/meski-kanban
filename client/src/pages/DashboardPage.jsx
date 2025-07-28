import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        navigate("/login");
      }
    };

    const fetchBoards = async () => {
      try {
        const res = await axios.get(`${API}/boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(res.data);
      } catch (err) {
        console.error("Boardları alırken hata:", err);
      }
    };

    fetchUser();
    fetchBoards();
  }, [navigate, token]);

  const handleCreateBoard = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(
        `${API}/boards`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoards([...boards, res.data]);
      setNewTitle("");
    } catch (err) {
      console.error("Board oluşturulamadı:", err);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await axios.delete(`${API}/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(boards.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Board silinemedi:", err);
    }
  };

  return (
    <div>
      <header>
        <h1>MESKİ Kanban</h1>
        {user && (
          <button onClick={() => navigate("/profile")}>
            {user.name || user.email}
          </button>
        )}
      </header>

      <main>
        <div>
          <input
            type="text"
            placeholder="Yeni board başlığı"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleCreateBoard}>Oluştur</button>
        </div>

        <ul>
          {boards.map((board) => (
            <li key={board.id}>
              <span>{board.title}</span>
              <button onClick={() => handleDeleteBoard(board.id)}>Sil</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

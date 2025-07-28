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
      const res = await axios.get(`${API}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(res.data);
    };

    fetchUser();
    fetchBoards();
  }, [navigate, token]);

  const handleCreateBoard = async () => {
    if (!newTitle.trim()) return;
    const res = await axios.post(
      `${API}/boards`,
      { title: newTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBoards([...boards, res.data]);
    setNewTitle("");
  };

  const handleDeleteBoard = async (id) => {
    await axios.delete(`${API}/boards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBoards(boards.filter((b) => b.id !== id));
  };

  return (
    <div>
      <div>
        <h1>MESKİ Kanban</h1>
        {user && (
          <button onClick={() => navigate("/me")}>
            {user.name || user.email}
          </button>
        )}
      </div>

      <div>
        <div>
          <input
            type="text"
            placeholder="Yeni board başlığı"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleCreateBoard}>Oluştur</button>
        </div>

        <div>
          {boards.map((board) => (
            <div key={board.id}>
              <span>{board.title}</span>
              <div>
                <button>Düzenle</button>
                <button onClick={() => handleDeleteBoard(board.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

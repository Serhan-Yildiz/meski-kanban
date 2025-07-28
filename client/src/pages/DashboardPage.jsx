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
      <div className="flex justify-between items-center bg-blue-900 text-white px-4 py-3">
        <h1 className="text-xl font-bold">MESKİ Kanban</h1>
        {user && (
          <button
            onClick={() => navigate("/profile")}
            className="bg-white text-blue-900 px-3 py-1 rounded"
          >
            {user.name || user.email}
          </button>
        )}
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Yeni board başlığı"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border px-2 py-1 flex-1"
          />
          <button
            onClick={handleCreateBoard}
            className="bg-blue-900 text-white px-4 py-1 rounded"
          >
            Oluştur
          </button>
        </div>

        <div className="grid gap-3">
          {boards.map((board) => (
            <div
              key={board.id}
              className="border rounded px-4 py-2 flex justify-between items-center"
            >
              <span>{board.title}</span>
              <div className="flex gap-2">
                <button className="text-sm px-2 py-1 bg-yellow-500 text-white rounded">
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

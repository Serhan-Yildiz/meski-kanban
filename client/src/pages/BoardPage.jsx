import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API}/boards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(res.data);
      } catch (err) {
        console.error("Pano alınamadı", err);
        navigate("/dashboard");
      }
    };

    const fetchLists = async () => {
      try {
        const res = await axios.get(`${API}/boards/${id}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLists(res.data);
      } catch (err) {
        console.error("Listeler alınamadı", err);
      }
    };

    fetchBoard();
    fetchLists();
  }, [id, navigate, token]);

  if (!board) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h1>{board.title}</h1>

      {lists.length === 0 && <p>Henüz liste yok</p>}

      <div>
        {lists.map((list) => (
          <div key={list.id}>
            <h3>{list.title}</h3>
            <ul>
              {list.cards.map((card) => (
                <li key={card.id}>{card.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

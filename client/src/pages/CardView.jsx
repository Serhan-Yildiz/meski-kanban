import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function CardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [card, setCard] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchCard = async () => {
      try {
        const res = await axios.get(`${API}/cards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCard(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      } catch (err) {
        console.error("Kart alınamadı", err);
        navigate("/dashboard");
      }
    };

    fetchCard();
  }, [id, navigate, token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API}/cards/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCard(res.data);
      setMessage("Güncellendi!");
    } catch {
      setMessage("Güncelleme başarısız.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch {
      setMessage("Silinemedi.");
    }
  };

  if (!card) return <p>Kart yükleniyor...</p>;

  return (
    <div>
      <h2>Kart Detayı</h2>

      <label>Başlık</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Açıklama</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
      />

      <div>
        <button onClick={handleUpdate}>Güncelle</button>
        <button onClick={handleDelete}>Sil</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

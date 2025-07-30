import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import Navbar from "../components/Navbar";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCard = async () => {
    try {
      const res = await axios.get(`/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCard(res.data);
      setDesc(res.data.description || "");
      setPriority(res.data.priority || "");
    } catch (err) {
      console.error("Kart detay alınamadı", err);
    }
  };

  useEffect(() => {
    fetchCard();
  });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "yüksek":
        return "priority-high";
      case "orta":
        return "priority-medium";
      case "düşük":
        return "priority-low";
      default:
        return "";
    }
  };

  const updateCard = async () => {
    try {
      await axios.put(
        `/cards/${id}`,
        { description: desc, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCard();
      alert("Kart güncellendi");
    } catch (err) {
      console.error("Kart güncellenemedi", err);
    }
  };

  return (
    <div className="card-view">
      <Navbar />
      {card ? (
        <>
          <h2>{card.title}</h2>

          <label>
            <strong>Açıklama:</strong>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
            />
          </label>

          <label>
            <strong>Öncelik:</strong>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`priority-badge ${getPriorityClass(priority)}`}
            >
              <option value="">Seç...</option>
              <option value="düşük">düşük</option>
              <option value="orta">orta</option>
              <option value="yüksek">yüksek</option>
            </select>
          </label>

          <button onClick={updateCard}>Güncelle</button>

          <p>
            <strong>Durum:</strong>{" "}
            {card.is_done ? "✅ Tamamlandı" : "⏳ Devam ediyor"}
          </p>

          <p>
            <strong>Oluşturulma:</strong>{" "}
            {new Date(card.created_at).toLocaleString()}
          </p>

          <p>
            <strong>Güncellenme:</strong>{" "}
            {new Date(card.updated_at).toLocaleString()}
          </p>
        </>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

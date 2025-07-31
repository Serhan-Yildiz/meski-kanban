import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import Navbar from "../components/Navbar";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [desc, setDesc] = useState("");
  const [originalDesc, setOriginalDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(true);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCard = async () => {
    try {
      const res = await axios.get(`/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setCard(data);
      setDesc(data.description || "");
      setOriginalDesc(data.description || "");
      setPriority(data.priority || "");
      setIsEditingDesc(!data.description); // açıklama yoksa direkt input göster
    } catch (err) {
      console.error("Kart detay alınamadı", err);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [id, token]);

  const handleSaveDesc = async () => {
    try {
      const res = await axios.put(
        `/cards/${id}`,
        { description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCard(res.data);
      setDesc(res.data.description || "");
      setOriginalDesc(res.data.description || "");
      setIsEditingDesc(false);
    } catch (err) {
      console.error("Açıklama güncellenemedi", err);
    }
  };

  const handleCancelDesc = () => {
    setDesc(originalDesc);
    setIsEditingDesc(false);
  };

  const handleEditDesc = () => {
    setIsEditingDesc(true);
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await axios.put(
        `/cards/${id}`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPriority(newPriority);
      setCard(res.data);
    } catch (err) {
      console.error("Öncelik güncellenemedi", err);
    }
  };

  return (
    <div className="card-view">
      <Navbar />
      {card ? (
        <>
          <h2>{card.title}</h2>

          <div>
            <strong>Açıklama:</strong>
            {isEditingDesc ? (
              <>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                />
                <div>
                  <button onClick={handleSaveDesc}>Kaydet</button>{" "}
                  <button onClick={handleCancelDesc}>İptal</button>
                </div>
              </>
            ) : (
              <>
                <p>{desc || "Açıklama yok"}</p>
                <button onClick={handleEditDesc}>Düzenle</button>
              </>
            )}
          </div>

          <div>
            <strong>Öncelik:</strong>
            <div className="priority-radio-group" >
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="düşük"
                  checked={priority === "düşük"}
                  onChange={() => handlePriorityChange("düşük")}
                />
                <span className="priority-low">Düşük</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="orta"
                  checked={priority === "orta"}
                  onChange={() => handlePriorityChange("orta")}
                />
                <span className="priority-medium">Orta</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="yüksek"
                  checked={priority === "yüksek"}
                  onChange={() => handlePriorityChange("yüksek")}
                />
                <span className="priority-high">Yüksek</span>
              </label>
            </div>
          </div>

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

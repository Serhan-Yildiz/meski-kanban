import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import Navbar from "../components/Navbar";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [originalDesc, setOriginalDesc] = useState("");
  const [priority, setPriority] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [originalTitle, setOriginalTitle] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCard = async () => {
    try {
      const res = await axios.get(`/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setCard(data);
      setTitle(data.title || "");
      setOriginalTitle(data.title || "");
      setDesc(data.description || "");
      setOriginalDesc(data.description || "");
      setPriority(data.priority || "");
      setIsEditingDesc(!data.description);
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

  const handleSaveTitle = async () => {
    try {
      const res = await axios.put(
        `/cards/${id}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCard(res.data);
      setOriginalTitle(res.data.title || "");
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Başlık güncellenemedi", err);
    }
  };

  const handleCancelTitle = () => {
    setTitle(originalTitle);
    setIsEditingTitle(false);
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  return (
    <div className="card-view">
      <Navbar />
      {card ? (
        <>
          <div>
            <strong>Başlık:</strong>{" "}
            {isEditingTitle ? (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button onClick={handleSaveTitle}>Kaydet</button>
                <button onClick={handleCancelTitle}>İptal</button>
              </>
            ) : (
              <>
                <h2 style={{ display: "inline" }}>{title}</h2>{" "}
                <button onClick={handleEditTitle}>Düzenle</button>
              </>
            )}
          </div>

          <div>
            <strong>Açıklama:</strong>
            {isEditingDesc ? (
              <>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveDesc();
                    }
                  }}
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
            <div className="priority-radio-group">
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
        </>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

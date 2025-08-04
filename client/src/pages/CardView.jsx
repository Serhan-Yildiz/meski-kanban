import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api.js";
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

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await api.get(`/cards/${id}`);
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

    fetchCard();
  }, [id]);

  const handleSaveDesc = async () => {
    try {
      const res = await api.put(`/cards/${id}`, { description: desc });
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
      const res = await api.put(`/cards/${id}`, { priority: newPriority });
      setPriority(newPriority);
      setCard(res.data);
    } catch (err) {
      console.error("Öncelik güncellenemedi", err);
    }
  };

  const handleSaveTitle = async () => {
    try {
      const res = await api.put(`/cards/${id}`, { title });
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
    <>
      <Navbar />
      <div className="container mt-4 card-view">
        {card ? (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="mb-4 card-title-section">
                <h5>Başlık:</h5>
                {isEditingTitle ? (
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="btn btn-primary"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelTitle}
                      className="btn btn-secondary"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="editable-title">{title}</h3>
                    <button
                      onClick={handleEditTitle}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Düzenle
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4 card-desc-section">
                <h5>Açıklama:</h5>
                {isEditingDesc ? (
                  <>
                    <textarea
                      className="form-control"
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
                    <div className="mt-2">
                      <button
                        onClick={handleSaveDesc}
                        className="btn btn-primary mx-1"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={handleCancelDesc}
                        className="btn btn-secondary"
                      >
                        İptal
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{desc || "Açıklama yok"}</p>
                    <button
                      onClick={handleEditDesc}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Düzenle
                    </button>
                  </>
                )}
              </div>

              <div className="mb-4 card-priority-section">
                <h5>Öncelik:</h5>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priority"
                    id="priorityLow"
                    value="düşük"
                    checked={priority === "düşük"}
                    onChange={() => handlePriorityChange("düşük")}
                  />
                  <label
                    className="form-check-label priority-low"
                    htmlFor="priorityLow"
                  >
                    Düşük
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priority"
                    id="priorityMedium"
                    value="orta"
                    checked={priority === "orta"}
                    onChange={() => handlePriorityChange("orta")}
                  />
                  <label
                    className="form-check-label priority-medium"
                    htmlFor="priorityMedium"
                  >
                    Orta
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priority"
                    id="priorityHigh"
                    value="yüksek"
                    checked={priority === "yüksek"}
                    onChange={() => handlePriorityChange("yüksek")}
                  />
                  <label
                    className="form-check-label priority-high"
                    htmlFor="priorityHigh"
                  >
                    Yüksek
                  </label>
                </div>
              </div>

              <p>
                <strong>Durum:</strong>{" "}
                {card.is_done ? "✅ Tamamlandı" : "⏳ Devam ediyor"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Yükleniyor...</p>
          </div>
        )}
      </div>
    </>
  );
}

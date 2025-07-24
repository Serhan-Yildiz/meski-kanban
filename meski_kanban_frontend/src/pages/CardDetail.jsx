import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";

export default function CardDetail() {
  const { id } = useParams(); // card id
  const [card, setCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchCard = async () => {
    try {
      const res = await api.get(`/cards/${id}`);
      setCard(res.data);
    } catch (err) {
      console.error("Kart bilgisi alınamadı:", err);
      alert("Kart bilgisi alınamadı");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Yorumlar alınamadı:", err);
      alert("Yorumlar alınamadı");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post("/comments", {
        card_id: id,
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
      alert("Yorum eklenemedi");
    }
  };

  useEffect(() => {
    fetchCard();
    fetchComments();
  }, [id]);

  if (!card) return <div className="container">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2>{card.title}</h2>
      <p style={{ marginBottom: "20px" }}>
        {card.description || "Açıklama yok."}
      </p>

      <h4>Yorumlar</h4>
      <div style={{ marginBottom: "10px" }}>
        {comments.map((c) => (
          <div
            key={c.id}
            className="card"
            style={{ backgroundColor: "#f9f9f9", fontSize: "14px" }}
          >
            {c.content}
          </div>
        ))}
      </div>

      <Input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Yorum ekle ve Enter'a bas"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddComment();
        }}
      />
    </div>
  );
}

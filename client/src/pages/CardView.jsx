import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import Navbar from "../components/Navbar";

export default function CardView() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCard(res.data);
    })();
  }, [id, token]);

  return (
    <div className="card-view">
      <Navbar />
      <h2>{card?.title}</h2>
      <p>{card?.description}</p>
      <p>
        <strong>Öncelik:</strong> {card?.priority || "Belirtilmemiş"}
      </p>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function Card({ card }) {
  const navigate = useNavigate();

  return <div onClick={() => navigate(`/cards/${card.id}`)}>{card.title}</div>;
}

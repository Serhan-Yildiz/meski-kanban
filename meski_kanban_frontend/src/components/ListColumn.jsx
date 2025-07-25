import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function ListColumn({ title, cards = [], onAddCard }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(newCardTitle.trim());
    setNewCardTitle("");
    setShowInput(false);
  };

  return (
    <div className="list-column">
      <div className="list-header">
        <h3>{title}</h3>
        <span className="card-count">{cards.length}</span>
      </div>

      <div className="card-list">
        {cards.map((card, index) => (
          <div key={index} className="card-item">
            <p>{card.title}</p>
          </div>
        ))}
      </div>

      {showInput ? (
        <div className="add-card-form">
          <Input
            placeholder="Kart başlığı"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          <Button onClick={handleAddCard}>Ekle</Button>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setShowInput(true)}>
          + Kart Ekle
        </button>
      )}
    </div>
  );
}

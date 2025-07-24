import React from "react";
import CardBox from "./CardBox";

export default function ListColumn({ title, cards = [], onAddCard }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      onAddCard(e.target.value.trim());
      e.target.value = "";
    }
  };

  return (
    <div className="list">
      <h4>{title}</h4>
      <div>
        {cards.map((card) => (
          <CardBox key={card.id} title={card.title} />
        ))}
      </div>
      <input
        type="text"
        className="input"
        placeholder="Yeni kart..."
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

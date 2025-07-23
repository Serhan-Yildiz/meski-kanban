import React from "react";
import CardBox from "./CardBox";

export default function ListColumn({ title, cards = [], onAddCard }) {
  return (
    <div className="list">
      <h4 style={{ marginBottom: "10px" }}>{title}</h4>
      <div>
        {cards.map((card) => (
          <CardBox key={card.id} title={card.title} />
        ))}
      </div>
      <input
        type="text"
        className="input"
        placeholder="Yeni kart..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            onAddCard(e.target.value);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
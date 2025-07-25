import React from "react";
import CardBox from "./CardBox";
import "../App.css";

const ListColumn = ({ title, cards }) => {
  return (
    <div className="list-column">
      <div className="list-header">
        <h3>{title}</h3>
        <span className="card-count">{cards.length}</span>
      </div>
      <div className="card-list">
        {cards.map((card, idx) => (
          <CardBox
            key={idx}
            title={card.title}
            tags={card.tags}
            assignees={card.assignees}
          />
        ))}
        <div className="add-card-placeholder">+ Add a card</div>
      </div>
    </div>
  );
};

export default ListColumn;

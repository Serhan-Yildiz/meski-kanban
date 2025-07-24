import React from "react";

export default function BoardTile({ title, onClick }) {
  return (
    <div className="board-tile" onClick={onClick}>
      <h3>{title}</h3>
    </div>
  );
}

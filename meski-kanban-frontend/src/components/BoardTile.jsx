import React from "react";

export default function BoardTile({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card"
      style={{ cursor: "pointer" }}
    >
      <h3>{title}</h3>
    </div>
  );
}
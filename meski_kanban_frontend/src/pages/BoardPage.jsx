import React from "react";
import ListColumn from "../components/ListColumn";
import "../App.css"; // özel stil dosyan

const BoardPage = () => {
  const boardTitle = "Project Alpha";

  const boardData = [
    {
      title: "To Do",
      cards: [
        {
          title: "Design new landing page",
          tags: ["Design", "High Priority"],
          assignees: 2,
        },
        {
          title: "Set up database schema",
          tags: ["Backend"],
          assignees: 1,
        },
        {
          title: "Research user feedback",
          tags: ["Research"],
          assignees: 1,
        },
      ],
    },
    {
      title: "In Progress",
      cards: [
        {
          title: "Implement authentication",
          tags: ["Backend", "Security"],
          assignees: 2,
        },
        {
          title: "Create mobile wireframes",
          tags: ["Design", "Mobile"],
          assignees: 1,
        },
      ],
    },
    {
      title: "Review",
      cards: [
        {
          title: "API documentation",
          tags: ["Documentation"],
          assignees: 1,
        },
      ],
    },
    {
      title: "Done",
      cards: [
        {
          title: "Project kickoff meeting",
          tags: ["Meeting"],
          assignees: 3,
        },
        {
          title: "Initial project setup",
          tags: ["Setup"],
          assignees: 1,
        },
      ],
    },
  ];

  return (
    <div className="board-page">
      <div className="board-header">
        <a href="/dashboard" className="back-link">
          ← Back to Boards
        </a>
        <h1 className="board-title">{boardTitle}</h1>
        <div className="board-options">&hellip;</div>
      </div>

      <div className="list-container">
        {boardData.map((list, index) => (
          <ListColumn key={index} title={list.title} cards={list.cards} />
        ))}
        <div className="list-column placeholder">+ Add a list</div>
      </div>
    </div>
  );
};

export default BoardPage;

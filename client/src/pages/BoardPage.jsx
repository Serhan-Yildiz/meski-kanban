import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios.js";
import ListColumn from "../components/ListColumn";
import Navbar from "../components/Navbar";

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [id, token]);

  const fetchBoard = async () => {
    const res = await axios.get(`/boards/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBoard(res.data);
  };

  const fetchLists = async () => {
    const res = await axios.get(`/lists/board/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLists(res.data);
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;
    await axios.post(
      `/lists/board/${id}`,
      { title: newListTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewListTitle("");
    fetchLists();
  };

  return (
    <div className="board-page">
      <Navbar
        onAdd={createList}
        inputValue={newListTitle}
        setInputValue={setNewListTitle}
      />
      <h1>{board?.title || "Pano"}</h1>

      <div className="list-container">
        {lists.map((list, index) => (
          <ListColumn
            key={list.id}
            list={list}
            fetchLists={fetchLists}
            isFirst={index === 0}
            isLast={index === lists.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

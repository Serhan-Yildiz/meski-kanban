import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardTitle, setEditBoardTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error("Panolar alınamadı", err);
    }
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      await api.post("/boards", { title: newBoardTitle });
      setNewBoardTitle("");
      fetchBoards();
    } catch (err) {
      console.error("Pano oluşturulamadı", err);
    }
  };

  const startEditing = (board) => {
    setEditBoardId(board.id);
    setEditBoardTitle(board.title);
  };

  const cancelEditing = () => {
    setEditBoardId(null);
    setEditBoardTitle("");
  };

  const saveEditedBoard = async () => {
    try {
      await api.put(`/boards/${editBoardId}`, { title: editBoardTitle });
      cancelEditing();
      fetchBoards();
    } catch (err) {
      console.error("Pano güncellenemedi", err);
    }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Bu panoyu silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/boards/${id}`);
      fetchBoards();
    } catch (err) {
      console.error("Pano silinemedi", err);
    }
  };

  return (
    <>
      <Navbar
        onAdd={createBoard}
        inputValue={newBoardTitle}
        setInputValue={setNewBoardTitle}
      />

      <div className="container mt-4 dashboard">
        <h2 className="dashboard-heading mb-4">Panolarım</h2>

        <div className="row dashboard-board-list">
          {boards.map((board) => (
            <div key={board.id} className="col-md-6 col-lg-4 mb-4">
              <div className="dashboard-board card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  {editBoardId === board.id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editBoardTitle}
                        onChange={(e) => setEditBoardTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditedBoard();
                          }
                        }}
                      />
                      <div className="d-flex justify-content-end">
                        <button
                          onClick={saveEditedBoard}
                          className="btn btn-primary btn-sm me-2"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn btn-secondary btn-sm"
                        >
                          İptal
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="dashboard-board-title card-title mb-3"
                        onClick={() => navigate(`/boards/${board.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {board.title}
                      </div>
                      <div className="dashboard-board-controls d-flex justify-content-end gap-2">
                        <button
                          onClick={() => startEditing(board)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteBoard(board.id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

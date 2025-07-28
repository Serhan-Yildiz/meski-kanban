import pool from "../config/db.js";

export async function getAllLists(req, res) {
  try {
    const result = await pool.query("SELECT * FROM lists");
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Listeler alınamadı" });
  }
}

export async function getListById(req, res) {
  const listId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM lists WHERE id = $1", [
      listId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Liste bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Liste getirilemedi" });
  }
}

export async function getListsByBoardId(req, res) {
  const boardId = req.params.boardId;

  try {
    const listsRes = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1",
      [boardId]
    );
    const lists = [];

    for (const list of listsRes.rows) {
      const cardsRes = await pool.query(
        "SELECT * FROM cards WHERE list_id = $1",
        [list.id]
      );
      lists.push({
        ...list,
        cards: cardsRes.rows,
      });
    }

    res.json(lists);
  } catch {
    res.status(500).json({ message: "Listeler ve kartlar getirilemedi" });
  }
}

export async function createList(req, res) {
  const boardId = req.params.boardId;
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Başlık gerekli" });

  try {
    const result = await pool.query(
      "INSERT INTO lists (title, board_id) VALUES ($1, $2) RETURNING *",
      [title, boardId]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Liste oluşturulamadı" });
  }
}

export async function updateList(req, res) {
  const listId = req.params.id;
  const { title } = req.body;

  try {
    const result = await pool.query(
      "UPDATE lists SET title = $1 WHERE id = $2 RETURNING *",
      [title, listId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Liste bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Liste güncellenemedi" });
  }
}

export async function deleteList(req, res) {
  const listId = req.params.id;

  try {
    await pool.query("DELETE FROM lists WHERE id = $1", [listId]);
    res.json({ message: "Liste silindi" });
  } catch {
    res.status(500).json({ message: "Liste silinemedi" });
  }
}
s;

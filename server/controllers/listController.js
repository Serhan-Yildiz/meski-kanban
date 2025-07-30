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
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );

    const lists = [];

    for (const list of listsRes.rows) {
      const cardsRes = await pool.query(
        "SELECT * FROM cards WHERE list_id = $1 ORDER BY position ASC",
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

export const createList = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Başlık boş olamaz" });
  }

  try {
    const result = await pool.query(
      "SELECT MAX(position) as max_position FROM lists WHERE board_id = $1",
      [boardId]
    );

    const max = result.rows[0].max_position ?? 0;
    const newPosition = max + 1;

    const insertRes = await pool.query(
      `INSERT INTO lists (title, board_id, position, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [title, boardId, newPosition]
    );

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    console.error("Liste oluşturulamadı:", err);
    res
      .status(500)
      .json({ message: "Liste oluşturulamadı", error: err.message });
  }
};

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

export const moveList = async (req, res) => {
  const { id } = req.params;
  const { direction } = req.body;

  if (!["left", "right"].includes(direction)) {
    return res.status(400).json({ message: "Geçersiz yön (left/right)" });
  }

  try {
    const currentRes = await pool.query("SELECT * FROM lists WHERE id = $1", [
      id,
    ]);
    if (currentRes.rowCount === 0) {
      return res.status(404).json({ message: "Liste bulunamadı" });
    }

    const current = currentRes.rows[0];

    const allRes = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position",
      [current.board_id]
    );
    const lists = allRes.rows;
    const currentIndex = lists.findIndex((l) => l.id === current.id);

    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= lists.length) {
      return res.status(400).json({ message: "Daha fazla hareket edemez" });
    }

    const target = lists[targetIndex];

    await pool.query("UPDATE lists SET position = $1 WHERE id = $2", [
      target.position,
      current.id,
    ]);
    await pool.query("UPDATE lists SET position = $1 WHERE id = $2", [
      current.position,
      target.id,
    ]);

    res.json({ message: "Liste taşındı" });
  } catch (err) {
    console.error("Liste taşıma hatası:", err);
    res
      .status(500)
      .json({ message: "Liste taşıma hatası", error: err.message });
  }
};

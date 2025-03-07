import db from "../db.js";

export const getTeachers = (req, res) => {
  const user_id = req.user.id;
  db.all("SELECT * FROM teachers WHERE user_id = ?", [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

export const addTeacher = (req, res) => {
  const { name } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Ім’я є обов’язковим" });
  }

  const sql = `INSERT INTO teachers (name, user_id) VALUES (?, ?)`;
  const values = [name, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name });
  });
};

export const updateTeacher = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Ім’я є обов’язковим" });
  }

  const sql = `UPDATE teachers SET name = ? WHERE id = ? AND user_id = ?`;
  const values = [name, id, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Вчителя не знайдено або у вас немає доступу" });
    }

    res.json({ message: `Вчитель з ID ${id} успішно оновлений`, id, name });
  });
};

export const deleteTeacher = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = `DELETE FROM teachers WHERE id = ? AND user_id = ?`;
  const values = [id, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Вчителя не знайдено або у вас немає доступу" });
    }

    res.json({ message: `Вчитель з ID ${id} успішно видалений` });
  });
};

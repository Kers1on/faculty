import db from "../db.js";

export const getTeachers = (req, res) => {
  db.all("SELECT * FROM teachers", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

export const addTeacher = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `INSERT INTO teachers (name) VALUES (?)`;
  const values = [name];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Прибрати, коли буде готовий фронт
    res.json({ id: this.lastID, name });
  });
};

// (NON-TESTED)
export const updateTeacher = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Ім’я є обов’язковим" });
  }

  const sql = `UPDATE teachers SET name = ? WHERE id = ?`;

  db.run(sql, [name, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Вчителя не знайдено" });
    }

    res.json({ message: `Вчитель з ID ${id} успішно оновлений`, id, name });
  });
};

// (NON-TESTED)
export const deleteTeacher = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM teachers WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Вчителя не знайдено" });
    }

    res.json({ message: `Вчитель з ID ${id} успішно видалений` });
  });
};
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
    res.json({ id: this.lastID, name });
  });
};
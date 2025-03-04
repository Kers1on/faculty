import db from "../db.js";

export const getFaculty = (req, res) => {
  db.all("SELECT * FROM faculty", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

export const addFaculty = (req, res) => {
  const { name, department, teacher_id, form, hour, language, labor_hours } = req.body;

  if (!name || !department || !teacher_id || !form || !hour || !language || !labor_hours) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `INSERT INTO faculty (name, department, teacher_id, form, hour, language, labor_hours) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, department, teacher_id, form, hour, language, labor_hours];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, department, teacher_id, form, hour, language, labor_hours });
  });
};
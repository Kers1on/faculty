import db from "../db.js";

export const getStudents = (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

export const addStudent = (req, res) => {
  const { name, student_group, phone, email, department } = req.body;

  if (!name || !student_group || !phone || !email || !department) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `INSERT INTO students (name, student_group, phone, email, department) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, student_group, phone, email, department];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, student_group, phone, email, department });
  });
};
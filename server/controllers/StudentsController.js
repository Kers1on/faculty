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
    // Прибрати, коли буде готовий фронт
    res.json({ id: this.lastID, name, student_group, phone, email, department });
  });
};

export const updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, student_group, phone, email, department } = req.body;

  if (!name || !student_group || !phone || !email || !department) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `
    UPDATE students
    SET name = ?, student_group = ?, phone = ?, email = ?, department = ?
    WHERE id = ?
  `;
  const values = [name, student_group, phone, email, department, id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Студента з таким ID не знайдено" });
    }

    res.json({ message: `Студент з ID ${id} успішно оновлений` });
  });
};

export const deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM students WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Студента з таким ID не знайдено" });
    }

    res.json({ message: `Студент з ID ${id} успішно видалений` });
  });
};
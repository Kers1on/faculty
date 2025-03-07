import db from "../db.js";

export const getStudents = (req, res) => {
  const user_id = req.user.id;
  db.all("SELECT * FROM students WHERE user_id = ?", [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

export const addStudent = (req, res) => {
  const { name, student_group, phone, email, department } = req.body;
  const user_id = req.user.id;

  if (!name || !student_group || !phone || !email || !department) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `INSERT INTO students (name, student_group, phone, email, department, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, student_group, phone, email, department, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, student_group, phone, email, department });
  });
};

export const updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, student_group, phone, email, department } = req.body;
  const user_id = req.user.id;

  if (!name || !student_group || !phone || !email || !department) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `
    UPDATE students
    SET name = ?, student_group = ?, phone = ?, email = ?, department = ?
    WHERE id = ? AND user_id = ?
  `;
  const values = [name, student_group, phone, email, department, id, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Студента з таким ID не знайдено або у вас немає доступу" });
    }

    res.json({ message: `Студент з ID ${id} успішно оновлений` });
  });
};

export const deleteStudent = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = `DELETE FROM students WHERE id = ? AND user_id = ?`;

  db.run(sql, [id, user_id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Студента з таким ID не знайдено або у вас немає доступу" });
    }

    res.json({ message: `Студент з ID ${id} успішно видалений` });
  });
};
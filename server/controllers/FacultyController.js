import db from "../db.js";

// Faculty
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
    // Прибрати, коли буде готовий фронт
    res.json({ id: this.lastID, name, department, teacher_id, form, hour, language, labor_hours });
  });
};

// Facultative group
// (NON-TESTED)
export const getFacultativeGroup = (req, res) => {
  const { group_name, faculty_id } = req.query;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name, labor_hours FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err || !faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено" });
    }

    const facultyName = faculty.name.replace(/\s+/g, "_");
    const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;
    const labCount = faculty.labor_hours;

    let labColumns = "";
    for (let i = 1; i <= labCount; i++) {
      labColumns += `lr${i}, `;
    }

    labColumns = labColumns.slice(0, -2);

    const selectQuery = `
      SELECT s.id, s.name, s.student_group, f.final_grade, f.completion_date, ${labColumns}
      FROM students s
      LEFT JOIN ${tableName} f ON s.id = f.student_id
    `;

    db.all(selectQuery, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "У цій групі немає студентів" });
      }

      res.json(rows);
    });
  });
};

// (NON-TESTED)
export const createFacultativeGroup = (req, res) => {
  const { group_name, faculty_id } = req.body;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name, labor_hours FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено" });
    }

    const facultyName = faculty.name.replace(/\s+/g, "_");
    const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;
    const labCount = faculty.labor_hours;

    let labColumns = "";
    for (let i = 1; i <= labCount; i++) {
      labColumns += `lr${i} TEXT DEFAULT NULL, `;
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        faculty_id INTEGER NOT NULL,
        ${labColumns}
        final_grade TEXT DEFAULT NULL,
        completion_date TEXT DEFAULT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
      )
    `;

    db.run(createTableQuery, [], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.all("SELECT id FROM students WHERE student_group = ?", [group_name], (err, students) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (students.length === 0) {
          return res.status(404).json({ message: "У цій групі немає студентів" });
        }

        const insertQuery = `INSERT INTO ${tableName} (student_id, faculty_id) VALUES (?, ?)`;
        const stmt = db.prepare(insertQuery);

        students.forEach(({ id }) => {
          stmt.run(id, faculty_id);
        });

        stmt.finalize();

        res.status(201).json({ message: `Факультативна група ${tableName} створена` });
      });
    });
  });
};

// Оновлення оцінки в окремій комірці (Excel-type) (NON-TESTED)
export const updateLabResult = (req, res) => {
  const { group_name, faculty_id, student_id, lab_name, lab_score } = req.body;

  if (!group_name || !faculty_id || !student_id || !lab_name) {
    return res.status(400).json({ error: "Обов’язкові поля відсутні" });
  }

  db.get("SELECT name FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err || !faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено" });
    }

    const facultyName = faculty.name.replace(/\s+/g, "_");
    const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;

    const updateQuery = `UPDATE ${tableName} SET ${lab_name} = ? WHERE student_id = ?`;

    db.run(updateQuery, [lab_score, student_id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Оцінка ${lab_name} оновлена на ${lab_score}` });
    });
  });
};

// (NON-TESTED)
export const deleteFacultativeGroup = (req, res) => {
  const { group_name, faculty_id } = req.body;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err || !faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено" });
    }

    const facultyName = faculty.name.replace(/\s+/g, "_");
    const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;

    const dropTableQuery = `DROP TABLE IF EXISTS ${tableName}`;

    db.run(dropTableQuery, [], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Факультативна група ${tableName} успішно видалена` });
    });
  });
};
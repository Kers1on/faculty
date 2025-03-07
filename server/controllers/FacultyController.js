import db from "../db.js";

// ========================================================== Faculty ==========================================================
export const getFaculty = (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT 
      faculty.id, 
      faculty.name, 
      faculty.department, 
      teachers.name AS teacher_name,
      faculty.form, 
      faculty.hour, 
      faculty.language, 
      faculty.labor_hours
    FROM faculty
    LEFT JOIN teachers ON faculty.teacher_id = teachers.id
    WHERE faculty.user_id = ?
  `;

  db.all(sql, [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

export const addFaculty = (req, res) => {
  const { name, department, teacher_id, form, hour, language, labor_hours } = req.body;
  const user_id = req.user.id;

  if (!name || !department || !teacher_id || !form || !hour || !language || !labor_hours) {
    return res.status(400).json({ error: "Всі поля є обов’язковими" });
  }

  const sql = `INSERT INTO faculty (name, department, teacher_id, form, hour, language, labor_hours, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, department, teacher_id, form, hour, language, labor_hours, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, department, teacher_id, form, hour, language, labor_hours });
  });
};

export const updateFaculty = (req, res) => {
  const { id } = req.params;
  const { name, department, teacher_id, form, hour, language, labor_hours } = req.body;
  const user_id = req.user.id;

  const sql = `
    UPDATE faculty
    SET name = ?, department = ?, teacher_id = ?, form = ?, hour = ?, language = ?, labor_hours = ?
    WHERE id = ? AND user_id = ?
  `;
  const values = [name, department, teacher_id, form, hour, language, labor_hours, id, user_id];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Факультет з таким ID не знайдено або у вас немає доступу" });
    }

    res.json({ message: `Факультет з ID ${id} успішно оновлений` });
  });
};

// (NON-TESTED) ВИДАЛЯЮТЬСЯ УСІ ТАБЛИЦІ, ПОВʼЯЗАНІ З ЦИМ ФАКУЛЬТАТИВОМ
// export const deleteFaculty = (req, res) => {
//   const { faculty_id } = req.body;

//   if (!faculty_id) {
//     return res.status(400).json({ error: "Необхідне поле faculty_id" });
//   }

//   db.get("SELECT * FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (!faculty) {
//       return res.status(404).json({ error: "Факультатив не знайдено" });
//     }

//     const deleteQuery = "DELETE FROM faculty WHERE id = ?";
//     db.run(deleteQuery, [faculty_id], function (err) {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       // Видалити всі таблиці, які можуть бути пов'язані з факультативом (якщо потрібно)
//       const facultyName = faculty.name.replace(/\s+/g, "_");
//       const dropGroupTableQuery = `DROP TABLE IF EXISTS facultative_${facultyName}`;

//       db.run(dropGroupTableQuery, [], (err) => {
//         if (err) {
//           return res.status(500).json({ error: err.message });
//         }

//         res.json({ message: `Факультатив з ID ${faculty_id} успішно видалений` });
//       });
//     });
//   });
// };

export const deleteFaculty = (req, res) => {
  const { faculty_id } = req.body;
  const user_id = req.user.id;

  if (!faculty_id) {
    return res.status(400).json({ error: "Необхідне поле faculty_id" });
  }

  db.get("SELECT * FROM faculty WHERE id = ? AND user_id = ?", [faculty_id, user_id], (err, faculty) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено або у вас немає доступу" });
    }

    const deleteQuery = "DELETE FROM faculty WHERE id = ? AND user_id = ?";
    db.run(deleteQuery, [faculty_id, user_id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Видалити всі таблиці, пов'язані з факультативом
      const facultyName = faculty.name.replace(/\s+/g, "_");
      const dropTablesQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ?`;

      db.all(dropTablesQuery, [`facultative_${facultyName}_%`], (err, tables) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        tables.forEach((table) => {
          db.run(`DROP TABLE IF EXISTS ${table.name}`);
        });

        res.json({ message: `Факультатив з ID ${faculty_id} і всі пов'язані групи успішно видалені` });
      });
    });
  });
};

// ===================================================== Facultative group =====================================================
// (NON-TESTED)
export const getFacultativeGroup = (req, res) => {
  const { group_name, faculty_id } = req.query;
  const user_id = req.user.id;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name, labor_hours FROM faculty WHERE id = ? AND user_id = ?", [faculty_id, user_id], (err, faculty) => {
    if (err || !faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено або у вас немає доступу" });
    }

    const facultyName = faculty.name.replace(/\s+/g, "_");
    const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;
    const labCount = faculty.labor_hours;

    let labColumns = "";
    for (let i = 1; i <= labCount; i++) {
      labColumns += `f.lr${i}, `;
    }

    labColumns = labColumns.slice(0, -2);

    const selectQuery = `
      SELECT s.id, s.name, ${labColumns}, f.final_grade, f.completion_date, s.students_group
      FROM students s
      LEFT JOIN ${tableName} f ON s.id = f.student_id
      WHERE s.user_id = ?
    `;

    db.all(selectQuery, [user_id], (err, rows) => {
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
  const user_id = req.user.id;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name, labor_hours FROM faculty WHERE id = ? AND user_id = ?", [faculty_id, user_id], (err, faculty) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!faculty) {
      return res.status(404).json({ error: "Факультатив не знайдено або у вас немає доступу" });
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
        user_id INTEGER NOT NULL,
        ${labColumns}
        final_grade TEXT DEFAULT NULL,
        completion_date TEXT DEFAULT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    db.run(createTableQuery, [], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.all("SELECT id FROM students WHERE student_group = ? AND user_id = ?", [group_name, user_id], (err, students) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (students.length === 0) {
          return res.status(404).json({ message: "У цій групі немає студентів" });
        }

        const insertQuery = `INSERT INTO ${tableName} (student_id, faculty_id, user_id) VALUES (?, ?, ?)`;
        const stmt = db.prepare(insertQuery);

        students.forEach(({ id }) => {
          stmt.run(id, faculty_id, user_id);
        });

        stmt.finalize();

        res.status(201).json({ message: `Факультативна група ${tableName} створена` });
      });
    });
  });
};

// export const updateLabResult = (req, res) => {
//   const { group_name, faculty_id, student_id, lab_name, lab_score } = req.body;

//   if (!group_name || !faculty_id || !student_id || !lab_name) {
//     return res.status(400).json({ error: "Обов’язкові поля відсутні" });
//   }

//   db.get("SELECT name FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
//     if (err || !faculty) {
//       return res.status(404).json({ error: "Факультатив не знайдено" });
//     }

//     const facultyName = faculty.name.replace(/\s+/g, "_");
//     const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;

//     const updateQuery = `UPDATE ${tableName} SET ${lab_name} = ? WHERE student_id = ?`;

//     db.run(updateQuery, [lab_score, student_id], function (err) {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ message: `Оцінка ${lab_name} оновлена на ${lab_score}` });
//     });
//   });
// };

// Оновлення оцінки в окремій комірці (Excel-type) (NON-TESTED)
export const updateLabResult = (req, res) => {
  const { group_name, faculty_id, student_id, lab_name, lab_score } = req.body;
  const user_id = req.user.id;

  if (!group_name || !faculty_id || !student_id || !lab_name) {
    return res.status(400).json({ error: "Обов’язкові поля відсутні" });
  }

  db.get("SELECT name, user_id FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err || !faculty || faculty.user_id !== user_id) {
      return res.status(404).json({ error: "Факультатив не знайдено або у вас немає доступу" });
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
// export const deleteFacultativeGroup = (req, res) => {
//   const { group_name, faculty_id } = req.body;

//   if (!group_name || !faculty_id) {
//     return res.status(400).json({ error: "Необхідні дані відсутні" });
//   }

//   db.get("SELECT name FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
//     if (err || !faculty) {
//       return res.status(404).json({ error: "Факультатив не знайдено" });
//     }

//     const facultyName = faculty.name.replace(/\s+/g, "_");
//     const tableName = `facultative_${facultyName}_${group_name.replace(/\s+/g, "_")}`;

//     const dropTableQuery = `DROP TABLE IF EXISTS ${tableName}`;

//     db.run(dropTableQuery, [], (err) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ message: `Факультативна група ${tableName} успішно видалена` });
//     });
//   });
// };

export const deleteFacultativeGroup = (req, res) => {
  const { group_name, faculty_id } = req.body;
  const user_id = req.user.id;

  if (!group_name || !faculty_id) {
    return res.status(400).json({ error: "Необхідні дані відсутні" });
  }

  db.get("SELECT name, user_id FROM faculty WHERE id = ?", [faculty_id], (err, faculty) => {
    if (err || !faculty || faculty.user_id !== user_id) {
      return res.status(404).json({ error: "Факультатив не знайдено або у вас немає доступу" });
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
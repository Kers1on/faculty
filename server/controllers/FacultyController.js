import db from "../db.js";

export const getFaculty = (req, res) => {
  db.all("SELECT * FROM faculty", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}

// Add POST requests
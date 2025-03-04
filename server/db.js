const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'data', 'database.db'), (err) => {
  if (err) {
    console.error("Помилка підключення до бази даних:", err.message);
  } else {
    console.log("Підключено до SQLite бази даних.");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    student_group TEXT NOT NULL,
    phone INTEGER NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    department TEXT NOT NULL,
    teacher_id INTEGER NOT NULL,
    form TEXT NOT NULL,
    hour INTEGER NOT NULL,
    language TEXT NOT NULL,
    labor_hours INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
  )`);
});

module.exports = db;
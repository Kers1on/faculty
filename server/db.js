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
});

module.exports = db;
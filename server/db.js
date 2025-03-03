const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/data/database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTOINCREMENT, name TEXT, PASSWORD TEXT)");
});

db.close();

export {db}
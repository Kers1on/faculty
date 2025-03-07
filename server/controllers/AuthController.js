import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { name, password, confirmPassword } = req.body;

  if (!name || !password || !confirmPassword) {
    return res.status(400).json({ message: "Всі поля обов'язкові" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Паролі не співпадають" });
  }

  db.get("SELECT * FROM users WHERE name = ?", [name], async (err, user) => {
    if (err) return res.status(500).json({ message: "Помилка сервера" });
    if (user) return res.status(400).json({ message: "Користувач вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (name, password) VALUES (?, ?)", [name, hashedPassword], function (err) {
      if (err) return res.status(500).json({ message: "Помилка реєстрації" });

      const userId = this.lastID;
      const token = jwt.sign({ id: userId, name }, "CRU4289RUN28JYC2djsaklfh)DISA(278432YJ5762", { expiresIn: "7d" });

      res.status(201).json({ message: "Користувач зареєстрований", token, user_id: userId });
    });
  });
};

export const login = (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Всі поля обов'язкові" });
  }

  db.get("SELECT * FROM users WHERE name = ?", [name], async (err, user) => {
    if (err) return res.status(500).json({ message: "Помилка сервера" });
    if (!user) return res.status(400).json({ message: "Невірні дані" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Невірні дані" });

    const token = jwt.sign({ id: user.id, name: user.name }, "CRU4289RUN28JYC2djsaklfh)DISA(278432YJ5762", { expiresIn: "7d" });

    res.json({ token, user_id: user.id });
  });
};
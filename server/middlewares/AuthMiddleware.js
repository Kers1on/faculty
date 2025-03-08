import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  // if (!token) return res.status(401).json({ message: "Немає доступу" });

  if (!token) {
    // Дозволяємо продовжити без токена
    return next(); 
  }

  jwt.verify(token, "CRU4289RUN28JYC2djsaklfh)DISA(278432YJ5762", (err, user) => {
    if (err) return res.status(403).json({ message: "Невірний токен" });

    req.user = user;
    next();
  });
};

export default authenticateToken;
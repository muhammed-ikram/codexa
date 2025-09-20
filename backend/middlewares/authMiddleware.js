const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, "yourSecretKey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid Token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json("Access Denied");
  next();
};

module.exports = { verifyToken, isAdmin };

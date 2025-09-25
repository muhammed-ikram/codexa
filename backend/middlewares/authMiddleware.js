const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header
  let token = req.cookies.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
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

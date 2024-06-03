const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "ASDFGHJKL1234ZXCVBNM0987QWERTYUIOP456789";

const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.replace("Bearer ", "");

  try {
    if (!token) {
      throw new Error("No token provided");
    }

    //console.log("Token:", token);

    const decoded = jwt.verify(token, SECRET_KEY);

    //console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ error: "Authentication failed" + error.message });
  }
};

module.exports = authMiddleware;

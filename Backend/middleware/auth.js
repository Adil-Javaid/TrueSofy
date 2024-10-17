const jwt = require("jsonwebtoken");
const User = require("../Schema/User");

const authentication = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader); 

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found");
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.sendStatus(403);
  }
};

const authorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

module.exports = {
  authentication,
  authorized,
};

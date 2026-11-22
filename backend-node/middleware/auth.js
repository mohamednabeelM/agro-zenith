const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No authorization token, access denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "agro_zenith_secret_key_123");
    req.farmer = decoded.farmer;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

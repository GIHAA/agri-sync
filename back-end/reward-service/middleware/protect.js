const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove 'Bearer ' prefix from the token if present
    const jwtToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the JWT token
    jwt.verify(jwtToken, "your_jwt_secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }

      // Set the user ID in the request object
      req.user = { id: decoded.id };
      console.log("User ID:", req.user.id);
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = protect;

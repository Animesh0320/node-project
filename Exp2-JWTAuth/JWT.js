// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON body

// Secret key for JWT
const SECRET_KEY = "mySecretKey";

// Hardcoded user
const user = {
  username: "admin",
  password: "12345"
};

// Default route to check server
app.get("/", (req, res) => {
  res.send("JWT Backend Server is Running!");
});

// Login route - issues JWT token
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ message: "Login Successful", token });
  }

  res.status(401).json({ message: "Invalid Credentials" });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token Required" });

  const token = authHeader.split(" ")[1]; // "Bearer token"
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
}

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access Granted!", user: req.user });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

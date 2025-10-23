const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "mySecretKey";

// Hardcoded users with roles
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "mod", password: "mod123", role: "Moderator" },
  { username: "user", password: "user123", role: "User" }
];

// Default route
app.get("/", (req, res) => res.send("RBAC Server Running!"));

// Login route - issues JWT with role
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login Successful", token });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token Required" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
}

// Middleware for role-based access
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
}

// Protected routes
app.get("/admin", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

app.get("/moderator", verifyToken, authorizeRoles("Moderator"), (req, res) => {
  res.json({ message: "Welcome Moderator!", user: req.user });
});

app.get("/profile", verifyToken, authorizeRoles("Admin", "Moderator", "User"), (req, res) => {
  res.json({ message: "User Profile", user: req.user });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => console.log(`RBAC server running on port ${PORT}`));

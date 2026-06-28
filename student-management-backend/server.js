const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const markRoutes = require("./routes/markRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management Backend Running 🚀",
  });
});

// Routes
app.use("/students", studentRoutes);
app.use("/marks", markRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();

const {
  addMarks,
  getMarks,
  updateMarks,
  deleteMarks,
} = require("../controllers/markController");

// ===============================
// Add Marks
// POST /marks
// ===============================
router.post("/", addMarks);

// ===============================
// Get All Marks
// GET /marks
// ===============================
router.get("/", getMarks);

// ===============================
// Update Marks
// PUT /marks/:id
// ===============================
router.put("/:id", updateMarks);

// ===============================
// Delete Marks
// DELETE /marks/:id
// ===============================
router.delete("/:id", deleteMarks);

module.exports = router;

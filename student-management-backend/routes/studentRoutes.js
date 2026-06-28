const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStats,
} = require("../controllers/studentController");

// Create Student
router.post("/", createStudent);

// Get All Students
router.get("/", getStudents);

// Dashboard Stats
router.get("/stats", getStats);

// Get Student By ID
router.get("/:id", getStudentById);

// Update Student
router.put("/:id", updateStudent);

// Delete Student
router.delete("/:id", deleteStudent);

module.exports = router;

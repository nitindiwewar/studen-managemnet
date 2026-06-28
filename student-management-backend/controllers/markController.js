const pool = require("../config/db");

// ====================================
// Add Marks
// ====================================

const addMarks = async (req, res) => {
  try {
    const { student_id, subject, marks } = req.body;

    if (!student_id || !subject || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check Student Exists
    const student = await pool.query("SELECT * FROM students WHERE id = $1", [
      student_id,
    ]);

    if (student.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check Subject Already Exists
    const existing = await pool.query(
      "SELECT * FROM marks WHERE student_id=$1 AND subject=$2",
      [student_id, subject],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists for this student",
      });
    }

    const result = await pool.query(
      `INSERT INTO marks(student_id,subject,marks)
       VALUES($1,$2,$3)
       RETURNING *`,
      [student_id, subject, marks],
    );

    res.status(201).json({
      success: true,
      message: "Marks added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// Get All Marks
// ====================================

const getMarks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        marks.id,
        students.id AS student_id,
        students.name,
        students.course,
        marks.subject,
        marks.marks

      FROM marks

      INNER JOIN students
      ON students.id = marks.student_id

      ORDER BY students.name ASC
    `);

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ====================================
// Update Marks
// ====================================

const updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, marks } = req.body;

    if (!subject || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Subject and marks are required",
      });
    }

    const result = await pool.query(
      `UPDATE marks
       SET subject = $1,
           marks = $2
       WHERE id = $3
       RETURNING *`,
      [subject, marks, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Marks record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// Delete Marks
// ====================================

const deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM marks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Marks record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================================
// Export
// ====================================

module.exports = {
  addMarks,
  getMarks,
  updateMarks,
  deleteMarks,
};

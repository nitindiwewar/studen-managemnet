const pool = require("../config/db");

// ==============================
// Create Student
// ==============================
const createStudent = async (req, res) => {
  try {
    const { name, email, phone, age, gender, course, address, dob, avatar } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !age ||
      !gender ||
      !course ||
      !address ||
      !dob
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate email
    const emailExists = await pool.query(
      "SELECT * FROM students WHERE email=$1",
      [email],
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO students
      (name,email,phone,age,gender,course,address,dob,avatar)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [name, email, phone, age, gender, course, address, dob, avatar || ""],
    );

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Students
// Search
// Filter
// Sort
// Pagination
// ==============================

const getStudents = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      course = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    let where = [];
    let values = [];

    if (search) {
      values.push(`%${search}%`);

      where.push(
        `(name ILIKE $${values.length}
        OR email ILIKE $${values.length}
        OR phone ILIKE $${values.length})`,
      );
    }

    if (course) {
      values.push(course);

      where.push(`course=$${values.length}`);
    }

    let whereClause = "";

    if (where.length > 0) {
      whereClause = `WHERE ${where.join(" AND ")}`;
    }

    const allowedSort = ["name", "email", "age", "course", "created_at"];

    if (!allowedSort.includes(sortBy)) {
      sortBy = "name";
    }

    sortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const totalQuery = await pool.query(
      `SELECT COUNT(*) FROM students ${whereClause}`,
      values,
    );

    const total = parseInt(totalQuery.rows[0].count);

    values.push(limit);
    values.push(offset);

    const students = await pool.query(
      `
      SELECT *
      FROM students

      ${whereClause}

      ORDER BY ${sortBy} ${sortOrder}

      LIMIT $${values.length - 1}

      OFFSET $${values.length}
      `,
      values,
    );

    res.status(200).json({
      students: students.rows,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Get Student By ID (With Marks)
// ==============================

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const studentResult = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id],
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const marksResult = await pool.query(
      "SELECT subject, marks FROM marks WHERE student_id = $1",
      [id],
    );

    const marks = {};

    marksResult.rows.forEach((item) => {
      marks[item.subject] = item.marks;
    });

    const student = studentResult.rows[0];

    student.marks = marks;

    res.status(200).json(student);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Student
// ==============================

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, phone, age, gender, course, address, dob, avatar } =
      req.body;

    const result = await pool.query(
      `UPDATE students
      SET
      name=$1,
      email=$2,
      phone=$3,
      age=$4,
      gender=$5,
      course=$6,
      address=$7,
      dob=$8,
      avatar=$9
      WHERE id=$10
      RETURNING *`,
      [name, email, phone, age, gender, course, address, dob, avatar, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Student
// ==============================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Dashboard Stats
// ==============================

const getStats = async (req, res) => {
  try {
    const totalStudentsResult = await pool.query(
      "SELECT COUNT(*) AS total FROM students",
    );

    const totalStudents = Number(totalStudentsResult.rows[0].total);

    res.status(200).json({
      success: true,
      totalStudents,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Export
// ==============================

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStats,
};

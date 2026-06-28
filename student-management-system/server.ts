import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Define Student Interface
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  course: string;
  address: string;
  dob: string;
  marks: { [subject: string]: number };
  avatar: string;
}

// Seed Initial Student Data
let students: Student[] = [
  {
    id: "std-1",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 234-5678",
    age: 21,
    gender: "Male",
    course: "Computer Science",
    address: "742 Evergreen Terrace, Springfield",
    dob: "2005-04-12",
    marks: { "Mathematics": 92, "Programming": 95, "Database Systems": 88, "Web Dev": 94 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: "std-2",
    name: "Sophia Chen",
    email: "sophia.chen@university.edu",
    phone: "+1 (555) 876-5432",
    age: 20,
    gender: "Female",
    course: "Data Science",
    address: "123 Maple Street, Boston",
    dob: "2006-09-22",
    marks: { "Mathematics": 98, "Programming": 91, "Statistics": 96, "Machine Learning": 94 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia"
  },
  {
    id: "std-3",
    name: "Marcus Vance",
    email: "marcus.vance@university.edu",
    phone: "+1 (555) 345-6789",
    age: 22,
    gender: "Male",
    course: "Information Technology",
    address: "456 Oak Lane, Seattle",
    dob: "2004-01-15",
    marks: { "Networking": 85, "Cyber Security": 90, "System Admin": 87, "Cloud Computing": 82 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  },
  {
    id: "std-4",
    name: "Elena Rostova",
    email: "elena.rostova@university.edu",
    phone: "+1 (555) 456-7890",
    age: 21,
    gender: "Female",
    course: "Software Engineering",
    address: "89 Pine Boulevard, Chicago",
    dob: "2005-11-30",
    marks: { "Software Design": 94, "Programming": 96, "Data Structures": 92, "Testing": 89 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
  },
  {
    id: "std-5",
    name: "Amir Al-Sayed",
    email: "amir.alsayed@university.edu",
    phone: "+1 (555) 567-8901",
    age: 23,
    gender: "Male",
    course: "Artificial Intelligence",
    address: "101 Cedar Court, Austin",
    dob: "2003-07-08",
    marks: { "Calculus": 88, "Neural Networks": 92, "AI Ethics": 95, "Robotics": 84 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amir"
  },
  {
    id: "std-6",
    name: "Olivia Watson",
    email: "olivia.watson@university.edu",
    phone: "+1 (555) 678-9012",
    age: 20,
    gender: "Female",
    course: "Computer Science",
    address: "202 Elm Road, San Francisco",
    dob: "2006-03-19",
    marks: { "Mathematics": 81, "Programming": 88, "Database Systems": 84, "Web Dev": 90 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia"
  },
  {
    id: "std-7",
    name: "Lucas Fletcher",
    email: "lucas.fletcher@university.edu",
    phone: "+1 (555) 789-0123",
    age: 22,
    gender: "Male",
    course: "Software Engineering",
    address: "303 Birch Avenue, Denver",
    dob: "2004-08-24",
    marks: { "Software Design": 78, "Programming": 82, "Data Structures": 80, "Testing": 85 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"
  },
  {
    id: "std-8",
    name: "Chloe Dubois",
    email: "chloe.dubois@university.edu",
    phone: "+1 (555) 890-1234",
    age: 21,
    gender: "Female",
    course: "Data Science",
    address: "404 Aspen Way, Miami",
    dob: "2005-12-05",
    marks: { "Mathematics": 95, "Programming": 89, "Statistics": 92, "Machine Learning": 90 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe"
  },
  {
    id: "std-9",
    name: "Jackson Taylor",
    email: "jackson.taylor@university.edu",
    phone: "+1 (555) 901-2345",
    age: 22,
    gender: "Male",
    course: "Information Technology",
    address: "505 Redwood Lane, Portland",
    dob: "2004-10-10",
    marks: { "Networking": 74, "Cyber Security": 80, "System Admin": 78, "Cloud Computing": 81 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson"
  },
  {
    id: "std-10",
    name: "Isabella Martinez",
    email: "isabella.martinez@university.edu",
    phone: "+1 (555) 012-3456",
    age: 21,
    gender: "Female",
    course: "Artificial Intelligence",
    address: "606 Willow Drive, Phoenix",
    dob: "2005-02-14",
    marks: { "Calculus": 90, "Neural Networks": 89, "AI Ethics": 97, "Robotics": 91 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella"
  },
  {
    id: "std-11",
    name: "William Wright",
    email: "william.wright@university.edu",
    phone: "+1 (555) 123-4560",
    age: 23,
    gender: "Male",
    course: "Computer Science",
    address: "707 Cypress Street, Austin",
    dob: "2003-05-17",
    marks: { "Mathematics": 68, "Programming": 72, "Database Systems": 70, "Web Dev": 75 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=William"
  },
  {
    id: "std-12",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@university.edu",
    phone: "+1 (555) 234-5671",
    age: 20,
    gender: "Female",
    course: "Data Science",
    address: "808 Sakura Court, Los Angeles",
    dob: "2006-07-03",
    marks: { "Mathematics": 100, "Programming": 98, "Statistics": 99, "Machine Learning": 98 },
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki"
  }
];

// Helper to calculate student averages
function getAverageMarks(marks: { [key: string]: number }): number {
  const values = Object.values(marks);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  // GET /api/students - List, filter, search, sort, pagination
  app.get("/api/students", (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string || "").toLowerCase();
      const course = req.query.course as string || "";
      const sortBy = req.query.sortBy as string || "name"; // 'name' or 'marks'
      const sortOrder = req.query.sortOrder as string || "asc"; // 'asc' or 'desc'

      // Filter
      let filtered = students.filter(student => {
        const matchesSearch = 
          student.name.toLowerCase().includes(search) || 
          student.email.toLowerCase().includes(search) || 
          student.course.toLowerCase().includes(search);
        
        const matchesCourse = course ? student.course === course : true;
        
        return matchesSearch && matchesCourse;
      });

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === "marks") {
          const avgA = getAverageMarks(a.marks);
          const avgB = getAverageMarks(b.marks);
          return sortOrder === "asc" ? avgA - avgB : avgB - avgA;
        } else {
          // Sort by name
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        }
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const paginatedStudents = filtered.slice(startIndex, startIndex + limit);

      res.json({
        students: paginatedStudents,
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // GET /api/students/stats - Dashboard analytics helper
  app.get("/api/students/stats", (req, res) => {
    try {
      if (students.length === 0) {
        return res.json({
          totalStudents: 0,
          averageMarks: 0,
          topPerformer: null,
          recentStudents: []
        });
      }

      const totalStudents = students.length;
      
      let sumOfAverages = 0;
      let topStudent: Student | null = null;
      let topAvg = -1;

      students.forEach(student => {
        const avg = getAverageMarks(student.marks);
        sumOfAverages += avg;
        if (avg > topAvg) {
          topAvg = avg;
          topStudent = student;
        }
      });

      const averageMarks = Math.round((sumOfAverages / totalStudents) * 10) / 10;
      
      // Get 4 most recently added students (we'll assume the end of the array is newest, or simulate via id)
      const recentStudents = [...students].slice(-4).reverse();

      res.json({
        totalStudents,
        averageMarks,
        topPerformer: topStudent ? {
          id: topStudent.id,
          name: topStudent.name,
          course: topStudent.course,
          average: topAvg,
          avatar: topStudent.avatar
        } : null,
        recentStudents
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to compile stats" });
    }
  });

  // GET /api/students/:id - Get detail
  app.get("/api/students/:id", (req, res) => {
    try {
      const student = students.find(s => s.id === req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch student details" });
    }
  });

  // POST /api/students - Add student
  app.post("/api/students", (req, res) => {
    try {
      const { name, email, phone, age, gender, course, address, dob, marks } = req.body;

      // Validation
      if (!name || !email || !phone || !age || !gender || !course || !address || !dob || !marks) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if email already exists
      if (students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: "A student with this email already exists" });
      }

      const newId = `std-${Date.now()}`;
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.split(' ')[0])}`;

      const newStudent: Student = {
        id: newId,
        name,
        email,
        phone,
        age: parseInt(age),
        gender,
        course,
        address,
        dob,
        marks: marks || {},
        avatar
      };

      students.push(newStudent);
      res.status(201).json(newStudent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  // PUT /api/students/:id - Update student
  app.put("/api/students/:id", (req, res) => {
    try {
      const studentIndex = students.findIndex(s => s.id === req.params.id);
      if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
      }

      const { name, email, phone, age, gender, course, address, dob, marks } = req.body;

      // Validation
      if (!name || !email || !phone || !age || !gender || !course || !address || !dob || !marks) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check email duplicate excluding current student
      const duplicateEmail = students.some(
        (s, idx) => idx !== studentIndex && s.email.toLowerCase() === email.toLowerCase()
      );
      if (duplicateEmail) {
        return res.status(400).json({ error: "A student with this email already exists" });
      }

      // Update student fields
      students[studentIndex] = {
        ...students[studentIndex],
        name,
        email,
        phone,
        age: parseInt(age),
        gender,
        course,
        address,
        dob,
        marks,
        // Keep original avatar unless they rename, let's keep original or update with name
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.split(' ')[0])}`
      };

      res.json(students[studentIndex]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  // DELETE /api/students/:id - Delete student
  app.delete("/api/students/:id", (req, res) => {
    try {
      const studentIndex = students.findIndex(s => s.id === req.params.id);
      if (studentIndex === -1) {
        return res.status(404).json({ error: "Student not found" });
      }

      const deleted = students.splice(studentIndex, 1)[0];
      res.json({ message: "Student deleted successfully", id: deleted.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // Serve Vite assets or static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

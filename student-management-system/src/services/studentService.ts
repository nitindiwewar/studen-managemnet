import API from "./api";

export interface StudentQuery {
  page?: number;
  limit?: number;
  search?: string;
  course?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const StudentService = {
  // Get All Students
  getStudents: async (params: StudentQuery = {}) => {
    const response = await API.get("/students", { params });
    return response.data;
  },

  // Dashboard Statistics
  getStats: async () => {
    const response = await API.get("/students/stats");
    return response.data;
  },

  // Get Student By ID
  getStudentById: async (id: string) => {
    const response = await API.get(`/students/${id}`);
    return response.data;
  },

  // Create Student
  createStudent: async (student: any) => {
    const response = await API.post("/students", student);
    return response.data;
  },

  // Update Student
  updateStudent: async (id: string, student: any) => {
    const response = await API.put(`/students/${id}`, student);
    return response.data;
  },

  // Delete Student
  deleteStudent: async (id: string) => {
    const response = await API.delete(`/students/${id}`);
    return response.data;
  },
};
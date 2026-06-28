export interface Student {
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

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentStats {
  totalStudents: number;
  averageMarks: number;
  topPerformer: {
    id: string;
    name: string;
    course: string;
    average: number;
    avatar: string;
  } | null;
  recentStudents: Student[];
}

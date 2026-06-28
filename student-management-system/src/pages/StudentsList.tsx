import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { UserPlus, LayoutGrid, List, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { StudentService } from "../services/studentService";
import { Student, PaginationData } from "../types";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import StudentCard from "../components/StudentCard";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const COURSES = [
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Software Engineering",
  "Artificial Intelligence",
];

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Query/Filter states
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  // UI display toggles
  const [viewType, setViewType] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StudentService.getStudents({
        page,
        limit: 10,
        search,
        course,
        sortBy,
        sortOrder,
      });
      setStudents(data.students);
      setPagination(data.pagination);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch students roster. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [page, course, sortBy, sortOrder]);

  // Debounce/Trigger search filter independently (Wait, let's trigger search directly on enter or immediately with small delay, or immediately as they type, resetting page back to 1)
  useEffect(() => {
    setPage(1);
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleResetFilters = () => {
    setSearch("");
    setCourse("");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const handleDeleteTrigger = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const studentName = getStudentNameForDelete();
      await StudentService.deleteStudent(deleteId);
      toast.success(`Profile of ${studentName} deleted successfully`);
      setDeleteId(null);
      // Re-fetch current page or reset page if empty
      if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchStudents();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error deleting student profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStudentNameForDelete = () => {
    if (!deleteId) return "";
    return students.find((s) => s.id === deleteId)?.name || "this student";
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with title & Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Student Directory</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage enrollments, inspect subjects, edit data, or remove profiles</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle Controls */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200/50">
            <button
              onClick={() => setViewType("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewType === "table" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewType === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Add Student Button */}
          <Link
            to="/students/add"
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-blue-100/50 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Search and Filter Bar */}
      <SearchBar
        searchQuery={search}
        setSearchQuery={setSearch}
        selectedCourse={course}
        setSelectedCourse={setCourse}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        courses={COURSES}
        onReset={handleResetFilters}
      />

      {/* 3. Students Data Panel */}
      {loading ? (
        <Loader type={viewType === "table" ? "skeleton-table" : "skeleton-card"} count={5} />
      ) : error ? (
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Connection Error</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={fetchStudents}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Directory</span>
          </button>
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          title={search || course ? "No results found" : "Directory is empty"}
          description={
            search || course
              ? "We couldn't find any student profile matching your active search/filter parameters. Try refining your keywords."
              : "Get started by registering and enrolling your very first student into the platform."
          }
          actionLabel={search || course ? "Clear active filters" : "Enroll first student"}
          onAction={search || course ? handleResetFilters : () => navigate("/students/add")}
          iconType="search"
        />
      ) : (
        <div className="shadow-sm border border-slate-100 bg-white rounded-2xl overflow-hidden">
          {/* List display conditional on layout setting */}
          <AnimatePresence mode="wait">
            {viewType === "table" ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StudentTable students={students} onDelete={handleDeleteTrigger} />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30"
              >
                {students.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.15) }}
                  >
                    <StudentCard student={student} onDelete={handleDeleteTrigger} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table / Grid Pagination Footer */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.total}
            onPageChange={setPage}
            limit={pagination.limit}
          />
        </div>
      )}

      {/* 4. Delete Confirmation modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Deletion"
        confirmLabel={isDeleting ? "Deleting..." : "Delete Permanently"}
        type="danger"
      >
        <p>
          Are you absolutely sure you want to delete the student profile of{" "}
          <strong className="text-slate-800 font-bold">"{getStudentNameForDelete()}"</strong>?
        </p>
        <p className="mt-2 text-xs text-red-500 font-semibold">
          This operation is permanent and irreversible. All subject grades, registrations, and contact history will be cleared.
        </p>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Edit2,
  Trash2,
  Bookmark,
  User,
  Activity,
  UserCheck
} from "lucide-react";
import { StudentService } from "../services/studentService";
import { Student } from "../types";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { toast } from "sonner";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchStudentData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await StudentService.getStudentById(id);
      setStudent(data);
    } catch (err: any) {
      console.error(err);
      setError("We encountered an error trying to look up the student profile. It may have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  // Academic score calculation helpers
  const getAcademicScores = (marks: { [key: string]: number } = {}) => {
    const subjects = Object.keys(marks);
    const scores = Object.values(marks);
    if (scores.length === 0) {
      return { total: 0, maxPossible: 0, average: 0, grade: { label: "N/A", color: "bg-slate-100 text-slate-700" } };
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    const maxPossible = subjects.length * 100;
    const average = Math.round((total / subjects.length) * 10) / 10;

    // Grade logic
    let grade = { label: "F", color: "bg-red-50 text-red-700 border border-red-100" };
    if (average >= 90) grade = { label: "A+", color: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
    else if (average >= 80) grade = { label: "A", color: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
    else if (average >= 70) grade = { label: "B", color: "bg-blue-50 text-blue-700 border border-blue-100" };
    else if (average >= 60) grade = { label: "C", color: "bg-amber-50 text-amber-700 border border-amber-100" };
    else if (average >= 50) grade = { label: "D", color: "bg-orange-50 text-orange-700 border border-orange-100" };

    return {
      total,
      maxPossible,
      average,
      grade,
    };
  };

  const handleProfileDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const studentName = student?.name || "Student";
      await StudentService.deleteStudent(id);
      toast.success(`Profile of ${studentName} deleted successfully`);
      setIsDeleteOpen(false);
      navigate("/students");
    } catch (err: any) {
      console.error(err);
      toast.error("Error deleting student profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loader type="skeleton-details" />;
  }

  if (error || !student) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
        <h3 className="text-sm font-bold text-slate-800">Lookup Failed</h3>
        <p className="text-xs text-slate-500">{error || "The requested profile could not be loaded."}</p>
        <Link
          to="/students"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

const academic = getAcademicScores(student.marks || {});

  // Course Color Mapping
  const courseBadgeColors: { [key: string]: string } = {
    "Computer Science": "bg-blue-50 text-blue-700 border-blue-100",
    "Data Science": "bg-purple-50 text-purple-700 border-purple-100",
    "Information Technology": "bg-cyan-50 text-cyan-700 border-cyan-100",
    "Software Engineering": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Artificial Intelligence": "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  const courseBadge = courseBadgeColors[student.course] || "bg-slate-50 text-slate-700 border-slate-100";

  return (
    <div className="space-y-6">
      {/* Back button & profile action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/students"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Edit Button */}
          <Link
            to={`/students/edit/${student.id}`}
            className="inline-flex items-center space-x-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex items-center space-x-1.5 border border-transparent bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Student</span>
          </button>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 self-start">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
               src={
  student.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`
}
                alt={student.name}
                className="w-24 h-24 rounded-full border border-slate-200 bg-slate-50 p-1 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 text-white rounded-full border-2 border-white flex items-center justify-center" title="Active Scholar">
                <UserCheck className="w-2.5 h-2.5" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight leading-6">{student.name}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">ID: {student.id}</p>
            </div>

            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${courseBadge}`}>
              {student.course}
            </span>
          </div>

          {/* Demographic Metrics */}
          <div className="border-t border-slate-50 pt-5 space-y-3.5 text-xs font-semibold text-slate-500">
            <div className="flex items-center justify-between">
              <span>Age</span>
              <span className="text-slate-800 font-bold">{student.age} Years</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Gender</span>
              <span className="text-slate-800 font-bold">{student.gender}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[10px]">Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Info and Subject Scores (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Student Contact and Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3">Student Contact Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-slate-500">
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 tracking-wide uppercase">Email Address</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block truncate">{student.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 tracking-wide uppercase">Phone Number</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block whitespace-nowrap">{student.phone}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 tracking-wide uppercase">Date of Birth</span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">{student.dob}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 md:col-span-2">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 tracking-wide uppercase">Residential Address</span>
                  <span className="text-slate-800 font-bold text-xs mt-0.5 block leading-relaxed">{student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Academic Scores and Standing */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="text-sm font-bold text-slate-800">Academic Standing & Subject Grades</h4>
              <span className="text-xs text-slate-400 font-semibold">{student.course} Curriculum</span>
            </div>

            {/* KPI Scoring Ribbon */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Total Marks</span>
                <span className="text-base font-bold text-slate-800 block mt-1">
                  {academic.total} / {academic.maxPossible}
                </span>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Average Scored</span>
                <span className="text-base font-bold text-blue-600 block mt-1">{academic.average}%</span>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mb-1">Final Grade</span>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${academic.grade.color}`}>
                  {academic.grade.label}
                </span>
              </div>
            </div>

            {/* Subject wise detailed progress bar charts */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Detailed Subject Breakdown</span>
              <div className="space-y-5">
               {Object.entries(student.marks || {}).map(([subject, score]) => {
                  const scoreNum = Number(score);
                  // Determine color of progress bar
                  let barColor = "bg-red-500";
                  if (scoreNum >= 90) barColor = "bg-emerald-500";
                  else if (scoreNum >= 80) barColor = "bg-blue-600";
                  else if (scoreNum >= 70) barColor = "bg-indigo-500";
                  else if (scoreNum >= 60) barColor = "bg-amber-500";
                  else if (scoreNum >= 50) barColor = "bg-orange-500";

                  return (
                    <div key={subject} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-700">{subject}</span>
                        <span className="text-slate-800 font-bold">{score}%</span>
                      </div>
                      {/* Visual gauge */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all duration-1000`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleProfileDelete}
        title="Delete Student Profile"
        confirmLabel={isDeleting ? "Deleting..." : "Delete Permanently"}
        type="danger"
      >
        <p>
          Are you sure you want to permanently delete <strong className="text-slate-800 font-bold">"{student.name}"</strong>?
        </p>
        <p className="mt-2 text-xs text-red-500 font-semibold">
          This action cannot be undone. Doing so will permanently clear their registered grades and details.
        </p>
      </Modal>
    </div>
  );
}
